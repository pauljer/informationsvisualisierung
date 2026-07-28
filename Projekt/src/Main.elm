port module Main exposing (main)

{-| EnergyCharts Visual Analytics – drei verbundene Sichten aus drei
verschiedenen Bereichen, anwendungsgetrieben aus `energycharts_publicpower`:

1.  Gestapeltes Flächendiagramm  (Bereich *Zeitreihen*)
2.  Stunde×Tag-Heatmap           (Bereich *Pixel-orientiert*)
3.  Treemap der Erzeugungsstruktur (Bereich *Bäume*)

Alle drei stammen aus **einer** Abfrage (ein Land, ein Zeitfenster) und sind
über gemeinsame Zustände verbunden: Hover hebt eine Quelle überall hervor,
Klick auf einen Tag in der Heatmap fokussiert Flächendiagramm und Treemap.
-}

import Api
import Browser
import Chart.Heatmap as Heatmap
import Chart.StackedArea as StackedArea
import Chart.Treemap as Treemap
import Color
import Dict exposing (Dict)
import Energy exposing (Metric(..), Row)
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events as HE
import Html.Lazy
import Http
import Json.Decode as Decode
import Time



-- ============================================================
-- PORTS
-- ============================================================


{-| Scroll-Position aus JS (für die automatisch ein-/ausblendende Navbar). -}
port onScroll : (Float -> msg) -> Sub msg


{-| Setzt `data-theme` am <html> (Hell/Dunkel) über JS. -}
port setTheme : String -> Cmd msg



-- ============================================================
-- MODEL
-- ============================================================


type Status
    = NeedConnect
    | Connecting
    | LoadingBounds
    | LoadingRows
    | Ready
    | Failed String


type alias Model =
    { tokenInput : String
    , token : Maybe String
    , nowSeconds : Int
    , country : String
    , windowDays : Int
    , metric : Metric
    , latest : Maybe Int
    , ceilings : Dict String Int
    , rowsByCountry : Dict String (List Row)
    , status : Status
    , hovered : Maybe String
    , pinned : Maybe String
    , focusedDay : Maybe Int
    , mouse : ( Float, Float )
    , dark : Bool
    , navHidden : Bool
    , navPinned : Bool
    , lastScroll : Float
    , previewMetric : Maybe Metric
    , previewCountry : Maybe String
    , elapsed : Float
    }


{-| Aktuell dargestelltes Land: das per Hover vorgeschaute (sofern schon
geladen), sonst das ausgewählte. So bleibt beim Hover das bisherige Bild
stehen, bis die Vorschau-Daten da sind (kein Flackern/Leerstand). -}
activeCountry : Model -> String
activeCountry model =
    case model.previewCountry of
        Just p ->
            if Dict.member p model.rowsByCountry then
                p

            else
                model.country

        Nothing ->
            model.country


activeRows : Model -> List Row
activeRows model =
    Dict.get (activeCountry model) model.rowsByCountry |> Maybe.withDefault []


{-| Flag = `Date.now()` aus dem Browser (Millisekunden), um die jüngsten Daten
ohne langsame Voll-Tabellen-Abfrage einzugrenzen. -}
init : Float -> ( Model, Cmd Msg )
init nowMillis =
    ( { tokenInput = ""
      , token = Nothing
      , nowSeconds = round (nowMillis / 1000)
      , country = "all"
      , windowDays = 7
      , metric = SolarShare
      , latest = Nothing
      , ceilings = Dict.empty
      , rowsByCountry = Dict.empty
      , status = NeedConnect
      , hovered = Nothing
      , pinned = Nothing
      , focusedDay = Nothing
      , mouse = ( 0, 0 )
      , dark = False
      , navHidden = False
      , navPinned = False
      , lastScroll = 0
      , previewMetric = Nothing
      , previewCountry = Nothing
      , elapsed = 0
      }
    , Cmd.none
    )








-- ============================================================
-- UPDATE
-- ============================================================


