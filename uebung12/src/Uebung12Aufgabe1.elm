module Uebung12Aufgabe1 exposing (main)

{-| Übung 12.1 – Philosophen-Dilemma als Petri-Netz, dargestellt mit
einer Kräftesimulation (`gampleman/elm-visualization` Modul `Force`).

Stellen (Kreise): `th_i`, `hu_i`, `ea_i`, `ri_i` für i ∈ {1,2,3}.
Transitionen (Rechtecke): `bec_i`, `acq_i`, `rel_i`.

Knoten lassen sich mit der Maus ziehen.
-}

import Browser
import Browser.Events
import Color
import Force exposing (State)
import Graph exposing (Edge, Graph, Node, NodeContext, NodeId)
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as Decode
import TypedSvg exposing (circle, defs, g, line, marker, polygon, rect, svg, title)
import TypedSvg.Attributes as Attr
    exposing
        ( class
        , fill
        , id
        , markerEnd
        , orient
        , points
        , refX
        , refY
        , stroke
        , viewBox
        )
import TypedSvg.Attributes.InPx
    exposing
        ( cx
        , cy
        , height
        , markerHeight
        , markerWidth
        , r
        , strokeWidth
        , width
        , x
        , x1
        , x2
        , y
        , y1
        , y2
        )
import TypedSvg.Core exposing (Attribute, Svg, text)
import TypedSvg.Types exposing (AnchorAlignment(..), Paint(..))



-- ============================================================
-- KONSTANTEN
-- ============================================================


w : Float
w =
    900


h : Float
h =
    750


circleR : Float
circleR =
    22


rectW : Float
rectW =
    48


rectH : Float
rectH =
    28



-- ============================================================
-- MODELL
-- ============================================================


type NodeShape
    = Place
    | Transition


type alias NodeData =
    { name : String
    , shape : NodeShape
    }


type alias Entity =
    Force.Entity NodeId { value : NodeData }


type alias Drag =
    { start : ( Float, Float )
    , current : ( Float, Float )
    , index : NodeId
    }


type alias Model =
    { drag : Maybe Drag
    , graph : Graph Entity ()
    , simulation : State NodeId
    }


type Msg
    = DragStart NodeId ( Float, Float )
    | DragAt ( Float, Float )
    | DragEnd ( Float, Float )
    | Tick



-- ============================================================
-- INIT
-- ============================================================


initializeNode : NodeContext NodeData () -> NodeContext Entity ()
initializeNode ctx =
    { node = { label = Force.entity ctx.node.id ctx.node.label, id = ctx.node.id }
    , incoming = ctx.incoming
    , outgoing = ctx.outgoing
    }


init : () -> ( Model, Cmd Msg )
init _ =
    let
        graph =
            Graph.mapContexts initializeNode philoGraph

        link { from, to } =
            ( from, to )

        nodeIds =
            List.map .id (Graph.nodes graph)

        forces =
            [ Force.customLinks 1
                (Graph.edges graph
                    |> List.map
                        (\e ->
                            { source = e.from
                            , target = e.to
                            , distance = 70
                            , strength = Nothing
                            }
                        )
                )
            , Force.customManyBody 0.9
                (List.map (\nid -> ( nid, -90 )) nodeIds)
            , Force.center (w / 2) (h / 2)
            ]
    in
    ( { drag = Nothing
      , graph = graph
      , simulation = Force.simulation forces
      }
    , Cmd.none
    )



-- ============================================================
-- UPDATE
-- ============================================================


updateNode : ( Float, Float ) -> NodeContext Entity () -> NodeContext Entity ()
updateNode ( x_, y_ ) nodeCtx =
    let
        nv =
            nodeCtx.node.label
    in
    updateContextWithValue nodeCtx { nv | x = x_, y = y_ }


updateContextWithValue : NodeContext Entity () -> Entity -> NodeContext Entity ()
updateContextWithValue nodeCtx value =
    let
        node =
            nodeCtx.node
    in
    { nodeCtx | node = { node | label = value } }


updateGraphWithList : Graph Entity () -> List Entity -> Graph Entity ()
updateGraphWithList =
    let
        graphUpdater value =
            Maybe.map (\ctx -> updateContextWithValue ctx value)
    in
    List.foldr (\node graph -> Graph.update node.id (graphUpdater node) graph)


update : Msg -> Model -> Model
update msg ({ drag, graph, simulation } as model) =
    case msg of
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
                            Graph.update index
                                (Maybe.map (updateNode current))
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


arrowMarker : Svg msg
arrowMarker =
    marker
        [ id "arrow"
        , Attr.viewBox 0 0 10 10
        , refX "10"
        , refY "5"
        , markerWidth 8
        , markerHeight 8
        , orient "auto-start-reverse"
        ]
        [ polygon
            [ points [ ( 0, 0 ), ( 10, 5 ), ( 0, 10 ) ]
            , fill (Paint (Color.rgb255 80 80 80))
            ]
            []
        ]


{-| Endpunkt einer Kante so verschieben, dass der Pfeil am Rand
des Zielknotens (Kreis) ansetzt. Bei Rechtecken ist es nur eine
Näherung – das ist (laut Aufgabe) ausdrücklich erlaubt.
-}
endPoint : Entity -> Entity -> ( Float, Float )
endPoint source target =
    let
        dx =
            target.x - source.x

        dy =
            target.y - source.y

        len =
            sqrt (dx * dx + dy * dy)

        offset =
            case target.value.shape of
                Place ->
                    circleR + 2

                Transition ->
                    rectW / 2 + 2
    in
    if len < 0.001 then
        ( target.x, target.y )

    else
        ( target.x - dx / len * offset
        , target.y - dy / len * offset
        )


linkElement : Graph Entity () -> Edge () -> Svg msg
linkElement graph edge =
    let
        getEntity nid =
            Graph.get nid graph
                |> Maybe.map (.node >> .label)

        sourceM =
            getEntity edge.from

        targetM =
            getEntity edge.to
    in
    case ( sourceM, targetM ) of
        ( Just s, Just t ) ->
            let
                ( ex, ey ) =
                    endPoint s t
            in
            line
                [ strokeWidth 1.2
                , stroke (Paint (Color.rgb255 130 130 130))
                , x1 s.x
                , y1 s.y
                , x2 ex
                , y2 ey
                , markerEnd "url(#arrow)"
                ]
                []

        _ ->
            line [] []


nodeElement : Node Entity -> Svg Msg
nodeElement n =
    let
        ent =
            n.label

        d =
            ent.value

        label =
            TypedSvg.text_
                [ Attr.textAnchor AnchorMiddle
                , Attr.dominantBaseline TypedSvg.Types.DominantBaselineCentral
                , TypedSvg.Attributes.InPx.x ent.x
                , TypedSvg.Attributes.InPx.y ent.y
                , Attr.fontSize (TypedSvg.Types.px 12)
                , Attr.fontFamily [ "sans-serif" ]
                , fill (Paint Color.black)
                , Attr.pointerEvents "none"
                ]
                [ text d.name ]
    in
    g [ onMouseDown n.id, Attr.cursor TypedSvg.Types.CursorPointer ]
        [ case d.shape of
            Place ->
                circle
                    [ r circleR
                    , cx ent.x
                    , cy ent.y
                    , fill (Paint (Color.rgb255 144 238 144))
                    , stroke (Paint Color.black)
                    , strokeWidth 1
                    ]
                    [ title [] [ text d.name ] ]

            Transition ->
                rect
                    [ x (ent.x - rectW / 2)
                    , y (ent.y - rectH / 2)
                    , width rectW
                    , height rectH
                    , fill (Paint (Color.rgb255 214 138 60))
                    , stroke (Paint Color.black)
                    , strokeWidth 1
                    ]
                    [ title [] [ text d.name ] ]
        , label
        ]


view : Model -> Html Msg
view model =
    Html.div
        [ HA.style "font-family" "sans-serif", HA.style "padding" "16px" ]
        [ Html.h2 [] [ text "Übung 12.1 – Philosophen-Dilemma (Petri-Netz)" ]
        , Html.p [] [ text "Knoten lassen sich mit der Maus ziehen." ]
        , svg
            [ viewBox 0 0 w h
            , Attr.width (TypedSvg.Types.px w)
            , Attr.height (TypedSvg.Types.px h)
            , HA.style "border" "1px solid #ccc"
            ]
            [ defs [] [ arrowMarker ]
            , Graph.edges model.graph
                |> List.map (linkElement model.graph)
                |> g [ class [ "links" ] ]
            , Graph.nodes model.graph
                |> List.map nodeElement
                |> g [ class [ "nodes" ] ]
            ]
        ]



-- ============================================================
-- GRAPH: Philosophen-Dilemma
-- ============================================================


{-| Liefert die Liste der Knotenlabels, indizes 0..20. Reihenfolge
muss zu `philoEdges` passen.
-}
philoNodes : List NodeData
philoNodes =
    let
        phil i =
            [ { name = "th" ++ String.fromInt i, shape = Place }
            , { name = "hu" ++ String.fromInt i, shape = Place }
            , { name = "ea" ++ String.fromInt i, shape = Place }
            , { name = "ri" ++ String.fromInt i, shape = Place }
            , { name = "bec" ++ String.fromInt i, shape = Transition }
            , { name = "acq" ++ String.fromInt i, shape = Transition }
            , { name = "rel" ++ String.fromInt i, shape = Transition }
            ]
    in
    phil 1 ++ phil 2 ++ phil 3


{-| Indizes pro Philosoph i (0-basiert für i=1,2,3):
th = base+0, hu = base+1, ea = base+2, ri = base+3,
bec = base+4, acq = base+5, rel = base+6
-}
philoEdges : List ( Int, Int )
philoEdges =
    let
        base i =
            (i - 1) * 7

        th i =
            base i + 0

        hu i =
            base i + 1

        ea i =
            base i + 2

        ri i =
            base i + 3

        bec i =
            base i + 4

        acq i =
            base i + 5

        rel i =
            base i + 6

        next i =
            modBy 3 i + 1

        forPhil i =
            [ ( th i, bec i )
            , ( bec i, hu i )
            , ( hu i, acq i )
            , ( ri i, acq i )
            , ( ri (next i), acq i )
            , ( acq i, ea i )
            , ( ea i, rel i )
            , ( rel i, th i )
            , ( rel i, ri i )
            , ( rel i, ri (next i) )
            ]
    in
    List.concatMap forPhil [ 1, 2, 3 ]


philoGraph : Graph NodeData ()
philoGraph =
    Graph.fromNodeLabelsAndEdgePairs philoNodes philoEdges
