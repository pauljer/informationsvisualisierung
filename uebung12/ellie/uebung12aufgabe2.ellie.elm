module Main exposing (main)

{-| Übung 12.2 – Experimente mit Kräften am Force-Directed-Graph.

Grundlage ist das Beispiel `ForceDirectedGraph` mit dem
„Les Misérables"-Datensatz. Über ein Auswahlmenü lassen sich
verschiedene Kombinationen von Kräften umschalten:

  - Alle Standard-Kräfte (Referenz)
  - Ohne `Force.center`
  - Ohne `Force.manyBody` (nur Links)
  - Ohne `Force.links` (nur Abstoßung + Zentrum)
  - `customManyBody` mit sehr starker Abstoßung (−300)
  - `customManyBody` mit Anziehung (+30)
  - `customLinks` mit kurzer Distanz (15)
  - `customLinks` mit großer Distanz (120)
-}

import Browser
import Browser.Events
import Color
import Force exposing (State)
import Graph exposing (Edge, Graph, Node, NodeContext, NodeId)
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events as HE
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as Decode
import TypedSvg exposing (circle, g, line, svg, title)
import TypedSvg.Attributes as Attr exposing (class, fill, stroke, viewBox)
import TypedSvg.Attributes.InPx exposing (cx, cy, r, strokeWidth, x1, x2, y1, y2)
import TypedSvg.Core exposing (Attribute, Svg, text)
import TypedSvg.Types exposing (Paint(..))



-- ============================================================
-- KONSTANTEN
-- ============================================================


w : Float
w =
    900


h : Float
h =
    600



-- ============================================================
-- MODELL
-- ============================================================


type Scenario
    = Default
    | NoCenter
    | NoManyBody
    | NoLinks
    | StrongRepulsion
    | Attraction
    | ShortLinks
    | LongLinks


scenarios : List ( Scenario, String )
scenarios =
    [ ( Default, "Alle Standard-Kräfte (Referenz)" )
    , ( NoCenter, "Ohne center" )
    , ( NoManyBody, "Ohne manyBody (nur Links)" )
    , ( NoLinks, "Ohne Links (nur Abstoßung + Zentrum)" )
    , ( StrongRepulsion, "customManyBody: starke Abstoßung (−300)" )
    , ( Attraction, "customManyBody: Anziehung (+30)" )
    , ( ShortLinks, "customLinks: kurze Distanz (15)" )
    , ( LongLinks, "customLinks: lange Distanz (120)" )
    ]


scenarioName : Scenario -> String
scenarioName s =
    scenarios
        |> List.filter (\( sc, _ ) -> sc == s)
        |> List.head
        |> Maybe.map Tuple.second
        |> Maybe.withDefault ""


scenarioFromString : String -> Scenario
scenarioFromString str =
    case str of
        "NoCenter" ->
            NoCenter

        "NoManyBody" ->
            NoManyBody

        "NoLinks" ->
            NoLinks

        "StrongRepulsion" ->
            StrongRepulsion

        "Attraction" ->
            Attraction

        "ShortLinks" ->
            ShortLinks

        "LongLinks" ->
            LongLinks

        _ ->
            Default


scenarioToString : Scenario -> String
scenarioToString s =
    case s of
        Default ->
            "Default"

        NoCenter ->
            "NoCenter"

        NoManyBody ->
            "NoManyBody"

        NoLinks ->
            "NoLinks"

        StrongRepulsion ->
            "StrongRepulsion"

        Attraction ->
            "Attraction"

        ShortLinks ->
            "ShortLinks"

        LongLinks ->
            "LongLinks"


type alias Entity =
    Force.Entity NodeId { value : String }


type alias Drag =
    { start : ( Float, Float )
    , current : ( Float, Float )
    , index : NodeId
    }


type alias Model =
    { scenario : Scenario
    , drag : Maybe Drag
    , graph : Graph Entity ()
    , simulation : State NodeId
    }


type Msg
    = SelectScenario Scenario
    | DragStart NodeId ( Float, Float )
    | DragAt ( Float, Float )
    | DragEnd ( Float, Float )
    | Tick



-- ============================================================
-- INIT / SIMULATION
-- ============================================================


initializeNode : NodeContext String () -> NodeContext Entity ()
initializeNode ctx =
    { node = { label = Force.entity ctx.node.id ctx.node.label, id = ctx.node.id }
    , incoming = ctx.incoming
    , outgoing = ctx.outgoing
    }