type Msg
    = TokenInput String
    | Connect
    | GotToken (Result Http.Error String)
    | GotRecent (Result Http.Error (List ( String, Int, Int )))
    | GotCountryRows String (Result Http.Error (List Row))
    | SelectCountry String
    | SelectWindow Int
    | SelectMetric Metric
    | HoverSource (Maybe String)
    | PinSource String
    | MouseMove Float Float
    | ClickDay Int
    | Scrolled Float
    | ToggleTheme
    | ToggleNavPin
    | HoverMetric (Maybe Metric)
    | HoverCountry (Maybe String)
    | Tick
    | Reload


{-| Untergrenze für die „jüngste Daten"-Abfrage: Browser-Jetzt minus 90 Tage
(großzügige Marge über den Daten-Verzug; vermeidet die langsame
Voll-Tabellen-Abfrage). -}
lbOf : Model -> Int
lbOf model =
    model.nowSeconds - 90 * 86400


{-| `id`-Block `(lo, hi]` des Landes aus den Block-Obergrenzen ableiten:
`hi` = Obergrenze des Landes, `lo` = nächstkleinere Obergrenze (Blöcke sind
zusammenhängend und nach `id` geordnet). Unbekanntes Land -> ganzer Bereich. -}
boundsFor : Dict String Int -> String -> ( Int, Int )
boundsFor ceilings code =
    case Dict.get code ceilings of
        Just hi ->
            let
                lo =
                    Dict.values ceilings
                        |> List.filter (\v -> v < hi)
                        |> List.maximum
                        |> Maybe.withDefault 0
            in
            ( lo, hi )

        Nothing ->
            ( 0, Dict.values ceilings |> List.maximum |> Maybe.withDefault 2000000000 )


{-| Lädt die vollen 30 Tage eines Landes in den Cache. Bei `isPrimary` (das
aktuell gewählte Land) wird der Ladezustand angezeigt; Vorschau-Lädungen laufen
still im Hintergrund. -}
loadCountry : Bool -> String -> Model -> ( Model, Cmd Msg )
loadCountry isPrimary code model =
    case ( model.token, model.latest ) of
        ( Just token, Just tmax ) ->
            ( if isPrimary then
                { model | status = LoadingRows, focusedDay = Nothing, elapsed = 0 }

              else
                model
            , Api.loadCountryWindow token
                (boundsFor model.ceilings code)
                (tmax - maxWindowDays * 86400)
                (GotCountryRows code)
            )

        _ ->
            ( model, Cmd.none )


{-| Lädt ein Land nur, wenn es noch nicht im Cache liegt (Hover-Vorschau). -}
ensureCountry : String -> Model -> ( Model, Cmd Msg )
ensureCountry code model =
    if Dict.member code model.rowsByCountry then
        ( model, Cmd.none )

    else
        loadCountry False code model


{-| Lädt beim Verbinden **alle** Länder parallel in den Cache, damit der
Hover-Wechsel danach ohne Verzögerung sofort erfolgt. -}
loadAllCountries : Model -> ( Model, Cmd Msg )
loadAllCountries model =
    case ( model.token, model.latest ) of
        ( Just token, Just tmax ) ->
            ( { model | status = LoadingRows, elapsed = 0, focusedDay = Nothing }
            , countries
                |> List.map
                    (\( code, _ ) ->
                        Api.loadCountryWindow token
                            (boundsFor model.ceilings code)
                            (tmax - maxWindowDays * 86400)
                            (GotCountryRows code)
                    )
                |> Cmd.batch
            )

        _ ->
            ( model, Cmd.none )


