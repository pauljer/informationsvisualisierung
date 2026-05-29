port module Main exposing (main)

{-| Übung 11.2 – Sentence Tokenization mit Dagre + CSS-Klassen.

Erweitert Aufgabe 11.1: Jeder Knoten bekommt eine CSS-Klasse, die
beim Zeichnen ausgewertet wird. Wort-Tokens (Blätter) werden grün
hinterlegt, POS-Tags und Phrasen-Knoten bleiben weiß – analog zum
Referenzbild der Vorlesung.
-}

import Browser
import Color
import Html
import Html.Attributes as HA
import Json.Decode exposing (Decoder, Error, Value, decodeValue, errorToString)
import Json.Decode.Pipeline exposing (optional, required)
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
    , class_ : String
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
    , class_ : String
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
-- SENTENCE-TOKENIZATION-GRAPH (Satz „This is a sentence.")
-- ============================================================


labelWidth : String -> Int
labelWidth label =
    max 50 (round (toFloat (String.length label) * 8.5) + 24)


labelHeight : Int
labelHeight =
    36


mkInner : String -> String -> Node
mkInner id label =
    Node id (NodeValue label "inner" labelHeight (labelWidth label) 0 0)


mkLeaf : String -> String -> Node
mkLeaf id label =
    Node id (NodeValue label "leaf" labelHeight (labelWidth label) 0 0)


mkEdge : String -> String -> Edge
mkEdge from to =
    Edge from to (EdgeValue "" "edge" 10 30 0 0 [])


sentenceGraph : GraphData
sentenceGraph =
    { options = defaultGraphOptions
    , values = defaultGraphValues
    , nodes =
        [ mkInner "TOP" "TOP"
        , mkInner "S" "S"
        , mkInner "NP1" "NP"
        , mkInner "DT1" "DT"
        , mkLeaf "w_This" "This"
        , mkInner "VP" "VP"
        , mkInner "VBZ" "VBZ"
        , mkLeaf "w_is" "is"
        , mkInner "NP2" "NP"
        , mkInner "DT2" "DT"
        , mkLeaf "w_a" "a"
        , mkInner "NN" "NN"
        , mkLeaf "w_sentence" "sentence"
        , mkInner "PUNCT" "."
        , mkLeaf "w_dot" "."
        ]
    , edges =
        [ mkEdge "TOP" "S"
        , mkEdge "S" "PUNCT"
        , mkEdge "PUNCT" "w_dot"
        , mkEdge "S" "VP"
        , mkEdge "VP" "NP2"
        , mkEdge "NP2" "NN"
        , mkEdge "NN" "w_sentence"
        , mkEdge "NP2" "DT2"
        , mkEdge "DT2" "w_a"
        , mkEdge "VP" "VBZ"
        , mkEdge "VBZ" "w_is"
        , mkEdge "S" "NP1"
        , mkEdge "NP1" "DT1"
        , mkEdge "DT1" "w_This"
        ]
    }



-- ============================================================
-- INIT / UPDATE / PORTS / MAIN
-- ============================================================


type Msg
    = Graph Value


type alias Model =
    { graph : Maybe GraphData
    , error : String
    }


init : () -> ( Model, Cmd msg )
init _ =
    ( { graph = Nothing, error = "" }
    , layout (graphToJsonStr sentenceGraph)
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        Graph data_ ->
            case decodeGraph data_ of
                Ok g ->
                    ( { model | graph = Just g, error = "" }, Cmd.none )

                Err e ->
                    ( { model | error = errorToString e }, Cmd.none )


port graphs : (Value -> msg) -> Sub msg


port layout : String -> Cmd msg


subscriptions : Model -> Sub Msg
subscriptions _ =
    graphs Graph


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- ============================================================
-- ENCODER (Graph → JSON-String für Dagre)
-- ============================================================


graphToJsonStr : GraphData -> String
graphToJsonStr g =
    encode 0 <|
        object
            [ ( "nodes"
              , Json.Encode.list identity
                    (List.map
                        (\n ->
                            jsonNode n.id n.value.label n.value.class_ n.value.width n.value.height
                        )
                        g.nodes
                    )
              )
            , ( "edges"
              , Json.Encode.list identity
                    (List.map
                        (\e ->
                            jsonEdge e.from e.to e.values.label e.values.class_ e.values.width e.values.height
                        )
                        g.edges
                    )
              )
            , ( "options", jsonOptions )
            , ( "value", jsonGraphValues )
            ]


jsonNode : String -> String -> String -> Int -> Int -> Value
jsonNode a l c w h =
    object
        [ ( "v", Json.Encode.string a )
        , ( "value"
          , object
                [ ( "label", Json.Encode.string l )
                , ( "class", Json.Encode.string c )
                , ( "width", Json.Encode.int w )
                , ( "height", Json.Encode.int h )
                ]
          )
        ]


jsonEdge : String -> String -> String -> String -> Int -> Int -> Value
jsonEdge a b l c w h =
    object
        [ ( "v", Json.Encode.string a )
        , ( "w", Json.Encode.string b )
        , ( "value"
          , object
                [ ( "label", Json.Encode.string l )
                , ( "class", Json.Encode.string c )
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


jsonGraphValues : Value
jsonGraphValues =
    object
        [ ( "nodesep", Json.Encode.int 20 )
        , ( "ranksep", Json.Encode.int 60 )
        , ( "rankdir", Json.Encode.string "TB" )
        , ( "marginx", Json.Encode.int 20 )
        , ( "marginy", Json.Encode.int 20 )
        ]



-- ============================================================
-- DECODER (Dagre-Ergebnis → GraphData)
-- ============================================================


decodeGraph : Value -> Result Error GraphData
decodeGraph json =
    decodeValue graphData json


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
        |> optional "class" Json.Decode.string "inner"
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
        |> optional "class" Json.Decode.string "edge"
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
    GraphValues 20 60 "TB" 20 20 800 600


view : Model -> Browser.Document Msg
view model =
    { title = "Übung 11.2 – Sentence Tokenization (Dagre + CSS-Klassen)"
    , body =
        [ Html.div
            [ HA.style "font-family" "sans-serif", HA.style "padding" "20px" ]
            [ Html.h2 [] [ Html.text "Übung 11.2 – Sentence Tokenization mit CSS-Klassen" ]
            , Html.p []
                [ Html.text "Satz: "
                , Html.em [] [ Html.text "\"This is a sentence.\"" ]
                , Html.text
                    (" – Layout via Dagre, Wort-Tokens (Klasse "
                        ++ "\"leaf\") grün, POS-/Phrasen-Knoten (Klasse \"inner\") weiß."
                    )
                ]
            , if model.error /= "" then
                Html.pre
                    [ HA.style "color" "#a00"
                    , HA.style "background" "#fee"
                    , HA.style "padding" "10px"
                    , HA.style "white-space" "pre-wrap"
                    ]
                    [ Html.text ("Decoder-Fehler:\n" ++ model.error) ]

              else
                Html.text ""
            , case model.graph of
                Nothing ->
                    Html.p [] [ Html.text "Warte auf Dagre-Layout … (ist dagre.min.js im HTML eingebunden?)" ]

                Just g ->
                    graphPane g
            ]
        ]
    }


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


nodeFill : String -> Color.Color
nodeFill cls =
    case cls of
        "leaf" ->
            Color.rgb255 26 232 195

        _ ->
            Color.white


nodeStroke : String -> Color.Color
nodeStroke cls =
    case cls of
        "leaf" ->
            Color.rgb255 20 180 150

        _ ->
            Color.rgb255 140 140 140


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
    TypedSvg.g
        [ TypedSvg.Attributes.class [ "node", node_.value.class_ ] ]
        [ TypedSvg.rect
            [ InPx.x sx
            , InPx.y sy
            , InPx.width w
            , InPx.height h
            , InPx.rx 8
            , InPx.ry 8
            , TypedSvg.Attributes.stroke (TypedSvg.Types.Paint (nodeStroke node_.value.class_))
            , InPx.strokeWidth 1.5
            , TypedSvg.Attributes.fill (TypedSvg.Types.Paint (nodeFill node_.value.class_))
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
    TypedSvg.g
        [ TypedSvg.Attributes.class [ "edge", edge_.values.class_ ] ]
        [ TypedSvg.polyline
            [ TypedSvg.Attributes.fill TypedSvg.Types.PaintNone
            , TypedSvg.Attributes.stroke (TypedSvg.Types.Paint Color.black)
            , InPx.strokeWidth 1.2
            , TypedSvg.Attributes.points pts
            , TypedSvg.Attributes.markerEnd "url(#arrow)"
            ]
            []
        ]