buildSimulation : Scenario -> Graph Entity () -> State NodeId
buildSimulation sc graph =
    let
        ids =
            List.map .id (Graph.nodes graph)

        linkPairs =
            Graph.edges graph |> List.map (\e -> ( e.from, e.to ))

        defaultLinks =
            Force.links linkPairs

        defaultManyBody =
            Force.manyBody ids

        center =
            Force.center (w / 2) (h / 2)

        forces =
            case sc of
                Default ->
                    [ defaultLinks, defaultManyBody, center ]

                NoCenter ->
                    [ defaultLinks, defaultManyBody ]

                NoManyBody ->
                    [ defaultLinks, center ]

                NoLinks ->
                    [ defaultManyBody, center ]

                StrongRepulsion ->
                    [ defaultLinks
                    , Force.customManyBody 0.9 (List.map (\i -> ( i, -300 )) ids)
                    , center
                    ]

                Attraction ->
                    [ defaultLinks
                    , Force.customManyBody 0.9 (List.map (\i -> ( i, 30 )) ids)
                    , center
                    ]

                ShortLinks ->
                    [ Force.customLinks 1
                        (List.map
                            (\( a, b ) ->
                                { source = a, target = b, distance = 15, strength = Nothing }
                            )
                            linkPairs
                        )
                    , defaultManyBody
                    , center
                    ]

                LongLinks ->
                    [ Force.customLinks 1
                        (List.map
                            (\( a, b ) ->
                                { source = a, target = b, distance = 120, strength = Nothing }
                            )
                            linkPairs
                        )
                    , defaultManyBody
                    , center
                    ]
    in
    Force.simulation forces


init : () -> ( Model, Cmd Msg )
init _ =
    let
        graph =
            Graph.mapContexts initializeNode miserablesGraph
    in
    ( { scenario = Default
      , drag = Nothing
      , graph = graph
      , simulation = buildSimulation Default graph
      }
    , Cmd.none
    )



-- ============================================================
-- UPDATE
-- ============================================================


updateNode : ( Float, Float ) -> NodeContext Entity () -> NodeContext Entity ()
updateNode ( nx, ny ) ctx =
    let
        v =
            ctx.node.label
    in
    updateCtx ctx { v | x = nx, y = ny }


updateCtx : NodeContext Entity () -> Entity -> NodeContext Entity ()
updateCtx ctx value =
    let
        n =
            ctx.node
    in
    { ctx | node = { n | label = value } }


updateGraphWithList : Graph Entity () -> List Entity -> Graph Entity ()
updateGraphWithList =
    let
        upd value =
            Maybe.map (\ctx -> updateCtx ctx value)
    in
    List.foldr (\node graph -> Graph.update node.id (upd node) graph)


update : Msg -> Model -> Model
update msg ({ drag, graph, simulation } as model) =
    case msg of
        SelectScenario sc ->
            let
                freshGraph =
                    Graph.mapContexts initializeNode miserablesGraph
            in
            { model
                | scenario = sc
                , graph = freshGraph
                , simulation = buildSimulation sc freshGraph
                , drag = Nothing
            }

        Tick ->
            let
                ( newState, list ) =
                    Force.tick simulation (List.map .label (Graph.nodes graph))
            in
            case drag of
                Nothing ->
                    { model | graph = updateGraphWithList graph list, simulation = newState }

                Just { current, index } ->
                    { model
                        | graph =
                            Graph.update index (Maybe.map (updateNode current))
                                (updateGraphWithList graph list)
                        , simulation = newState
                    }

        DragStart index xy ->
            { model | drag = Just (Drag xy xy index) }

        DragAt xy ->
            case drag of
                Just { start, index } ->
                    { model
                        | drag = Just (Drag start xy index)
                        , graph = Graph.update index (Maybe.map (updateNode xy)) graph
                        , simulation = Force.reheat simulation
                    }

                Nothing ->
                    model

        DragEnd xy ->
            case drag of
                Just { index } ->
                    { model
                        | drag = Nothing
                        , graph = Graph.update index (Maybe.map (updateNode xy)) graph
                    }

                Nothing ->
                    { model | drag = Nothing }



-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.drag of
        Nothing ->
            if Force.isCompleted model.simulation then
                Sub.none

            else
                Browser.Events.onAnimationFrame (always Tick)

        Just _ ->
            Sub.batch
                [ Browser.Events.onMouseMove (Decode.map (.clientPos >> DragAt) Mouse.eventDecoder)
                , Browser.Events.onMouseUp (Decode.map (.clientPos >> DragEnd) Mouse.eventDecoder)
                , Browser.Events.onAnimationFrame (always Tick)
                ]


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = \msg model -> ( update msg model, Cmd.none )
        , subscriptions = subscriptions
        }