{-| Es werden immer die vollen 30 Tage geladen; 7/14 Tage sind daraus abgeleitet
(clientseitig gefiltert) und ohne erneutes Laden umschaltbar. -}
maxWindowDays : Int
maxWindowDays =
    30


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        TokenInput s ->
            ( { model | tokenInput = s }, Cmd.none )

        Connect ->
            let
                manual =
                    String.trim model.tokenInput
            in
            if manual /= "" then
                ( { model | token = Just manual, status = LoadingBounds, elapsed = 0 }
                , Api.getRecent manual (lbOf model) GotRecent
                )

            else
                ( { model | status = Connecting, elapsed = 0 }, Api.getToken GotToken )

        GotToken (Ok t) ->
            ( { model | token = Just t, status = LoadingBounds }
            , Api.getRecent t (lbOf model) GotRecent
            )

        GotToken (Err e) ->
            ( { model | status = Failed ("Token konnte nicht geholt werden – läuft der Proxy? (" ++ httpErr e ++ ")") }
            , Cmd.none
            )

        GotRecent (Ok triples) ->
            let
                tmax =
                    triples |> List.map (\( _, _, u ) -> u) |> List.maximum

                ceilings =
                    List.foldl
                        (\( c, i, _ ) d -> Dict.update c (\m -> Just (max i (Maybe.withDefault 0 m))) d)
                        Dict.empty
                        triples
            in
            case tmax of
                Just t ->
                    loadAllCountries { model | latest = Just t, ceilings = ceilings }

                Nothing ->
                    ( { model | status = Failed "Keine aktuellen Daten gefunden (Zeitfenster zu eng?)." }, Cmd.none )

        GotRecent (Err e) ->
            ( { model | status = Failed (httpErr e) }, Cmd.none )

        GotCountryRows code (Ok rows) ->
            -- Server liefert bereits ein Land; Filter als Sicherheitsnetz.
            ( { model
                | rowsByCountry =
                    Dict.insert code (List.filter (\r -> r.countryId == code) rows) model.rowsByCountry
                , status =
                    if code == model.country then
                        Ready

                    else
                        model.status
              }
            , Cmd.none
            )

        GotCountryRows code (Err e) ->
            ( { model
                | status =
                    if code == model.country then
                        Failed (httpErr e)

                    else
                        model.status
              }
            , Cmd.none
            )

        SelectCountry c ->
            let
                m2 =
                    { model | country = c, previewCountry = Nothing }
            in
            if Dict.member c model.rowsByCountry then
                ( { m2 | status = Ready }, Cmd.none )

            else
                loadCountry True c m2

        HoverCountry mc ->
            case mc of
                Just code ->
                    ensureCountry code { model | previewCountry = Just code }

                Nothing ->
                    ( { model | previewCountry = Nothing }, Cmd.none )

        SelectWindow d ->
            -- Kein Nachladen: alle Fenster stecken bereits in den 30-Tage-Daten.
            ( { model | windowDays = d }, Cmd.none )

        SelectMetric m ->
            ( { model | metric = m, previewMetric = Nothing }, Cmd.none )

        HoverMetric mm ->
            ( { model | previewMetric = mm }, Cmd.none )

        Tick ->
            ( { model | elapsed = model.elapsed + 0.1 }, Cmd.none )

        HoverSource ms ->
            ( { model | hovered = ms }, Cmd.none )

        PinSource name ->
            ( { model
                | pinned =
                    if model.pinned == Just name then
                        Nothing

                    else
                        Just name
              }
            , Cmd.none
            )

        MouseMove x y ->
            ( { model | mouse = ( x, y ) }, Cmd.none )

        Scrolled y ->
            let
                delta =
                    y - model.lastScroll

                hidden =
                    if y < 90 then
                        False

                    else if delta > 6 then
                        True

                    else if delta < -6 then
                        False

                    else
                        model.navHidden
            in
            ( { model | lastScroll = y, navHidden = hidden }, Cmd.none )

        ToggleTheme ->
            let
                d =
                    not model.dark
            in
            ( { model | dark = d }
            , setTheme
                (if d then
                    "dark"

                 else
                    "light"
                )
            )

        ToggleNavPin ->
            ( { model | navPinned = not model.navPinned }, Cmd.none )

        ClickDay d ->
            ( { model
                | focusedDay =
                    if model.focusedDay == Just d then
                        Nothing

                    else
                        Just d
              }
            , Cmd.none
            )

        Reload ->
            loadAllCountries model


