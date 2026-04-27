module Uebung3aufgabe3 exposing (main)

import Array
import Cars exposing (Car, CarType(..), cars, carTypeToString)
import Html exposing (Html)
import Html.Attributes
import TypedSvg exposing (circle, g, line, style, svg, text_)
import TypedSvg.Attributes exposing (class, textAnchor, viewBox)
import TypedSvg.Attributes.InPx exposing (cx, cy, height, r, width, x, x1, x2, y, y1, y2)
import TypedSvg.Core exposing (Svg)
import TypedSvg.Types exposing (AnchorAlignment(..))



-- KONSTANTEN


plotWidth : Float
plotWidth =
    420


plotHeight : Float
plotHeight =
    360


padding : Float
padding =
    60


tickCount : Int
tickCount =
    5



-- DATENAUFBEREITUNG (gleiche Filterung wie Aufgabe 3.1 / 3.2)


isComplete : Car -> Bool
isComplete car =
    Maybe.withDefault False
        (Maybe.map4 (\_ _ _ _ -> True)
            car.cityMPG
            car.retailPrice
            car.dealerCost
            car.carLen
        )


filteredCars : List Car
filteredCars =
    List.filter isComplete cars


carsOfClass : CarType -> List Car
carsOfClass carType =
    List.filter (\c -> c.carType == carType) filteredCars


toFloatMaybe : Maybe Int -> Float
toFloatMaybe =
    Maybe.withDefault 0 >> toFloat


cityMpg : Car -> Float
cityMpg c =
    toFloatMaybe c.cityMPG


retailPrice : Car -> Float
retailPrice c =
    toFloatMaybe c.retailPrice


dealerCost : Car -> Float
dealerCost c =
    toFloatMaybe c.dealerCost


carLen : Car -> Float
carLen c =
    toFloatMaybe c.carLen



-- QUANTIL-INTERPOLATION


quantileAt : List Float -> Float -> Float
quantileAt sortedValues q =
    let
        arr =
            Array.fromList sortedValues

        n =
            Array.length arr
    in
    if n == 0 then
        0

    else if n == 1 then
        Array.get 0 arr |> Maybe.withDefault 0

    else
        let
            position =
                clamp 0 (toFloat (n - 1)) (q * toFloat (n - 1))

            lowerIndex =
                floor position

            upperIndex =
                min (n - 1) (lowerIndex + 1)

            t =
                position - toFloat lowerIndex

            lowerValue =
                Array.get lowerIndex arr |> Maybe.withDefault 0

            upperValue =
                Array.get upperIndex arr |> Maybe.withDefault lowerValue
        in
        lowerValue + t * (upperValue - lowerValue)


qqPlotPoints : List Float -> List Float -> List ( Float, Float )
qqPlotPoints listA listB =
    let
        sortedA =
            List.sort listA

        sortedB =
            List.sort listB

        nA =
            List.length sortedA
    in
    sortedA
        |> List.indexedMap
            (\i vA ->
                let
                    f =
                        (toFloat i + 0.5) / toFloat nA
                in
                ( vA, quantileAt sortedB f )
            )



-- SKALIERUNG


type alias Extent =
    { min : Float, max : Float }


extentWithPadding : List Float -> Extent
extentWithPadding values =
    let
        minValue =
            Maybe.withDefault 0 (List.minimum values)

        maxValue =
            Maybe.withDefault 1 (List.maximum values)

        rawRange =
            maxValue - minValue

        paddingValue =
            if rawRange == 0 then
                1

            else
                rawRange * 0.08
    in
    { min = minValue - paddingValue
    , max = maxValue + paddingValue
    }


scale : Float -> Float -> Float -> Float -> Float -> Float
scale value domainMin domainMax rangeMin rangeMax =
    if domainMax == domainMin then
        (rangeMin + rangeMax) / 2

    else
        rangeMin + (value - domainMin) / (domainMax - domainMin) * (rangeMax - rangeMin)


scaleX : Extent -> Float -> Float
scaleX xExtent value =
    scale value xExtent.min xExtent.max padding (plotWidth - padding)


scaleY : Extent -> Float -> Float
scaleY yExtent value =
    scale value yExtent.min yExtent.max (plotHeight - padding) padding



-- ACHSEN