-- ============================================================
-- VIEW
-- ============================================================


onMouseDown : NodeId -> Attribute Msg
onMouseDown index =
    Mouse.onDown (.clientPos >> DragStart index)


linkElement : Graph Entity () -> Edge () -> Svg msg
linkElement graph edge =
    let
        getE id_ =
            Graph.get id_ graph |> Maybe.map (.node >> .label)
    in
    case ( getE edge.from, getE edge.to ) of
        ( Just s, Just t ) ->
            line
                [ strokeWidth 1
                , stroke (Paint (Color.rgb255 170 170 170))
                , x1 s.x
                , y1 s.y
                , x2 t.x
                , y2 t.y
                ]
                []

        _ ->
            line [] []


nodeElement : Node Entity -> Svg Msg
nodeElement node =
    let
        e =
            node.label
    in
    circle
        [ r 3
        , fill (Paint (Color.rgb255 30 100 200))
        , stroke (Paint (Color.rgba 0 0 0 0))
        , strokeWidth 7
        , onMouseDown node.id
        , cx e.x
        , cy e.y
        ]
        [ title [] [ text e.value ] ]


view : Model -> Html Msg
view model =
    Html.div
        [ HA.style "font-family" "sans-serif", HA.style "padding" "16px" ]
        [ Html.h2 [] [ text "Übung 12.2 – Experimente mit Kräften" ]
        , Html.p []
            [ text "Szenario: "
            , Html.select
                [ HE.onInput (scenarioFromString >> SelectScenario) ]
                (List.map
                    (\( sc, label ) ->
                        Html.option
                            [ HA.value (scenarioToString sc)
                            , HA.selected (sc == model.scenario)
                            ]
                            [ text label ]
                    )
                    scenarios
                )
            ]
        , Html.p [ HA.style "color" "#444" ]
            [ text ("Aktuell: " ++ scenarioName model.scenario) ]
        , svg
            [ viewBox 0 0 w h
            , Attr.width (TypedSvg.Types.px w)
            , Attr.height (TypedSvg.Types.px h)
            , HA.style "border" "1px solid #ccc"
            ]
            [ Graph.edges model.graph
                |> List.map (linkElement model.graph)
                |> g [ class [ "links" ] ]
            , Graph.nodes model.graph
                |> List.map nodeElement
                |> g [ class [ "nodes" ] ]
            ]
        , Html.h3 [] [ text "Beobachtungen" ]
        , Html.ul []
            [ Html.li []
                [ Html.b [] [ text "Default: " ]
                , text "Drei Kräfte halten sich die Waage – Links ziehen verbundene Knoten zusammen, manyBody stößt alle voneinander ab, center hält den Schwerpunkt in der SVG-Mitte. Ergebnis: kompakte, lesbare Wolke um die Mitte."
                ]
            , Html.li []
                [ Html.b [] [ text "Ohne center: " ]
                , text "Der Schwerpunkt ist nicht mehr fixiert. Der Graph driftet (je nach Anfangsbedingung) langsam aus der Mitte heraus, behält aber seine innere Form. center erzwingt also nur die Verankerung, nicht die Struktur."
                ]
            , Html.li []
                [ Html.b [] [ text "Ohne manyBody: " ]
                , text "Ohne die abstoßende Ladung fallen alle verbundenen Knoten zu kleinen Klumpen zusammen, weil die Link-Federn nichts gegenhalten. Isolierte Komponenten kleben aufeinander."
                ]
            , Html.li []
                [ Html.b [] [ text "Ohne Links: " ]
                , text "Die Kantenstruktur spielt keine Rolle mehr; manyBody verteilt die Knoten gleichmäßig wie ein elektronisches Gas, center hält sie zusammen. Man sieht zwar Linien, aber die Topologie ist verloren."
                ]
            , Html.li []
                [ Html.b [] [ text "Starke Abstoßung (−300): " ]
                , text "Knoten drücken sich weit auseinander, der Graph quillt bis an die Ränder. Strukturen wie Cliquen werden klarer voneinander getrennt, aber die Federn der Links werden stark gedehnt."
                ]
            , Html.li []
                [ Html.b [] [ text "Anziehung (+30): " ]
                , text "Positives manyBody invertiert die Ladung: alle Knoten ziehen sich gegenseitig an und kollabieren zu einem dichten Punkt – die Visualisierung ist praktisch unbrauchbar, schön zeigt sich aber, wie wichtig die Abstoßung ist."
                ]
            , Html.li []
                [ Html.b [] [ text "Kurze Links (15): " ]
                , text "Federn sind sehr kurz; benachbarte Knoten klemmen aneinander. Der Graph wird kleiner und dichter, Cluster wirken kompakter."
                ]
            , Html.li []
                [ Html.b [] [ text "Lange Links (120): " ]
                , text "Federn sind weich und lang. Der Graph dehnt sich aus, die Übersicht ist besser, aber kleine Untergruppen verschwimmen, weil die Abstoßung relativ schwächer wirkt."
                ]
            ]
        ]