httpErr : Http.Error -> String
httpErr err =
    case err of
        Http.BadUrl u ->
            "BadUrl " ++ u

        Http.Timeout ->
            "Timeout"

        Http.NetworkError ->
            "Netzwerkfehler (läuft der Proxy auf Port 3001?)"

        Http.BadStatus s ->
            "Status " ++ String.fromInt s

        Http.BadBody b ->
            "Antwort nicht lesbar: " ++ String.left 120 b



-- ============================================================
-- VIEW
-- ============================================================


view : Model -> Html Msg
view model =
    let
        rows =
            activeRows model

        -- Platzhalter-/Vorschau-Zeilen (alle Werte null -> 0) ausblenden.
        visibleRows =
            rows
                |> List.filter (\r -> Energy.totalGeneration r > 0 || r.load > 0)
    in
    Html.div [ HA.class "app", onMouseMove MouseMove ]
        [ topNav model
        , Html.div [ HA.class "page" ]
            [ if List.isEmpty visibleRows then
                emptyView model

              else
                -- Charts in `lazy` gekapselt: bei reiner Mausbewegung (Tooltip)
                -- werden sie nicht neu gezeichnet – nur bei Hover/Pin/Metrik/Fenster/Land/Daten.
                Html.Lazy.lazy6 chartsView
                    model.hovered
                    model.pinned
                    (Maybe.withDefault model.metric model.previewMetric)
                    model.focusedDay
                    model.windowDays
                    rows
            ]
        , tooltipView model
        ]


{-| Effektive Hervorhebung: ein fixierter (angeklickter) Eintrag dominiert,
sonst der gerade überfahrene. -}
highlightOf : Maybe String -> Maybe String -> Maybe String
highlightOf pinned hovered =
    case pinned of
        Just _ ->
            pinned

        Nothing ->
            hovered


onMouseMove : (Float -> Float -> msg) -> Html.Attribute msg
onMouseMove tagger =
    HE.on "mousemove"
        (Decode.map2 tagger
            (Decode.field "clientX" Decode.float)
            (Decode.field "clientY" Decode.float)
        )


tooltipView : Model -> Html Msg
tooltipView model =
    case model.hovered of
        Just name ->
            let
                ( x, y ) =
                    model.mouse
            in
            Html.div
                [ HA.class "tooltip"
                , HA.style "left" (String.fromFloat x ++ "px")
                , HA.style "top" (String.fromFloat y ++ "px")
                ]
                [ Html.div [ HA.class "tt-head" ]
                    [ Html.span
                        [ HA.class "tt-dot"
                        , HA.style "background" (Color.toCssString (Energy.bandColorByName name))
                        ]
                        []
                    , Html.text name
                    ]
                , Html.div [ HA.class "tt-body" ] [ Html.text (Energy.bandInfo name) ]
                , Html.div [ HA.class "tt-hint" ]
                    [ Html.text
                        (if model.pinned == Just name then
                            "Klick: Fixierung lösen"

                         else
                            "Klick: fixieren"
                        )
                    ]
                ]

        Nothing ->
            Html.text ""


topNav : Model -> Html Msg
topNav model =
    Html.node "nav"
        [ HA.class (navClass model) ]
        [ Html.div [ HA.class "topnav-inner" ]
            -- Marken-Säule links (volle Höhe)
            [ Html.div [ HA.class "brand-col" ]
                [ Html.div [ HA.class "brand-mark" ] [ Html.text "⚡" ]
                , Html.div [ HA.class "brand-lockup" ]
                    [ Html.div [ HA.class "brand-name" ] [ Html.text "EnergyCharts" ]
                    , Html.div [ HA.class "brand-tag" ] [ Html.text "VISUAL ANALYTICS" ]
                    ]
                ]

            -- Rechts: eine flache Zeile – Steuerungen · Quellen · Status/Aktionen/CTA
            , Html.div [ HA.class "nav-main" ]
                [ Html.div [ HA.class "nav-line" ]
                    [ controlCluster model
                    , Html.div [ HA.class "nav-actions" ]
                        [ Html.div [ HA.class "action-group" ]
                            [ iconToggle model.dark
                                ToggleTheme
                                (if model.dark then
                                    "ico-sun"

                                 else
                                    "ico-moon"
                                )
                                "Hell-/Dunkelmodus umschalten"
                            , iconToggle model.navPinned ToggleNavPin "ico-pin" "Leiste dauerhaft einblenden"
                            ]
                        , primaryButton model
                        ]
                    ]
                , Html.div [ HA.class "nav-sub" ] [ legend model ]
                ]
            ]
        ]


