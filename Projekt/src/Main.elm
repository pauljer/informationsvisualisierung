module Main exposing (main)

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
import Energy exposing (Metric(..), Row)
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events as HE
import Http



-- ============================================================
-- MODEL
-- ============================================================


type Status
    = NeedConnect
    | Connecting
    | LoadingLatest
    | Loading Int
    | Ready
    | Failed String


type alias Model =
    { tokenInput : String
    , token : Maybe String
    , country : String
    , windowDays : Int
    , metric : Metric
    , latest : Maybe Int
    , rows : List Row
    , pagesLoaded : Int
    , status : Status
    , hovered : Maybe String
    , focusedDay : Maybe Int
    }


maxPages : Int
maxPages =
    24


init : () -> ( Model, Cmd Msg )
init _ =
    ( { tokenInput = ""
      , token = Nothing
      , country = "all"
      , windowDays = 7
      , metric = SolarShare
      , latest = Nothing
      , rows = []
      , pagesLoaded = 0
      , status = NeedConnect
      , hovered = Nothing
      , focusedDay = Nothing
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
    | GotLatest (Result Http.Error (Maybe Int))
    | GotPage (Result Http.Error (List Row))
    | SelectCountry String
    | SelectWindow Int
    | SelectMetric Metric
    | HoverSource (Maybe String)
    | ClickDay Int
    | Reload


tminOf : Model -> Int
tminOf model =
    Maybe.withDefault 0 model.latest - model.windowDays * 86400


{-| Startet das paginierte Laden des aktuellen Fensters neu. -}
beginPaging : Model -> ( Model, Cmd Msg )
beginPaging model =
    case ( model.token, model.latest ) of
        ( Just token, Just tmax ) ->
            ( { model | rows = [], pagesLoaded = 0, status = Loading 0, focusedDay = Nothing }
            , Api.loadPage token (tmax - model.windowDays * 86400) 0 GotPage
            )

        _ ->
            ( model, Cmd.none )


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
                ( { model | token = Just manual, status = LoadingLatest }
                , Api.getLatest manual GotLatest
                )

            else
                ( { model | status = Connecting }, Api.getToken GotToken )

        GotToken (Ok t) ->
            ( { model | token = Just t, status = LoadingLatest }, Api.getLatest t GotLatest )

        GotToken (Err e) ->
            ( { model | status = Failed ("Token konnte nicht geholt werden – läuft der Proxy? (" ++ httpErr e ++ ")") }
            , Cmd.none
            )

        GotLatest (Ok (Just tmax)) ->
            beginPaging { model | latest = Just tmax }

        GotLatest (Ok Nothing) ->
            ( { model | status = Failed "Keine Daten in der Tabelle gefunden." }, Cmd.none )

        GotLatest (Err e) ->
            ( { model | status = Failed (httpErr e) }, Cmd.none )

        GotPage (Ok pageRows) ->
            let
                newPages =
                    model.pagesLoaded + 1

                filtered =
                    List.filter (\r -> r.countryId == model.country) pageRows

                acc =
                    model.rows ++ filtered

                token =
                    Maybe.withDefault "" model.token
            in
            if List.length pageRows == Api.pageLimit && newPages < maxPages then
                ( { model | rows = acc, pagesLoaded = newPages, status = Loading newPages }
                , Api.loadPage token (tminOf model) (newPages * Api.pageLimit) GotPage
                )

            else
                ( { model | rows = acc, pagesLoaded = newPages, status = Ready }, Cmd.none )

        GotPage (Err e) ->
            ( { model | status = Failed (httpErr e) }, Cmd.none )

        SelectCountry c ->
            beginPaging { model | country = c }

        SelectWindow d ->
            beginPaging { model | windowDays = d }

        SelectMetric m ->
            ( { model | metric = m }, Cmd.none )

        HoverSource ms ->
            ( { model | hovered = ms }, Cmd.none )

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
            beginPaging model


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
        -- Platzhalter-/Vorschau-Zeilen (alle Werte null -> 0) ausblenden.
        sortedRows =
            model.rows
                |> List.filter (\r -> Energy.totalGeneration r > 0 || r.load > 0)
                |> List.sortBy .unixSeconds
    in
    Html.div [ HA.style "font-family" "'Avenir Next','Segoe UI',sans-serif", HA.style "color" "#1f2a1f" ]
        [ Html.h1 [ HA.style "margin" "0 0 4px" ] [ Html.text "EnergyCharts – Visual Analytics" ]
        , Html.p [ HA.style "margin" "0 0 14px", HA.style "color" "#4e5b4e" ]
            [ Html.text "Stromerzeugung in Europa und einzelnen Ländern: Zusammensetzung über die Zeit, Tagesrhythmus und Strukturanteile – drei verbundene Sichten." ]
        , controlPanel model
        , statusView model
        , if List.isEmpty sortedRows then
            Html.p [ HA.style "color" "#4e5b4e", HA.style "margin-top" "18px" ]
                [ Html.text (emptyHint model) ]

          else
            chartsView model sortedRows
        ]


emptyHint : Model -> String
emptyHint model =
    case model.status of
        Ready ->
            "Keine Daten für " ++ countryLabel model.country ++ " im gewählten Zeitfenster (in dieser DB evtl. nur Platzhalter – anderes Land wählen)."

        _ ->
            "Noch keine Daten geladen – bitte auf 'Verbinden' klicken."


controlPanel : Model -> Html Msg
controlPanel model =
    Html.div
        [ HA.style "display" "flex"
        , HA.style "flex-wrap" "wrap"
        , HA.style "gap" "16px"
        , HA.style "align-items" "flex-end"
        , HA.style "padding" "12px 14px"
        , HA.style "border" "1px solid rgba(31,42,31,0.18)"
        , HA.style "border-radius" "12px"
        , HA.style "background" "rgba(255,255,255,0.7)"
        ]
        [ field "Land"
            (Html.select [ HE.onInput SelectCountry, selectStyle, HA.value model.country ]
                (List.map (countryOption model.country) countries)
            )
        , field "Zeitfenster"
            (Html.div [ HA.style "display" "flex", HA.style "gap" "6px" ]
                (List.map (windowButton model.windowDays) [ 7, 14, 30 ])
            )
        , field "Heatmap-Metrik"
            (Html.select [ HE.onInput (SelectMetric << metricFromString), selectStyle, HA.value (metricKey model.metric) ]
                (List.map (metricOption model.metric) [ SolarShare, RenewableShare, LoadMetric ])
            )
        , field "Verbindung"
            (Html.div [ HA.style "display" "flex", HA.style "gap" "6px" ]
                [ Html.input
                    [ HA.placeholder "Token optional (sonst Proxy)"
                    , HA.value model.tokenInput
                    , HE.onInput TokenInput
                    , HA.style "height" "34px"
                    , HA.style "width" "180px"
                    , HA.style "padding" "0 8px"
                    , HA.style "border-radius" "8px"
                    , HA.style "border" "1px solid #7e8e7e"
                    ]
                    []
                , button "🔗 Verbinden" "#226f7a" Connect
                , button "↻" "#1f2a1f" Reload
                ]
            )
        , legend model.hovered
        ]


field : String -> Html Msg -> Html Msg
field labelText child =
    Html.label [ HA.style "display" "grid", HA.style "gap" "5px" ]
        [ Html.span [ HA.style "font-size" "12px", HA.style "font-weight" "600", HA.style "color" "#4e5b4e" ]
            [ Html.text labelText ]
        , child
        ]


selectStyle : Html.Attribute Msg
selectStyle =
    HA.style "height" "34px"


button : String -> String -> Msg -> Html Msg
button label bg msg =
    Html.button
        [ HE.onClick msg
        , HA.style "height" "34px"
        , HA.style "padding" "0 12px"
        , HA.style "background" bg
        , HA.style "color" "white"
        , HA.style "border" "none"
        , HA.style "border-radius" "8px"
        , HA.style "cursor" "pointer"
        , HA.style "font-weight" "600"
        ]
        [ Html.text label ]


windowButton : Int -> Int -> Html Msg
windowButton current d =
    Html.button
        [ HE.onClick (SelectWindow d)
        , HA.style "height" "34px"
        , HA.style "padding" "0 12px"
        , HA.style "border-radius" "8px"
        , HA.style "cursor" "pointer"
        , HA.style "font-weight" "600"
        , HA.style "border" "1px solid #6f8f5e"
        , HA.style "background"
            (if current == d then
                "#6f8f5e"

             else
                "white"
            )
        , HA.style "color"
            (if current == d then
                "white"

             else
                "#1f2a1f"
            )
        ]
        [ Html.text (String.fromInt d ++ " T") ]


legend : Maybe String -> Html Msg
legend hovered =
    Html.div [ HA.style "display" "flex", HA.style "flex-wrap" "wrap", HA.style "gap" "8px", HA.style "align-items" "center" ]
        (Html.span [ HA.style "font-size" "12px", HA.style "font-weight" "600", HA.style "color" "#4e5b4e" ] [ Html.text "Quellen:" ]
            :: List.map (legendChip hovered) Energy.bands
        )


legendChip : Maybe String -> Energy.Band -> Html Msg
legendChip hovered band =
    let
        active =
            hovered == Nothing || hovered == Just band.name
    in
    Html.span
        [ HE.onMouseOver (HoverSource (Just band.name))
        , HE.onMouseOut (HoverSource Nothing)
        , HA.style "display" "inline-flex"
        , HA.style "align-items" "center"
        , HA.style "gap" "5px"
        , HA.style "padding" "2px 7px"
        , HA.style "border-radius" "20px"
        , HA.style "cursor" "default"
        , HA.style "font-size" "12px"
        , HA.style "background" "rgba(255,255,255,0.6)"
        , HA.style "border" "1px solid rgba(31,42,31,0.12)"
        , HA.style "opacity"
            (if active then
                "1"

             else
                "0.35"
            )
        ]
        [ Html.span
            [ HA.style "width" "12px"
            , HA.style "height" "12px"
            , HA.style "border-radius" "3px"
            , HA.style "background" (Color.toCssString band.color)
            ]
            []
        , Html.text band.name
        ]


statusView : Model -> Html Msg
statusView model =
    let
        ( txt, col ) =
            case model.status of
                NeedConnect ->
                    ( "Bereit – auf 'Verbinden' klicken.", "#4e5b4e" )

                Connecting ->
                    ( "🔄 Hole Token …", "#995d00" )

                LoadingLatest ->
                    ( "🔄 Ermittle aktuellsten Zeitpunkt …", "#995d00" )

                Loading n ->
                    ( "🔄 Lade Daten … (Seite " ++ String.fromInt (n + 1) ++ ", " ++ String.fromInt (List.length model.rows) ++ " Zeilen für " ++ countryLabel model.country ++ ")", "#995d00" )

                Ready ->
                    ( "✅ " ++ countryLabel model.country ++ " · " ++ String.fromInt model.windowDays ++ " Tage · " ++ String.fromInt (List.length model.rows) ++ " Messpunkte geladen.", "#2f7a3e" )

                Failed e ->
                    ( "❌ " ++ e, "#9b1d20" )
    in
    Html.p [ HA.style "margin" "10px 2px", HA.style "color" col, HA.style "font-weight" "600" ]
        [ Html.text txt ]


chartsView : Model -> List Row -> Html Msg
chartsView model sortedRows =
    let
        focusNote =
            case model.focusedDay of
                Just d ->
                    " · Fokus: " ++ Energy.dayLabel d ++ " (Klick zum Aufheben)"

                Nothing ->
                    ""

        heatCells =
            Energy.binHourly model.metric sortedRows

        treemapRows =
            case model.focusedDay of
                Just d ->
                    List.filter (\r -> Energy.dayOf r.unixSeconds == d) sortedRows

                Nothing ->
                    sortedRows
    in
    Html.div []
        [ chartCard "1 · Erzeugungsmix & Last (Zeitreihe)"
            ("Gestapelte Erzeugung nach Quelle; die gestrichelte Linie ist die Last. Wo die Stapelhöhe die Last erreicht, ist der Bedarf gedeckt." ++ focusNote)
            (StackedArea.view
                { width = 940
                , height = 320
                , rows = sortedRows
                , hovered = model.hovered
                , focusedDay = model.focusedDay
                , onHover = HoverSource
                }
            )
        , Html.div
            [ HA.style "display" "grid"
            , HA.style "grid-template-columns" "repeat(auto-fit, minmax(360px, 1fr))"
            , HA.style "gap" "14px"
            , HA.style "margin-top" "14px"
            ]
            [ chartCard ("2 · " ++ Energy.metricLabel model.metric ++ " nach Stunde & Tag (Pixel-Heatmap)")
                "Jede Zelle = ein Stunden-Pixel (x = Tag, y = Stunde). Klick auf einen Tag fokussiert die anderen Sichten."
                (Heatmap.view
                    { width = 560
                    , height = 320
                    , cells = heatCells
                    , extent = Energy.heatExtent heatCells
                    , unit = Energy.metricUnit model.metric
                    , interpolator = Energy.metricInterpolator model.metric
                    , focusedDay = model.focusedDay
                    , onClickDay = ClickDay
                    }
                )
            , chartCard "3 · Erzeugungsstruktur (Treemap)"
                "Fläche ∝ Energieanteil im Zeitraum, gruppiert in Erneuerbar/Konventionell."
                (Treemap.view
                    { width = 560
                    , height = 320
                    , sums = Energy.sumByBand treemapRows
                    , hovered = model.hovered
                    , onHover = HoverSource
                    }
                )
            ]
        ]


chartCard : String -> String -> Html Msg -> Html Msg
chartCard title insight chart =
    Html.section
        [ HA.style "padding" "12px 14px"
        , HA.style "border" "1px solid rgba(31,42,31,0.18)"
        , HA.style "border-radius" "12px"
        , HA.style "background" "rgba(255,255,255,0.78)"
        ]
        [ Html.h3 [ HA.style "margin" "2px 0 2px" ] [ Html.text title ]
        , Html.p [ HA.style "margin" "0 0 8px", HA.style "font-size" "12.5px", HA.style "color" "#4e5b4e" ]
            [ Html.text insight ]
        , Html.div [ HA.style "overflow" "hidden" ] [ chart ]
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


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