axisStyles : String
axisStyles =
    """
    .axis-line { stroke: #1f2933; stroke-width: 1.5px; }
    .tick-line { stroke: #52606d; stroke-width: 1px; }
    .tick-label { fill: #334e68; font-size: 10px; font-family: sans-serif; }
    .axis-label { fill: #102a43; font-size: 12px; font-family: sans-serif; font-weight: 600; }
    .data-point { fill: #2f6feb; stroke: #1d3f8a; stroke-width: 1px; }
    .diagonal { stroke: #d64545; stroke-width: 2px; stroke-dasharray: 8 6; }
    """


formatTick : Float -> String
formatTick value =
    let
        rounded =
            (value * 100 |> round |> toFloat) / 100
    in
    String.fromFloat rounded


axisFrame : String -> String -> Extent -> Extent -> List (Svg msg)
axisFrame xLabel yLabel xExtent yExtent =
    let
        ticks valuesFn =
            List.range 0 tickCount
                |> List.concatMap valuesFn

        xTickEls =
            ticks
                (\i ->
                    let
                        ratio =
                            toFloat i / toFloat tickCount

                        v =
                            xExtent.min + ratio * (xExtent.max - xExtent.min)

                        tx =
                            scaleX xExtent v
                    in
                    [ line [ x1 tx, y1 (plotHeight - padding), x2 tx, y2 (plotHeight - padding + 5), class [ "tick-line" ] ] []
                    , text_ [ x tx, y (plotHeight - padding + 18), textAnchor AnchorMiddle, class [ "tick-label" ] ]
                        [ TypedSvg.Core.text (formatTick v) ]
                    ]
                )

        yTickEls =
            ticks
                (\i ->
                    let
                        ratio =
                            toFloat i / toFloat tickCount

                        v =
                            yExtent.min + ratio * (yExtent.max - yExtent.min)

                        ty =
                            scaleY yExtent v
                    in
                    [ line [ x1 (padding - 5), y1 ty, x2 padding, y2 ty, class [ "tick-line" ] ] []
                    , text_ [ x (padding - 8), y (ty + 4), textAnchor AnchorEnd, class [ "tick-label" ] ]
                        [ TypedSvg.Core.text (formatTick v) ]
                    ]
                )
    in
    [ style [] [ TypedSvg.Core.text axisStyles ]
    , line [ x1 padding, y1 (plotHeight - padding), x2 (plotWidth - padding), y2 (plotHeight - padding), class [ "axis-line" ] ] []
    , line [ x1 padding, y1 padding, x2 padding, y2 (plotHeight - padding), class [ "axis-line" ] ] []
    , text_ [ x (plotWidth / 2), y (plotHeight - 12), textAnchor AnchorMiddle, class [ "axis-label" ] ] [ TypedSvg.Core.text xLabel ]
    , text_ [ x 12, y 22, class [ "axis-label" ] ] [ TypedSvg.Core.text yLabel ]
    ]
        ++ xTickEls
        ++ yTickEls


qqPlot : String -> String -> List ( Float, Float ) -> Svg msg
qqPlot xLabel yLabel points =
    let
        xs =
            List.map Tuple.first points

        ys =
            List.map Tuple.second points

        sharedExtent =
            extentWithPadding (xs ++ ys)
    in
    svg [ viewBox 0 0 plotWidth plotHeight, width plotWidth, height plotHeight ]
        (axisFrame xLabel yLabel sharedExtent sharedExtent
            ++ [ line
                    [ x1 (scaleX sharedExtent sharedExtent.min)
                    , y1 (scaleY sharedExtent sharedExtent.min)
                    , x2 (scaleX sharedExtent sharedExtent.max)
                    , y2 (scaleY sharedExtent sharedExtent.max)
                    , class [ "diagonal" ]
                    ]
                    []
               ]
            ++ List.map
                (\( px, py ) ->
                    circle [ cx (scaleX sharedExtent px), cy (scaleY sharedExtent py), r 3, class [ "data-point" ] ] []
                )
                points
        )



-- KOMBINATIONEN


type alias Comparison =
    { classA : CarType
    , classB : CarType
    , attribute : String
    , extractor : Car -> Float
    , verdict : String
    }