{-| Verbinden **und** Aktualisieren in einem Button – zeigt live, was gerade
im Hintergrund passiert und wie lange es dauert. -}
primaryButton : Model -> Html Msg
primaryButton model =
    let
        busy =
            isBusy model.status

        ( label, iconClass ) =
            case model.status of
                Connecting ->
                    ( "Token", "ico-refresh" )

                LoadingBounds ->
                    ( "Struktur", "ico-refresh" )

                LoadingRows ->
                    ( "Lädt", "ico-refresh" )

                Ready ->
                    ( "Aktualisieren", "ico-refresh" )

                _ ->
                    ( "Verbinden", "ico-link" )

        action =
            if model.latest == Nothing then
                Connect

            else
                Reload

        timeTxt =
            if busy then
                " · " ++ oneDecimal model.elapsed ++ "s"

            else
                ""

        -- Batterie-Füllstand je Ladephase
        fillPct =
            case model.status of
                Connecting ->
                    "30%"

                LoadingBounds ->
                    "62%"

                LoadingRows ->
                    "88%"

                _ ->
                    "100%"
    in
    Html.button
        [ HA.classList [ ( "btn", True ), ( "btn-primary", True ), ( "is-busy", busy ) ]
        , HE.onClick action
        , HA.disabled busy
        , HA.style "--fill" fillPct
        ]
        [ Html.span [ HA.class "btn-fill" ] []
        , Html.span [ HA.class "btn-face" ]
            [ Html.span
                [ HA.class
                    ("ico "
                        ++ iconClass
                        ++ (if busy then
                                " spin"

                            else
                                ""
                           )
                    )
                ]
                []
            , Html.text (label ++ timeTxt)
            ]
        ]


oneDecimal : Float -> String
oneDecimal x =
    String.fromFloat (toFloat (round (x * 10)) / 10)


navClass : Model -> String
navClass model =
    String.join " "
        (List.filterMap identity
            [ Just "topnav"
            , if model.navHidden && not model.navPinned then
                Just "is-hidden"

              else
                Nothing
            , if model.navPinned then
                Just "is-pinned"

              else
                Nothing
            ]
        )


iconToggle : Bool -> Msg -> String -> String -> Html Msg
iconToggle active msg iconClass tip =
    Html.button
        [ HA.classList [ ( "icon-btn", True ), ( "is-on", active ) ]
        , HE.onClick msg
        , HA.title tip
        ]
        [ Html.span [ HA.class ("ico " ++ iconClass) ] [] ]


emptyHint : Model -> String
emptyHint model =
    case model.status of
        Ready ->
            "Keine Daten für " ++ countryLabel model.country ++ " im gewählten Zeitfenster – in dieser Entwicklungs-DB enthält das Land evtl. nur Platzhalter. Bitte ein anderes Land wählen."

        _ ->
            "Noch keine Daten geladen – bitte oben rechts auf „Verbinden“ klicken."


emptyView : Model -> Html Msg
emptyView model =
    Html.div [ HA.class "empty" ]
        [ Html.span [ HA.class "empty-emoji" ] [ Html.text "📭" ]
        , Html.span [] [ Html.text (emptyHint model) ]
        ]


