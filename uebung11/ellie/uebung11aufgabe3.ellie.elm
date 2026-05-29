port module Main exposing (main)

{-| Übung 11.3 – DAG aus Folie 456 mit drei Dagre-Rankern.

Derselbe Graph wird dreimal an Dagre geschickt – mit
unterschiedlichem `ranker`:

  a) network-simplex
  b) tight-tree
  c) longest-path

Die drei Ergebnisse werden untereinander gezeichnet.
-}

import Browser
import Color
import Html
import Html.Attributes as HA
import Json.Decode exposing (Decoder, Error, Value, decodeValue, errorToString)
import Json.Decode.Pipeline exposing (required)
import Json.Encode exposing (encode, object)
import TypedSvg
import TypedSvg.Attributes
import TypedSvg.Attributes.InPx as InPx
import TypedSvg.Core
import TypedSvg.Types



-- ============================================================
-- TYPEN
-- ============================================================


type alias GraphData =
    { options : GraphOptions
    , values : GraphValues
    , nodes : List Node
    , edges : List Edge
    }


type alias GraphOptions =
    { directed : Bool
    , multigraph : Bool
    , compound : Bool
    }


type alias GraphValues =
    { nodesep : Int
    , ranksep : Int
    , rankdir : String
    , marginx : Int
    , marginy : Int
    , width : Int
    , height : Int
    }


type alias Node =
    { id : String
    , value : NodeValue
    }


type alias NodeValue =
    { label : String
    , height : Int
    , width : Int
    , x : Float
    , y : Float
    }


type alias Edge =
    { from : String
    , to : String
    , values : EdgeValue
    }


type alias EdgeValue =
    { label : String
    , height : Int
    , width : Int
    , x : Float
    , y : Float
    , points : List Point
    }


type alias Point =
    { x : Float
    , y : Float
    }



-- ============================================================
-- DAG AUS FOLIE 456 (Vorlesungsbeispiel)
-- ============================================================


mkNode : String -> Node
mkNode id =
    Node id (NodeValue id 50 60 0 0)


mkEdge : String -> String -> Edge
mkEdge from to =
    Edge from to (EdgeValue "" 10 30 0 0 [])


testGraph : GraphData
testGraph =
    { options = defaultGraphOptions
    , values = defaultGraphValues
    , nodes =
        List.map mkNode
            [ "0", "1", "2", "3", "4", "5", "6", "7"
            , "8", "9", "10", "11", "12", "13", "14"
            ]
    , edges =
        [ mkEdge "1" "5"
        , mkEdge "1" "12"
        , mkEdge "2" "8"
        , mkEdge "2" "5"
        , mkEdge "2" "12"
        , mkEdge "2" "7"
        , mkEdge "2" "13"
        , mkEdge "2" "6"
        , mkEdge "3" "9"
        , mkEdge "3" "12"
        , mkEdge "3" "10"
        , mkEdge "3" "8"
        , mkEdge "4" "12"
        , mkEdge "4" "10"
        , mkEdge "4" "14"
        , mkEdge "5" "14"
        , mkEdge "6" "11"
        , mkEdge "6" "13"
        , mkEdge "7" "13"
        , mkEdge "8" "14"
        , mkEdge "9" "12"
        , mkEdge "9" "13"
        , mkEdge "10" "14"
        , mkEdge "11" "13"
        , mkEdge "13" "14"
        , mkEdge "0" "5"
        , mkEdge "0" "13"
        ]
    }



-- ============================================================
-- INIT / UPDATE / PORTS / MAIN
-- ============================================================


type Msg
    = Graphs Value


{-| Ein Layout-Ergebnis pro Ranker.
-}
type alias Model =
    { networkSimplex : Maybe GraphData
    , tightTree : Maybe GraphData
    , longestPath : Maybe GraphData
    , error : String
    }