comparisons : List Comparison
comparisons =
    [ { classA = SUV
      , classB = Small_Sporty_Compact_Large_Sedan
      , attribute = "cityMPG"
      , extractor = cityMpg
      , verdict = "Punkte liegen klar unterhalb der Diagonale und annähernd parallel: SUVs verbrauchen systematisch mehr (additive Verschiebung plausibel)."
      }
    , { classA = SUV
      , classB = Sports_Car
      , attribute = "cityMPG"
      , extractor = cityMpg
      , verdict = "Verschiebung deutlich, aber Verlauf nicht streng parallel — additive Verschiebung nur grob, eher leichte Skalenänderung."
      }
    , { classA = Wagon
      , classB = Small_Sporty_Compact_Large_Sedan
      , attribute = "cityMPG"
      , extractor = cityMpg
      , verdict = "Punkte fast auf der Diagonalen mit kleiner Verschiebung — additive Verschiebung gut sichtbar."
      }
    , { classA = SUV
      , classB = Small_Sporty_Compact_Large_Sedan
      , attribute = "retailPrice"
      , extractor = retailPrice
      , verdict = "Stark gekrümmter Verlauf: keine reine additive Verschiebung, sondern multiplikative Verzerrung im oberen Preisbereich."
      }
    , { classA = SUV
      , classB = Wagon
      , attribute = "carLen"
      , extractor = carLen
      , verdict = "Punkte liegen sehr nahe an der Diagonalen mit kleiner Verschiebung — additive Verschiebung plausibel."
      }
    , { classA = Minivan
      , classB = SUV
      , attribute = "dealerCost"
      , extractor = dealerCost
      , verdict = "Punkte folgen weitgehend der Diagonalen, aber mit deutlichem Knick am oberen Ende — additive Verschiebung nur in der Mitte gegeben."
      }
    ]


comparisonView : Comparison -> Html msg
comparisonView c =
    let
        labelA =
            carTypeToString c.classA

        labelB =
            carTypeToString c.classB

        valuesA =
            List.map c.extractor (carsOfClass c.classA)

        valuesB =
            List.map c.extractor (carsOfClass c.classB)

        points =
            qqPlotPoints valuesA valuesB
    in
    Html.div
        [ Html.Attributes.style "border" "1px solid #d9e2ec"
        , Html.Attributes.style "border-radius" "6px"
        , Html.Attributes.style "padding" "12px"
        , Html.Attributes.style "background" "#fbfcfe"
        ]
        [ Html.h4
            [ Html.Attributes.style "margin" "0 0 4px" ]
            [ Html.text (labelA ++ " vs. " ++ labelB ++ " — " ++ c.attribute) ]
        , Html.p
            [ Html.Attributes.style "margin" "0 0 6px"
            , Html.Attributes.style "font-size" "12px"
            , Html.Attributes.style "color" "#52606d"
            ]
            [ Html.text
                ("n(" ++ labelA ++ ") = " ++ String.fromInt (List.length valuesA)
                    ++ " | n(" ++ labelB ++ ") = " ++ String.fromInt (List.length valuesB)
                )
            ]
        , qqPlot (c.attribute ++ " (" ++ labelA ++ ")") (c.attribute ++ " (" ++ labelB ++ ")") points
        , Html.p
            [ Html.Attributes.style "margin" "8px 0 0"
            , Html.Attributes.style "font-size" "13px"
            ]
            [ Html.text c.verdict ]
        ]



-- MAIN


main : Html msg
main =
    Html.div
        [ Html.Attributes.style "font-family" "sans-serif"
        , Html.Attributes.style "padding" "16px"
        , Html.Attributes.style "line-height" "1.5"
        ]
        [ Html.h2 [] [ Html.text "Aufgabe 3.3 — additive Verschiebung visuell prüfen" ]
        , Html.p []
            [ Html.text "Verschiedene Kombinationen von Autoklassen und Attributen werden als QQ-Plot mit Diagonale dargestellt. Liegen die Punkte (annähernd) parallel zur roten Diagonale, ist eine additive Verschiebung der Verteilungen plausibel; eine Krümmung deutet auf andere Unterschiede (Skalierung, Schiefe) hin." ]
        , Html.div
            [ Html.Attributes.style "display" "grid"
            , Html.Attributes.style "grid-template-columns" "repeat(auto-fit, minmax(440px, 1fr))"
            , Html.Attributes.style "gap" "16px"
            ]
            (List.map comparisonView comparisons)
        ]