controlCluster : Model -> Html Msg
controlCluster model =
    Html.div [ HA.class "control-cluster" ]
        [ control "ico-globe" "Land"
            (Html.div [ HA.class "land-wrap" ]
                [ dropdown [ HE.onMouseLeave (HoverCountry Nothing) ]
                    (countryFlag model.country ++ "  " ++ countryLabel model.country)
                    (List.map
                        (\( code, name ) ->
                            dropdownItem (code == model.country)
                                [ HE.onMouseOver (HoverCountry (Just code)) ]
                                (SelectCountry code)
                                (countryFlag code ++ "  " ++ name)
                        )
                        countries
                    )
                , countBadge model
                ]
            )
        , control "ico-calendar" "Zeitfenster"
            (Html.div [ HA.class "segmented" ]
                (List.map (windowButton model.windowDays) [ 7, 14, 30 ])
            )
        , control "ico-gauge" "Metrik"
            (dropdown
                [ HE.onMouseLeave (HoverMetric Nothing) ]
                (Energy.metricLabel model.metric)
                (List.map
                    (\m ->
                        dropdownItem (m == model.metric)
                            [ HE.onMouseOver (HoverMetric (Just m)) ]
                            (SelectMetric m)
                            (Energy.metricLabel m)
                    )
                    [ SolarShare, RenewableShare, LoadMetric ]
                )
            )
        ]


control : String -> String -> Html Msg -> Html Msg
control iconClass labelText child =
    Html.div [ HA.class "control" ]
        [ Html.span [ HA.class "control-label" ]
            [ Html.span [ HA.class ("ico ico-sm " ++ iconClass) ] []
            , Html.text labelText
            ]
        , child
        ]


{-| Custom-Dropdown: öffnet automatisch beim Hover (CSS), schließt beim Verlassen.
Für die Metrik löst Hover eine Live-Vorschau aus (siehe `HoverMetric`). -}
dropdown : List (Html.Attribute Msg) -> String -> List (Html Msg) -> Html Msg
dropdown extra current items =
    Html.div (HA.class "dropdown" :: extra)
        [ Html.div [ HA.class "dropdown-trigger", HA.tabindex 0 ]
            [ Html.span [ HA.class "dropdown-value" ] [ Html.text current ]
            , Html.span [ HA.class "ico ico-sm ico-caret" ] []
            ]
        , Html.div [ HA.class "dropdown-menu" ] items
        ]


dropdownItem : Bool -> List (Html.Attribute Msg) -> Msg -> String -> Html Msg
dropdownItem active extra clickMsg label =
    Html.div
        (HA.classList [ ( "dropdown-item", True ), ( "is-active", active ) ]
            :: HE.onClick clickMsg
            :: extra
        )
        [ Html.span [ HA.class "di-check" ] []
        , Html.text label
        ]


windowButton : Int -> Int -> Html Msg
windowButton current d =
    Html.button
        [ HA.classList [ ( "seg-btn", True ), ( "is-active", current == d ) ]
        , HE.onClick (SelectWindow d)
        ]
        [ Html.text (String.fromInt d ++ " T") ]


{-| Elegant ins „Land" integrierte Anzeige: geladene Messpunkte (Ready),
sonst ein Fehler-Hinweis. Während des Ladens bleibt sie leer (der Button zeigt
den Fortschritt). -}
countBadge : Model -> Html Msg
countBadge model =
    let
        count =
            Dict.get (activeCountry model) model.rowsByCountry
                |> Maybe.withDefault []
                |> List.length
    in
    case model.status of
        Ready ->
            if count > 0 then
                Html.span
                    [ HA.class "count-badge"
                    , HA.title (String.fromInt count ++ " Messpunkte · " ++ String.fromInt model.windowDays ++ " Tage geladen")
                    ]
                    [ Html.span [ HA.class "count-dot" ] []
                    , Html.text (String.fromInt count ++ " Pkt")
                    ]

            else
                Html.text ""

        Failed e ->
            Html.span [ HA.class "count-badge is-error", HA.title e ] [ Html.text "Fehler" ]

        _ ->
            Html.text ""


