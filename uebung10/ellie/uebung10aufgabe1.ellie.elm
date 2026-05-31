module Main exposing (main)

{-| Übung 10.1 – Einfache Treemap (abwechselnde x/y-Split-Achse).

Ellie-Variante: `flare.json` ist als String-Konstante `flareJson` am
Ende der Datei eingebettet, damit kein HTTP-Request nötig ist und es
keine CORS-Probleme gibt.
-}

import Browser
import Color
import Html exposing (Html)
import Html.Attributes as HA
import Json.Decode as D exposing (Decoder)
import List.Extra
import Scale exposing (ContinuousScale)
import Tree exposing (Tree)
import TypedSvg
import TypedSvg.Attributes
import TypedSvg.Core
import TypedSvg.Types



-- ============================================================
-- MODEL
-- ============================================================


type alias Label =
    ( String, Int )


type alias Model =
    { statusMsg : String
    , testTree : Tree Label
    , tree : Maybe (Tree Label)
    }


type Msg
    = NoOp



-- ============================================================
-- INIT / UPDATE / SUBSCRIPTIONS / MAIN
-- ============================================================


init : () -> ( Model, Cmd Msg )
init _ =
    let
        ( tree, status ) =
            case D.decodeString treeDecoder flareJson of
                Ok t ->
                    ( Just (sumUpInnerValues t), "" )

                Err e ->
                    ( Nothing, "Fehler beim Dekodieren: " ++ D.errorToString e )
    in
    ( { statusMsg = status
      , testTree = sumUpInnerValues testTree
      , tree = tree
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update _ model =
    ( model, Cmd.none )


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = \_ -> Sub.none
        , view = view
        }



-- ============================================================
-- DATEN: testTree aus der Vorlage
-- ============================================================


testTree : Tree Label
testTree =
    Tree.tree ( "a", 0 )
        [ Tree.tree ( "b", 0 )
            [ Tree.singleton ( "d", 1 )
            , Tree.singleton ( "e", 2 )
            ]
        , Tree.tree ( "c", 0 )
            [ Tree.tree ( "f", 0 )
                [ Tree.singleton ( "i", 1 )
                , Tree.tree ( "j", 0 )
                    [ Tree.singleton ( "k", 1 )
                    , Tree.singleton ( "l", 1 )
                    ]
                ]
            , Tree.singleton ( "g", 2 )
            , Tree.singleton ( "h", 2 )
            ]
        ]



-- ============================================================
-- JSON-DECODER für flare.json
-- ============================================================


{-| `flare.json` enthält Knoten `{ name, value?, children? }`. Blätter
haben ein `value`, innere Knoten meist keines (deren Wert wird per
`sumUpInnerValues` aus den Blättern aufaddiert).
-}
treeDecoder : Decoder (Tree Label)
treeDecoder =
    D.map3
        (\name maybeValue maybeChildren ->
            let
                value =
                    Maybe.withDefault 0 maybeValue

                children =
                    Maybe.withDefault [] maybeChildren
            in
            Tree.tree ( name, value ) children
        )
        (D.field "name" D.string)
        (D.maybe (D.field "value" D.int))
        (D.maybe (D.field "children" (D.list (D.lazy (\_ -> treeDecoder)))))



-- ============================================================
-- WERTE DER INNEREN KNOTEN AUFADDIEREN
-- ============================================================


{-| Setzt für jeden inneren Knoten den Wert auf die Summe seiner
Kinder-Werte. Blätter bleiben unverändert.
-}
sumUpInnerValues : Tree Label -> Tree Label
sumUpInnerValues t =
    let
        children =
            List.map sumUpInnerValues (Tree.children t)

        ( name, ownValue ) =
            Tree.label t
    in
    case children of
        [] ->
            Tree.singleton ( name, ownValue )

        _ ->
            let
                sum =
                    List.sum (List.map (Tuple.second << Tree.label) children)
            in
            Tree.tree ( name, sum ) children



-- ============================================================
-- VIEW
-- ============================================================


view : Model -> Html Msg
view model =
    Html.div
        [ HA.style "font-family" "sans-serif", HA.style "padding" "16px" ]
        [ Html.h2 [] [ Html.text "Übung 10.1 – Einfache Treemap" ]
        , Html.h3 [] [ Html.text "testTree" ]
        , drawTreemapSimple model.testTree
        , Html.h3 [] [ Html.text "flare.json" ]
        , case model.tree of
            Nothing ->
                Html.p [] [ Html.text model.statusMsg ]

            Just t ->
                Html.div []
                    [ drawTreemapSimple t
                    , Html.h3 [] [ Html.text "Baum als Liste" ]
                    , Html.ul [] [ treeToListItem t ]
                    ]
        ]


{-| Zeichnet eine Treemap in ein 500×500-SVG mit 20 px Padding.

Beginnt mit `splitX = True`, d. h. die erste Aufteilung erfolgt
entlang der x-Achse. Bei jedem rekursiven Aufruf wird `splitX`
geflippt, sodass sich x- und y-Splits abwechseln.
-}
drawTreemapSimple : Tree Label -> Html msg
drawTreemapSimple t =
    let
        w =
            500

        h =
            500

        padding =
            20
    in
    TypedSvg.svg
        [ TypedSvg.Attributes.viewBox 0 0 (w + 2 * padding) (h + 2 * padding)
        , TypedSvg.Attributes.width (TypedSvg.Types.Percent 50)
        , TypedSvg.Attributes.height (TypedSvg.Types.Percent 50)
        , TypedSvg.Attributes.preserveAspectRatio
            (TypedSvg.Types.Align TypedSvg.Types.ScaleMin TypedSvg.Types.ScaleMin)
            TypedSvg.Types.Slice
        ]
        [ TypedSvg.g
            [ TypedSvg.Attributes.transform
                [ TypedSvg.Types.Translate padding padding ]
            ]
            (drawTreeNode True 0 0 w h t)
        ]


{-| Rekursive Treemap-Funktion.

  - `splitX`  – `True`, wenn die Kinder entlang der x-Achse aufgeteilt
    werden, `False` für die y-Achse. Wird beim Abstieg negiert.
  - `(x, y, w, h)` – aktuelles Rechteck.
  - `t` – aktueller Teilbaum.

Es wird zuerst das Rechteck des Knotens selbst gezeichnet, dann
werden die Kinder proportional zu ihrem (vorher aufaddierten) Wert
entlang der Split-Achse linear skaliert und rekursiv gezeichnet.

-}
drawTreeNode : Bool -> Float -> Float -> Float -> Float -> Tree Label -> List (TypedSvg.Core.Svg msg)
drawTreeNode splitX x y w h t =
    let
        ( _, totalValue ) =
            Tree.label t

        extent =
            ( 0, toFloat totalValue )

        ( splitOffset, splitSize ) =
            if splitX then
                ( x, w )

            else
                ( y, h )

        scale : ContinuousScale Float
        scale =
            Scale.linear ( splitOffset, splitOffset + splitSize ) extent

        childrenSizes : List Float
        childrenSizes =
            List.map (toFloat << Tuple.second << Tree.label) (Tree.children t)

        {- kumulierte Startpositionen entlang der Split-Achse. -}
        childrenCumSum : List Float
        childrenCumSum =
            List.Extra.scanl (+) 0 childrenSizes

        rectSvg =
            TypedSvg.rect
                [ TypedSvg.Attributes.x (TypedSvg.Types.px x)
                , TypedSvg.Attributes.y (TypedSvg.Types.px y)
                , TypedSvg.Attributes.width (TypedSvg.Types.px w)
                , TypedSvg.Attributes.height (TypedSvg.Types.px h)
                , TypedSvg.Attributes.stroke (TypedSvg.Types.Paint Color.black)
                , TypedSvg.Attributes.fill TypedSvg.Types.PaintNone
                ]
                []

        drawChild childPos childSize childNode =
            let
                pos =
                    Scale.convert scale childPos

                size =
                    Scale.convert scale childSize - splitOffset
            in
            if splitX then
                drawTreeNode (not splitX) pos y size h childNode

            else
                drawTreeNode (not splitX) x pos w size childNode
    in
    rectSvg
        :: List.concat
            (List.map3 drawChild
                childrenCumSum
                childrenSizes
                (Tree.children t)
            )



-- ============================================================
-- BAUM ALS VERSCHACHTELTE LISTE (zur Kontrolle)
-- ============================================================


treeToListItem : Tree Label -> Html msg
treeToListItem t =
    let
        ( name, value ) =
            Tree.label t

        kids =
            Tree.children t

        label =
            Html.text (name ++ " " ++ String.fromInt value)
    in
    case kids of
        [] ->
            Html.li [] [ label ]

        _ ->
            Html.li []
                [ label
                , Html.ul [] (List.map treeToListItem kids)
                ]



-- ============================================================
-- EMBEDDED flare.json (vermeidet HTTP/CORS auf Ellie)
-- ============================================================


flareJson : String
flareJson = """{
 "name": "flare",
 "children": [
  {
   "name": "analytics",
   "children": [
    {
     "name": "cluster",
     "children": [
      {"name": "AgglomerativeCluster", "value": 3938},
      {"name": "CommunityStructure", "value": 3812},
      {"name": "HierarchicalCluster", "value": 6714},
      {"name": "MergeEdge", "value": 743}
     ]
    },
    {
     "name": "graph",
     "children": [
      {"name": "BetweennessCentrality", "value": 3534},
      {"name": "LinkDistance", "value": 5731},
      {"name": "MaxFlowMinCut", "value": 7840},
      {"name": "ShortestPaths", "value": 5914},
      {"name": "SpanningTree", "value": 3416}
     ]
    },
    {
     "name": "optimization",
     "children": [
      {"name": "AspectRatioBanker", "value": 7074}
     ]
    }
   ]
  },
  {
   "name": "animate",
   "children": [
    {"name": "Easing", "value": 17010},
    {"name": "FunctionSequence", "value": 5842},
    {
     "name": "interpolate",
     "children": [
      {"name": "ArrayInterpolator", "value": 1983},
      {"name": "ColorInterpolator", "value": 2047},
      {"name": "DateInterpolator", "value": 1375},
      {"name": "Interpolator", "value": 8746},
      {"name": "MatrixInterpolator", "value": 2202},
      {"name": "NumberInterpolator", "value": 1382},
      {"name": "ObjectInterpolator", "value": 1629},
      {"name": "PointInterpolator", "value": 1675},
      {"name": "RectangleInterpolator", "value": 2042}
     ]
    },
    {"name": "ISchedulable", "value": 1041},
    {"name": "Parallel", "value": 5176},
    {"name": "Pause", "value": 449},
    {"name": "Scheduler", "value": 5593},
    {"name": "Sequence", "value": 5534},
    {"name": "Transition", "value": 9201},
    {"name": "Transitioner", "value": 19975},
    {"name": "TransitionEvent", "value": 1116},
    {"name": "Tween", "value": 6006}
   ]
  },
  {
   "name": "data",
   "children": [
    {
     "name": "converters",
     "children": [
      {"name": "Converters", "value": 721},
      {"name": "DelimitedTextConverter", "value": 4294},
      {"name": "GraphMLConverter", "value": 9800},
      {"name": "IDataConverter", "value": 1314},
      {"name": "JSONConverter", "value": 2220}
     ]
    },
    {"name": "DataField", "value": 1759},
    {"name": "DataSchema", "value": 2165},
    {"name": "DataSet", "value": 586},
    {"name": "DataSource", "value": 3331},
    {"name": "DataTable", "value": 772},
    {"name": "DataUtil", "value": 3322}
   ]
  },
  {
   "name": "display",
   "children": [
    {"name": "DirtySprite", "value": 8833},
    {"name": "LineSprite", "value": 1732},
    {"name": "RectSprite", "value": 3623},
    {"name": "TextSprite", "value": 10066}
   ]
  },
  {
   "name": "flex",
   "children": [
    {"name": "FlareVis", "value": 4116}
   ]
  },
  {
   "name": "physics",
   "children": [
    {"name": "DragForce", "value": 1082},
    {"name": "GravityForce", "value": 1336},
    {"name": "IForce", "value": 319},
    {"name": "NBodyForce", "value": 10498},
    {"name": "Particle", "value": 2822},
    {"name": "Simulation", "value": 9983},
    {"name": "Spring", "value": 2213},
    {"name": "SpringForce", "value": 1681}
   ]
  },
  {
   "name": "query",
   "children": [
    {"name": "AggregateExpression", "value": 1616},
    {"name": "And", "value": 1027},
    {"name": "Arithmetic", "value": 3891},
    {"name": "Average", "value": 891},
    {"name": "BinaryExpression", "value": 2893},
    {"name": "Comparison", "value": 5103},
    {"name": "CompositeExpression", "value": 3677},
    {"name": "Count", "value": 781},
    {"name": "DateUtil", "value": 4141},
    {"name": "Distinct", "value": 933},
    {"name": "Expression", "value": 5130},
    {"name": "ExpressionIterator", "value": 3617},
    {"name": "Fn", "value": 3240},
    {"name": "If", "value": 2732},
    {"name": "IsA", "value": 2039},
    {"name": "Literal", "value": 1214},
    {"name": "Match", "value": 3748},
    {"name": "Maximum", "value": 843},
    {
     "name": "methods",
     "children": [
      {"name": "add", "value": 593},
      {"name": "and", "value": 330},
      {"name": "average", "value": 287},
      {"name": "count", "value": 277},
      {"name": "distinct", "value": 292},
      {"name": "div", "value": 595},
      {"name": "eq", "value": 594},
      {"name": "fn", "value": 460},
      {"name": "gt", "value": 603},
      {"name": "gte", "value": 625},
      {"name": "iff", "value": 748},
      {"name": "isa", "value": 461},
      {"name": "lt", "value": 597},
      {"name": "lte", "value": 619},
      {"name": "max", "value": 283},
      {"name": "min", "value": 283},
      {"name": "mod", "value": 591},
      {"name": "mul", "value": 603},
      {"name": "neq", "value": 599},
      {"name": "not", "value": 386},
      {"name": "or", "value": 323},
      {"name": "orderby", "value": 307},
      {"name": "range", "value": 772},
      {"name": "select", "value": 296},
      {"name": "stddev", "value": 363},
      {"name": "sub", "value": 600},
      {"name": "sum", "value": 280},
      {"name": "update", "value": 307},
      {"name": "variance", "value": 335},
      {"name": "where", "value": 299},
      {"name": "xor", "value": 354},
      {"name": "_", "value": 264}
     ]
    },
    {"name": "Minimum", "value": 843},
    {"name": "Not", "value": 1554},
    {"name": "Or", "value": 970},
    {"name": "Query", "value": 13896},
    {"name": "Range", "value": 1594},
    {"name": "StringUtil", "value": 4130},
    {"name": "Sum", "value": 791},
    {"name": "Variable", "value": 1124},
    {"name": "Variance", "value": 1876},
    {"name": "Xor", "value": 1101}
   ]
  },
  {
   "name": "scale",
   "children": [
    {"name": "IScaleMap", "value": 2105},
    {"name": "LinearScale", "value": 1316},
    {"name": "LogScale", "value": 3151},
    {"name": "OrdinalScale", "value": 3770},
    {"name": "QuantileScale", "value": 2435},
    {"name": "QuantitativeScale", "value": 4839},
    {"name": "RootScale", "value": 1756},
    {"name": "Scale", "value": 4268},
    {"name": "ScaleType", "value": 1821},
    {"name": "TimeScale", "value": 5833}
   ]
  },
  {
   "name": "util",
   "children": [
    {"name": "Arrays", "value": 8258},
    {"name": "Colors", "value": 10001},
    {"name": "Dates", "value": 8217},
    {"name": "Displays", "value": 12555},
    {"name": "Filter", "value": 2324},
    {"name": "Geometry", "value": 10993},
    {
     "name": "heap",
     "children": [
      {"name": "FibonacciHeap", "value": 9354},
      {"name": "HeapNode", "value": 1233}
     ]
    },
    {"name": "IEvaluable", "value": 335},
    {"name": "IPredicate", "value": 383},
    {"name": "IValueProxy", "value": 874},
    {
     "name": "math",
     "children": [
      {"name": "DenseMatrix", "value": 3165},
      {"name": "IMatrix", "value": 2815},
      {"name": "SparseMatrix", "value": 3366}
     ]
    },
    {"name": "Maths", "value": 17705},
    {"name": "Orientation", "value": 1486},
    {
     "name": "palette",
     "children": [
      {"name": "ColorPalette", "value": 6367},
      {"name": "Palette", "value": 1229},
      {"name": "ShapePalette", "value": 2059},
      {"name": "SizePalette", "value": 2291}
     ]
    },
    {"name": "Property", "value": 5559},
    {"name": "Shapes", "value": 19118},
    {"name": "Sort", "value": 6887},
    {"name": "Stats", "value": 6557},
    {"name": "Strings", "value": 22026}
   ]
  },
  {
   "name": "vis",
   "children": [
    {
     "name": "axis",
     "children": [
      {"name": "Axes", "value": 1302},
      {"name": "Axis", "value": 24593},
      {"name": "AxisGridLine", "value": 652},
      {"name": "AxisLabel", "value": 636},
      {"name": "CartesianAxes", "value": 6703}
     ]
    },
    {
     "name": "controls",
     "children": [
      {"name": "AnchorControl", "value": 2138},
      {"name": "ClickControl", "value": 3824},
      {"name": "Control", "value": 1353},
      {"name": "ControlList", "value": 4665},
      {"name": "DragControl", "value": 2649},
      {"name": "ExpandControl", "value": 2832},
      {"name": "HoverControl", "value": 4896},
      {"name": "IControl", "value": 763},
      {"name": "PanZoomControl", "value": 5222},
      {"name": "SelectionControl", "value": 7862},
      {"name": "TooltipControl", "value": 8435}
     ]
    },
    {
     "name": "data",
     "children": [
      {"name": "Data", "value": 20544},
      {"name": "DataList", "value": 19788},
      {"name": "DataSprite", "value": 10349},
      {"name": "EdgeSprite", "value": 3301},
      {"name": "NodeSprite", "value": 19382},
      {
       "name": "render",
       "children": [
        {"name": "ArrowType", "value": 698},
        {"name": "EdgeRenderer", "value": 5569},
        {"name": "IRenderer", "value": 353},
        {"name": "ShapeRenderer", "value": 2247}
       ]
      },
      {"name": "ScaleBinding", "value": 11275},
      {"name": "Tree", "value": 7147},
      {"name": "TreeBuilder", "value": 9930}
     ]
    },
    {
     "name": "events",
     "children": [
      {"name": "DataEvent", "value": 2313},
      {"name": "SelectionEvent", "value": 1880},
      {"name": "TooltipEvent", "value": 1701},
      {"name": "VisualizationEvent", "value": 1117}
     ]
    },
    {
     "name": "legend",
     "children": [
      {"name": "Legend", "value": 20859},
      {"name": "LegendItem", "value": 4614},
      {"name": "LegendRange", "value": 10530}
     ]
    },
    {
     "name": "operator",
     "children": [
      {
       "name": "distortion",
       "children": [
        {"name": "BifocalDistortion", "value": 4461},
        {"name": "Distortion", "value": 6314},
        {"name": "FisheyeDistortion", "value": 3444}
       ]
      },
      {
       "name": "encoder",
       "children": [
        {"name": "ColorEncoder", "value": 3179},
        {"name": "Encoder", "value": 4060},
        {"name": "PropertyEncoder", "value": 4138},
        {"name": "ShapeEncoder", "value": 1690},
        {"name": "SizeEncoder", "value": 1830}
       ]
      },
      {
       "name": "filter",
       "children": [
        {"name": "FisheyeTreeFilter", "value": 5219},
        {"name": "GraphDistanceFilter", "value": 3165},
        {"name": "VisibilityFilter", "value": 3509}
       ]
      },
      {"name": "IOperator", "value": 1286},
      {
       "name": "label",
       "children": [
        {"name": "Labeler", "value": 9956},
        {"name": "RadialLabeler", "value": 3899},
        {"name": "StackedAreaLabeler", "value": 3202}
       ]
      },
      {
       "name": "layout",
       "children": [
        {"name": "AxisLayout", "value": 6725},
        {"name": "BundledEdgeRouter", "value": 3727},
        {"name": "CircleLayout", "value": 9317},
        {"name": "CirclePackingLayout", "value": 12003},
        {"name": "DendrogramLayout", "value": 4853},
        {"name": "ForceDirectedLayout", "value": 8411},
        {"name": "IcicleTreeLayout", "value": 4864},
        {"name": "IndentedTreeLayout", "value": 3174},
        {"name": "Layout", "value": 7881},
        {"name": "NodeLinkTreeLayout", "value": 12870},
        {"name": "PieLayout", "value": 2728},
        {"name": "RadialTreeLayout", "value": 12348},
        {"name": "RandomLayout", "value": 870},
        {"name": "StackedAreaLayout", "value": 9121},
        {"name": "TreeMapLayout", "value": 9191}
       ]
      },
      {"name": "Operator", "value": 2490},
      {"name": "OperatorList", "value": 5248},
      {"name": "OperatorSequence", "value": 4190},
      {"name": "OperatorSwitch", "value": 2581},
      {"name": "SortOperator", "value": 2023}
     ]
    },
    {"name": "Visualization", "value": 16540}
   ]
  }
 ]
}
"""