-- ============================================================
-- GRAPH (Les Misérables – wie im Original-Beispiel)
-- ============================================================


miserablesGraph : Graph String ()
miserablesGraph =
    Graph.fromNodeLabelsAndEdgePairs miserablesNodes miserablesEdges


miserablesNodes : List String
miserablesNodes =
    [ "Myriel", "Napoleon", "Mlle.Baptistine", "Mme.Magloire", "CountessdeLo"
    , "Geborand", "Champtercier", "Cravatte", "Count", "OldMan"
    , "Labarre", "Valjean", "Marguerite", "Mme.deR", "Isabeau"
    , "Gervais", "Tholomyes", "Listolier", "Fameuil", "Blacheville"
    , "Favourite", "Dahlia", "Zephine", "Fantine", "Mme.Thenardier"
    , "Thenardier", "Cosette", "Javert", "Fauchelevent", "Bamatabois"
    , "Perpetue", "Simplice", "Scaufflaire", "Woman1", "Judge"
    , "Champmathieu", "Brevet", "Chenildieu", "Cochepaille", "Pontmercy"
    , "Boulatruelle", "Eponine", "Anzelma", "Woman2", "MotherInnocent"
    , "Gribier", "Jondrette", "Mme.Burgon", "Gavroche", "Gillenormand"
    , "Magnon", "Mlle.Gillenormand", "Mme.Pontmercy", "Mlle.Vaubois", "Lt.Gillenormand"
    , "Marius", "BaronessT", "Mabeuf", "Enjolras", "Combeferre"
    , "Prouvaire", "Feuilly", "Courfeyrac", "Bahorel", "Bossuet"
    , "Joly", "Grantaire", "MotherPlutarch", "Gueulemer", "Babet"
    , "Claquesous", "Montparnasse", "Toussaint", "Child1", "Child2"
    , "Brujon", "Mme.Hucheloup"
    ]