legend : Model -> Html Msg
legend model =
    let
        hl =
            highlightOf model.pinned model.hovered
    in
    Html.div [ HA.class "legend", HA.tabindex 0 ]
        [ Html.span [ HA.class "legend-kicker" ] [ Html.text "Quellen" ]
        , Html.span [ HA.class "ico ico-sm ico-caret legend-caret" ] []
        , Html.div [ HA.class "legend-chips" ]
            (List.map (legendChip hl model.pinned) Energy.bands)
        ]


legendChip : Maybe String -> Maybe String -> Energy.Band -> Html Msg
legendChip hl pinned band =
    let
        dim =
            case hl of
                Nothing ->
                    False

                Just h ->
                    h /= band.name

        isPinned =
            pinned == Just band.name
    in
    Html.span
        [ HA.classList
            [ ( "chip", True )
            , ( "is-dim", dim )
            , ( "is-pinned", isPinned )
            ]
        , HE.onMouseOver (HoverSource (Just band.name))
        , HE.onMouseOut (HoverSource Nothing)
        , HE.onClick (PinSource band.name)
        ]
        [ Html.span [ HA.class "swatch", HA.style "background" (Color.toCssString band.color) ] []
        , Html.text band.name
        ]


chartsView : Maybe String -> Maybe String -> Metric -> Maybe Int -> Int -> List Row -> Html Msg
chartsView hovered pinned metric focusedDay windowDays rows =
    let
        hl =
            highlightOf pinned hovered

        allSorted =
            rows
                |> List.filter (\r -> Energy.totalGeneration r > 0 || r.load > 0)
                |> List.sortBy .unixSeconds

        -- 7/14/30 Tage clientseitig aus den geladenen 30-Tage-Daten schneiden.
        tmaxLoaded =
            allSorted |> List.map .unixSeconds |> List.maximum |> Maybe.withDefault 0

        sortedRows =
            List.filter (\r -> r.unixSeconds >= tmaxLoaded - windowDays * 86400) allSorted

        heatCells =
            Energy.binHourly metric sortedRows

        treemapRows =
            case focusedDay of
                Just d ->
                    List.filter (\r -> Energy.dayOf r.unixSeconds == d) sortedRows

                Nothing ->
                    sortedRows

        focusNote =
            case focusedDay of
                Just d ->
                    Just (" · Fokus auf " ++ Energy.dayLabel d ++ " (erneut klicken zum Aufheben)")

                Nothing ->
                    Nothing
    in
    Html.div [ HA.class "chart-stack" ]
        [ chartCard "1" "Erzeugungsmix & Last im Zeitverlauf"
            "Gestapelte Erzeugung nach Quelle; die gestrichelte Linie ist die Last. Erreicht die Stapelhöhe die Linie, ist der Bedarf gedeckt."
            focusNote
            (StackedArea.view
                { width = 1120
                , height = 450
                , rows = sortedRows
                , hovered = hl
                , focusedDay = focusedDay
                , onHover = HoverSource
                , onPin = PinSource
                }
            )
        , Html.div [ HA.class "chart-grid" ]
            [ chartCard "2" (Energy.metricLabel metric ++ " nach Stunde & Tag")
                "Jede Zelle ist ein Stunden-Pixel (x = Tag, y = Stunde). Klick auf einen Tag fokussiert die anderen beiden Sichten."
                Nothing
                (Heatmap.view
                    { width = 660
                    , height = 480
                    , cells = heatCells
                    , extent = Energy.heatExtent heatCells
                    , unit = Energy.metricUnit metric
                    , interpolator = Energy.metricInterpolator metric
                    , focusedDay = focusedDay
                    , onClickDay = ClickDay
                    }
                )
            , chartCard "3" "Erzeugungsstruktur"
                "Fläche ∝ Energieanteil im Zeitraum, gruppiert in Erneuerbar und Konventionell."
                Nothing
                (Treemap.view
                    { width = 660
                    , height = 480
                    , sums = Energy.sumByBand treemapRows
                    , hovered = hl
                    , onHover = HoverSource
                    , onPin = PinSource
                    }
                )
            ]
        ]