init : () -> ( Model, Cmd msg )
init _ =
    ( { networkSimplex = Nothing
      , tightTree = Nothing
      , longestPath = Nothing
      , error = ""
      }
    , layout (graphsToJsonStr testGraph)
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        Graphs data_ ->
            case decodeValue (Json.Decode.list graphData) data_ of
                Ok (a :: b :: c :: _) ->
                    ( { model
                        | networkSimplex = Just a
                        , tightTree = Just b
                        , longestPath = Just c
                        , error = ""
                      }
                    , Cmd.none
                    )

                Ok _ ->
                    ( { model | error = "Erwartet wurden 3 Layout-Ergebnisse." }
                    , Cmd.none
                    )

                Err e ->
                    ( { model | error = errorToString e }, Cmd.none )


port graphs : (Value -> msg) -> Sub msg


port layout : String -> Cmd msg


subscriptions : Model -> Sub Msg
subscriptions _ =
    graphs Graphs


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- ============================================================
-- ENCODER (3 Graph-Varianten → JSON-String für Dagre)
-- ============================================================


graphsToJsonStr : GraphData -> String
graphsToJsonStr g =
    encode 0 <|
        Json.Encode.list identity
            [ jsonGraphWith g jsonGraphValuesA
            , jsonGraphWith g jsonGraphValuesB
            , jsonGraphWith g jsonGraphValuesC
            ]


jsonGraphWith : GraphData -> Value -> Value
jsonGraphWith g values =
    object
        [ ( "nodes"
          , Json.Encode.list identity
                (List.map
                    (\n -> jsonNode n.id n.value.label n.value.width n.value.height)
                    g.nodes
                )
          )
        , ( "edges"
          , Json.Encode.list identity
                (List.map
                    (\e -> jsonEdge e.from e.to e.values.label e.values.width e.values.height)
                    g.edges
                )
          )
        , ( "options", jsonOptions )
        , ( "value", values )
        ]


jsonNode : String -> String -> Int -> Int -> Value
jsonNode a l w h =
    object
        [ ( "v", Json.Encode.string a )
        , ( "value"
          , object
                [ ( "label", Json.Encode.string l )
                , ( "width", Json.Encode.int w )
                , ( "height", Json.Encode.int h )
                ]
          )
        ]


jsonEdge : String -> String -> String -> Int -> Int -> Value
jsonEdge a b l w h =
    object
        [ ( "v", Json.Encode.string a )
        , ( "w", Json.Encode.string b )
        , ( "value"
          , object
                [ ( "label", Json.Encode.string l )
                , ( "width", Json.Encode.int w )
                , ( "height", Json.Encode.int h )
                ]
          )
        ]


jsonOptions : Value
jsonOptions =
    object
        [ ( "directed", Json.Encode.bool True )
        , ( "multigraph", Json.Encode.bool False )
        , ( "compound", Json.Encode.bool False )
        ]


{-| (a) ranker = network-simplex (Dagre-Default, Sugiyama). -}
jsonGraphValuesA : Value
jsonGraphValuesA =
    rankerValues "network-simplex"


{-| (b) ranker = tight-tree. -}
jsonGraphValuesB : Value
jsonGraphValuesB =
    rankerValues "tight-tree"


{-| (c) ranker = longest-path. -}
jsonGraphValuesC : Value
jsonGraphValuesC =
    rankerValues "longest-path"


rankerValues : String -> Value
rankerValues ranker =
    object
        [ ( "nodesep", Json.Encode.int 10 )
        , ( "ranksep", Json.Encode.int 100 )
        , ( "rankdir", Json.Encode.string "TB" )
        , ( "marginx", Json.Encode.int 20 )
        , ( "marginy", Json.Encode.int 20 )
        , ( "ranker", Json.Encode.string ranker )
        ]



-- ============================================================
-- DECODER
-- ============================================================


graphData : Decoder GraphData
graphData =
    Json.Decode.succeed GraphData
        |> required "options" graphOptions
        |> required "value" graphValues
        |> required "nodes" (Json.Decode.list node)
        |> required "edges" (Json.Decode.list edge)


graphOptions : Decoder GraphOptions
graphOptions =
    Json.Decode.succeed GraphOptions
        |> required "directed" Json.Decode.bool
        |> required "multigraph" Json.Decode.bool
        |> required "compound" Json.Decode.bool


graphValues : Decoder GraphValues
graphValues =
    Json.Decode.succeed GraphValues
        |> required "nodesep" (Json.Decode.map floor Json.Decode.float)
        |> required "ranksep" (Json.Decode.map floor Json.Decode.float)
        |> required "rankdir" Json.Decode.string
        |> required "marginx" (Json.Decode.map floor Json.Decode.float)
        |> required "marginy" (Json.Decode.map floor Json.Decode.float)
        |> required "width" (Json.Decode.map floor Json.Decode.float)
        |> required "height" (Json.Decode.map floor Json.Decode.float)


node : Decoder Node
node =
    Json.Decode.succeed Node
        |> required "v" Json.Decode.string
        |> required "value" nodeValue


nodeValue : Decoder NodeValue
nodeValue =
    Json.Decode.succeed NodeValue
        |> required "label" Json.Decode.string
        |> required "height" (Json.Decode.map floor Json.Decode.float)
        |> required "width" (Json.Decode.map floor Json.Decode.float)
        |> required "x" Json.Decode.float
        |> required "y" Json.Decode.float


edge : Decoder Edge
edge =
    Json.Decode.succeed Edge
        |> required "v" Json.Decode.string
        |> required "w" Json.Decode.string
        |> required "value" edgeValue


edgeValue : Decoder EdgeValue
edgeValue =
    Json.Decode.succeed EdgeValue
        |> required "label" Json.Decode.string
        |> required "height" (Json.Decode.map floor Json.Decode.float)
        |> required "width" (Json.Decode.map floor Json.Decode.float)
        |> required "x" Json.Decode.float
        |> required "y" Json.Decode.float
        |> required "points" (Json.Decode.list point)


point : Decoder Point
point =
    Json.Decode.succeed Point
        |> required "x" Json.Decode.float
        |> required "y" Json.Decode.float



-- ============================================================
-- VIEW
-- ============================================================


defaultGraphOptions : GraphOptions
defaultGraphOptions =
    GraphOptions True False False


defaultGraphValues : GraphValues
defaultGraphValues =
    GraphValues 10 100 "TB" 20 20 800 600


view : Model -> Browser.Document Msg
view model =
    { title = "Übung 11.3 – DAG mit drei Dagre-Rankern"
    , body =
        [ Html.div
            [ HA.style "font-family" "sans-serif", HA.style "padding" "20px" ]
            [ Html.h2 [] [ Html.text "Übung 11.3 – DAG aus Folie 456" ]
            , Html.p []
                [ Html.text
                    "Derselbe Graph wird dreimal von Dagre gelayoutet – mit den Rankern network-simplex, tight-tree und longest-path."
                ]
            , if model.error /= "" then
                Html.pre
                    [ HA.style "color" "#a00"
                    , HA.style "background" "#fee"
                    , HA.style "padding" "10px"
                    , HA.style "white-space" "pre-wrap"
                    ]
                    [ Html.text ("Fehler:\n" ++ model.error) ]

              else
                Html.text ""
            , section "a) ranker = network-simplex" model.networkSimplex
            , section "b) ranker = tight-tree" model.tightTree
            , section "c) ranker = longest-path" model.longestPath
            ]
        ]
    }


section : String -> Maybe GraphData -> Html.Html msg
section title maybeGraph =
    Html.div
        [ HA.style "margin-top" "24px"
        , HA.style "border-top" "1px solid #ccc"
        , HA.style "padding-top" "12px"
        ]
        [ Html.h3 [] [ Html.text title ]
        , case maybeGraph of
            Nothing ->
                Html.p [] [ Html.text "Warte auf Dagre-Layout …" ]

            Just g ->
                graphPane g
        ]


graphPane : GraphData -> Html.Html msg
graphPane g =
    let
        sw =
            toFloat g.values.width

        sh =
            toFloat g.values.height
    in
    TypedSvg.svg
        [ TypedSvg.Attributes.width (TypedSvg.Types.Px sw)
        , TypedSvg.Attributes.height (TypedSvg.Types.Px sh)
        , TypedSvg.Attributes.viewBox 0 0 sw sh
        ]
        (arrowMarkerDefs :: viewEdges g.edges ++ viewNodes g.nodes)


arrowMarkerDefs : TypedSvg.Core.Svg msg
arrowMarkerDefs =
    TypedSvg.defs []
        [ TypedSvg.marker
            [ TypedSvg.Attributes.id "arrow"
            , TypedSvg.Attributes.viewBox 0 0 10 10
            , TypedSvg.Attributes.refX "9"
            , TypedSvg.Attributes.refY "5"
            , TypedSvg.Attributes.markerWidth (TypedSvg.Types.Px 8)
            , TypedSvg.Attributes.markerHeight (TypedSvg.Types.Px 8)
            , TypedSvg.Attributes.orient "auto-start-reverse"
            ]
            [ TypedSvg.path
                [ TypedSvg.Attributes.d "M 0 0 L 10 5 L 0 10 z"
                , TypedSvg.Attributes.fill (TypedSvg.Types.Paint Color.black)
                ]
                []
            ]
        ]


viewNodes : List Node -> List (TypedSvg.Core.Svg msg)
viewNodes nodes =
    List.map viewNode nodes


viewNode : Node -> TypedSvg.Core.Svg msg
viewNode node_ =
    let
        w =
            toFloat node_.value.width

        h =
            toFloat node_.value.height

        sx =
            node_.value.x - w / 2.0

        sy =
            node_.value.y - h / 2.0
    in
    TypedSvg.g []
        [ TypedSvg.rect
            [ InPx.x sx
            , InPx.y sy
            , InPx.width w
            , InPx.height h
            , InPx.rx 8
            , InPx.ry 8
            , TypedSvg.Attributes.stroke (TypedSvg.Types.Paint Color.blue)
            , InPx.strokeWidth 1.5
            , TypedSvg.Attributes.fill (TypedSvg.Types.Paint Color.white)
            ]
            []
        , TypedSvg.text_
            [ InPx.x node_.value.x
            , InPx.y node_.value.y
            , TypedSvg.Attributes.alignmentBaseline TypedSvg.Types.AlignmentCentral
            , TypedSvg.Attributes.textAnchor TypedSvg.Types.AnchorMiddle
            , InPx.fontSize 14
            ]
            [ TypedSvg.Core.text node_.value.label ]
        ]


viewEdges : List Edge -> List (TypedSvg.Core.Svg msg)
viewEdges edges =
    List.map viewEdge edges


viewEdge : Edge -> TypedSvg.Core.Svg msg
viewEdge edge_ =
    let
        pts =
            List.map (\p -> ( p.x, p.y )) edge_.values.points
    in
    TypedSvg.g []
        [ TypedSvg.polyline
            [ TypedSvg.Attributes.fill TypedSvg.Types.PaintNone
            , TypedSvg.Attributes.stroke (TypedSvg.Types.Paint Color.black)
            , InPx.strokeWidth 1.2
            , TypedSvg.Attributes.points pts
            , TypedSvg.Attributes.markerEnd "url(#arrow)"
            ]
            []
        ]