miserablesEdges : List ( Int, Int )
miserablesEdges =
    [ ( 1, 0 ), ( 2, 0 ), ( 3, 0 ), ( 3, 2 ), ( 4, 0 ), ( 5, 0 ), ( 6, 0 ), ( 7, 0 )
    , ( 8, 0 ), ( 9, 0 ), ( 11, 10 ), ( 11, 3 ), ( 11, 2 ), ( 11, 0 ), ( 12, 11 )
    , ( 13, 11 ), ( 14, 11 ), ( 15, 11 ), ( 17, 16 ), ( 18, 16 ), ( 18, 17 )
    , ( 19, 16 ), ( 19, 17 ), ( 19, 18 ), ( 20, 16 ), ( 20, 17 ), ( 20, 18 )
    , ( 20, 19 ), ( 21, 16 ), ( 21, 17 ), ( 21, 18 ), ( 21, 19 ), ( 21, 20 )
    , ( 22, 16 ), ( 22, 17 ), ( 22, 18 ), ( 22, 19 ), ( 22, 20 ), ( 22, 21 )
    , ( 23, 16 ), ( 23, 17 ), ( 23, 18 ), ( 23, 19 ), ( 23, 20 ), ( 23, 21 )
    , ( 23, 22 ), ( 23, 12 ), ( 23, 11 ), ( 24, 23 ), ( 24, 11 ), ( 25, 24 )
    , ( 25, 23 ), ( 25, 11 ), ( 26, 24 ), ( 26, 11 ), ( 26, 16 ), ( 26, 25 )
    , ( 27, 11 ), ( 27, 23 ), ( 27, 25 ), ( 27, 24 ), ( 27, 26 ), ( 28, 11 )
    , ( 28, 27 ), ( 29, 23 ), ( 29, 27 ), ( 29, 11 ), ( 30, 23 ), ( 31, 30 )
    , ( 31, 11 ), ( 31, 23 ), ( 31, 27 ), ( 32, 11 ), ( 33, 11 ), ( 33, 27 )
    , ( 34, 11 ), ( 34, 29 ), ( 35, 11 ), ( 35, 34 ), ( 35, 29 ), ( 36, 34 )
    , ( 36, 35 ), ( 36, 11 ), ( 36, 29 ), ( 37, 34 ), ( 37, 35 ), ( 37, 36 )
    , ( 37, 11 ), ( 37, 29 ), ( 38, 34 ), ( 38, 35 ), ( 38, 36 ), ( 38, 37 )
    , ( 38, 11 ), ( 38, 29 ), ( 39, 25 ), ( 40, 25 ), ( 41, 24 ), ( 41, 25 )
    , ( 42, 41 ), ( 42, 25 ), ( 42, 24 ), ( 43, 11 ), ( 43, 26 ), ( 43, 27 )
    , ( 44, 28 ), ( 44, 11 ), ( 45, 28 ), ( 47, 46 ), ( 48, 47 ), ( 48, 25 )
    , ( 48, 27 ), ( 48, 11 ), ( 49, 26 ), ( 49, 11 ), ( 50, 49 ), ( 50, 24 )
    , ( 51, 49 ), ( 51, 26 ), ( 51, 11 ), ( 52, 51 ), ( 52, 39 ), ( 53, 51 )
    , ( 54, 51 ), ( 54, 49 ), ( 54, 26 ), ( 55, 51 ), ( 55, 49 ), ( 55, 39 )
    , ( 55, 54 ), ( 55, 26 ), ( 55, 11 ), ( 55, 16 ), ( 55, 25 ), ( 55, 41 )
    , ( 55, 48 ), ( 56, 49 ), ( 56, 55 ), ( 57, 55 ), ( 57, 41 ), ( 57, 48 )
    , ( 58, 55 ), ( 58, 48 ), ( 58, 27 ), ( 58, 57 ), ( 58, 11 ), ( 59, 58 )
    , ( 59, 55 ), ( 59, 48 ), ( 59, 57 ), ( 60, 48 ), ( 60, 58 ), ( 60, 59 )
    , ( 61, 48 ), ( 61, 58 ), ( 61, 60 ), ( 61, 59 ), ( 61, 57 ), ( 61, 55 )
    , ( 62, 55 ), ( 62, 58 ), ( 62, 59 ), ( 62, 48 ), ( 62, 57 ), ( 62, 41 )
    , ( 62, 61 ), ( 62, 60 ), ( 63, 59 ), ( 63, 48 ), ( 63, 62 ), ( 63, 57 )
    , ( 63, 58 ), ( 63, 61 ), ( 63, 60 ), ( 63, 55 ), ( 64, 55 ), ( 64, 62 )
    , ( 64, 48 ), ( 64, 63 ), ( 64, 58 ), ( 64, 61 ), ( 64, 60 ), ( 64, 59 )
    , ( 64, 57 ), ( 64, 11 ), ( 65, 63 ), ( 65, 64 ), ( 65, 48 ), ( 65, 62 )
    , ( 65, 58 ), ( 65, 61 ), ( 65, 60 ), ( 65, 59 ), ( 65, 57 ), ( 65, 55 )
    , ( 66, 64 ), ( 66, 58 ), ( 66, 59 ), ( 66, 62 ), ( 66, 65 ), ( 66, 48 )
    , ( 66, 63 ), ( 66, 61 ), ( 66, 60 ), ( 67, 57 ), ( 68, 25 ), ( 68, 11 )
    , ( 68, 24 ), ( 68, 27 ), ( 68, 48 ), ( 68, 41 ), ( 69, 25 ), ( 69, 68 )
    , ( 69, 11 ), ( 69, 24 ), ( 69, 27 ), ( 69, 48 ), ( 69, 41 ), ( 70, 25 )
    , ( 70, 69 ), ( 70, 68 ), ( 70, 11 ), ( 70, 24 ), ( 70, 27 ), ( 70, 41 )
    , ( 70, 58 ), ( 71, 27 ), ( 71, 69 ), ( 71, 68 ), ( 71, 70 ), ( 71, 11 )
    , ( 71, 48 ), ( 71, 41 ), ( 71, 25 ), ( 72, 26 ), ( 72, 27 ), ( 72, 11 )
    , ( 73, 48 ), ( 74, 48 ), ( 74, 73 ), ( 75, 69 ), ( 75, 68 ), ( 75, 25 )
    , ( 75, 48 ), ( 75, 41 ), ( 75, 70 ), ( 75, 71 ), ( 76, 64 ), ( 76, 65 )
    , ( 76, 66 ), ( 76, 63 ), ( 76, 62 ), ( 76, 48 ), ( 76, 58 )
    ]