chartCard : String -> String -> String -> Maybe String -> Html Msg -> Html Msg
chartCard index title sub focusNote chart =
    Html.section [ HA.class "card" ]
        [ Html.div [ HA.class "card-head" ]
            [ Html.span [ HA.class "card-index" ] [ Html.text index ]
            , Html.h3 [ HA.class "card-title" ] [ Html.text title ]
            ]
        , Html.p [ HA.class "card-sub" ]
            (Html.text sub
                :: (case focusNote of
                        Just n ->
                            [ Html.span [ HA.class "focus-note" ] [ Html.text n ] ]

                        Nothing ->
                            []
                   )
            )
        , Html.div [ HA.class "card-body" ] [ chart ]
        ]



-- ============================================================
-- LÄNDER & METRIK-AUSWAHL
-- ============================================================


{-| Nur Einträge, die in der bereitgestellten Entwicklungs-DB tatsächlich
befüllt sind (viele Länder – u. a. DE, AT, NL, ES – enthalten dort nur
Null-Platzhalter). `all` ist das durchgehend gepflegte Europa-Aggregat und
daher die robuste Voreinstellung. DE bleibt wählbar, falls die vollständige
DB es führt; sonst greift der „keine Daten"-Hinweis.
-}
countries : List ( String, String )
countries =
    [ ( "all", "Europa (gesamt)" )
    , ( "fr", "Frankreich" )
    , ( "it", "Italien" )
    , ( "pl", "Polen" )
    , ( "cz", "Tschechien" )
    , ( "ch", "Schweiz" )
    , ( "be", "Belgien" )
    , ( "se", "Schweden" )
    , ( "no", "Norwegen" )
    , ( "dk", "Dänemark" )
    , ( "de", "Deutschland" )
    ]


countryLabel : String -> String
countryLabel code =
    countries
        |> List.filter (\( c, _ ) -> c == code)
        |> List.head
        |> Maybe.map Tuple.second
        |> Maybe.withDefault (String.toUpper code)


{-| Flaggen-Emoji je Land (Europa-Aggregat = 🇪🇺). -}
countryFlag : String -> String
countryFlag code =
    case code of
        "all" ->
            "🇪🇺"

        "fr" ->
            "🇫🇷"

        "it" ->
            "🇮🇹"

        "pl" ->
            "🇵🇱"

        "cz" ->
            "🇨🇿"

        "ch" ->
            "🇨🇭"

        "be" ->
            "🇧🇪"

        "se" ->
            "🇸🇪"

        "no" ->
            "🇳🇴"

        "dk" ->
            "🇩🇰"

        "de" ->
            "🇩🇪"

        _ ->
            "🏳️"


countryOption : String -> ( String, String ) -> Html Msg
countryOption current ( code, name ) =
    Html.option [ HA.value code, HA.selected (code == current) ]
        [ Html.text name ]


metricKey : Metric -> String
metricKey m =
    case m of
        SolarShare ->
            "solar"

        RenewableShare ->
            "ee"

        LoadMetric ->
            "load"


metricFromString : String -> Metric
metricFromString s =
    case s of
        "ee" ->
            RenewableShare

        "load" ->
            LoadMetric

        _ ->
            SolarShare


metricOption : Metric -> Metric -> Html Msg
metricOption current m =
    Html.option [ HA.value (metricKey m), HA.selected (m == current) ]
        [ Html.text (Energy.metricLabel m) ]



-- ============================================================
-- MAIN
-- ============================================================


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ onScroll Scrolled
        , if isBusy model.status then
            Time.every 100 (\_ -> Tick)

          else
            Sub.none
        ]


isBusy : Status -> Bool
isBusy status =
    case status of
        Connecting ->
            True

        LoadingBounds ->
            True

        LoadingRows ->
            True

        _ ->
            False


main : Program Float Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }
