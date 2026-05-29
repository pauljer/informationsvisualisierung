port module Uebung11Aufgabe1 exposing (main)

{-| Übung 11.1 – Sentence Tokenization mit Dagre (Sugiyama-Methode)

Erweitert das Minimal-Beispiel aus
<https://ellie-app.com/hXTSF4mCZLxa1> um:

  1. Den konkreten Parsebaum des Satzes „This is a sentence." aus dem
     dagre-d3-Demo
     <https://dagrejs.github.io/project/dagre-d3/latest/demo/sentence-tokenization.html>
  2. Sichtbare Kanten-Richtung (Pfeilspitzen via SVG-Marker)
  3. Automatische Knotengröße abhängig vom Label-Inhalt
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
-- SENTENCE-TOKENIZATION-GRAPH (Satz „This is a sentence.")
-- ============================================================


{-| Schätzung der Knotenbreite auf Basis des Labels.
Schriftgröße ~14 px, ein Zeichen ~ 8.5 px, Padding 24 px. Mindestens 50.
-}
labelWidth : String -> Int
labelWidth label =
    max 50 (round (toFloat (String.length label) * 8.5) + 24)


labelHeight : Int
labelHeight =
    36


{-| Knoten mit automatisch berechneter Breite. -}
mkNode : String -> String -> Node
mkNode id label =
    Node id (NodeValue label labelHeight (labelWidth label) 0 0)


{-| Kante mit Richtungs-Label (z. B. "→"). -}
mkEdge : String -> String -> Edge
mkEdge from to =
    Edge from to (EdgeValue "" 10 30 0 0 [])


sentenceGraph : GraphData
sentenceGraph =
    { options = defaultGraphOptions
    , values = defaultGraphValues
    , nodes =
        [ mkNode "TOP" "TOP"
        , mkNode "S" "S"
        , mkNode "NP1" "NP"
        , mkNode "DT1" "DT"
        , mkNode "w_This" "This"
        , mkNode "VP" "VP"
        , mkNode "VBZ" "VBZ"
        , mkNode "w_is" "is"
        , mkNode "NP2" "NP"
        , mkNode "DT2" "DT"
        , mkNode "w_a" "a"
        , mkNode "NN" "NN"
        , mkNode "w_sentence" "sentence"
        , mkNode "PUNCT" "."
        , mkNode "w_dot" "."
        ]
    , edges =
        -- Reihenfolge bestimmt die L→R-Anordnung der Geschwister im Dagre-Layout.
        -- Unter S: PUNCT links, VP mittig, NP1 rechts (wie im Demo-Bild).
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
                            jsonNode n.id n.value.label n.value.width n.value.height
                        )
                        g.nodes
                    )
              )
            , ( "edges"
              , Json.Encode.list identity
                    (List.map
                        (\e ->
                            jsonEdge e.from e.to e.values.label e.values.width e.values.height
                        )
                        g.edges
                    )
              )
            , ( "options", jsonOptions )
            , ( "value", jsonGraphValues )
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


{-| `rankdir = "TB"` – Wurzel oben, Blätter unten (wie im Demo). -}
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


{-| Bugfix gegenüber Original: width/height kommen als Float aus Dagre. -}
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
    GraphValues 20 60 "TB" 20 20 800 600


view : Model -> Browser.Document Msg
view model =
    { title = "Übung 11.1 – Sentence Tokenization (Dagre)"
    , body =
        [ Html.div
            [ HA.style "font-family" "sans-serif", HA.style "padding" "20px" ]
            [ Html.h2 [] [ Html.text "Übung 11.1 – Sentence Tokenization mit Dagre" ]
            , Html.p []
                [ Html.text "Satz: "
                , Html.em [] [ Html.text "\"This is a sentence.\"" ]
                , Html.text " – Layout via Dagre (Sugiyama-Methode), Pfeile zeigen die Kantenrichtung."
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


{-| SVG-`<marker>` für Pfeilspitze am Ende jeder Kante. -}
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
