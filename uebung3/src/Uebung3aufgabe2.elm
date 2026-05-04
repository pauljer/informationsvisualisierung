module Uebung3aufgabe2 exposing (main)

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
    900


plotHeight : Float
plotHeight =
    480


padding : Float
padding =
    70


tickCount : Int
tickCount =
    5



-- AUSWAHL: zwei Autoklassen


classA : CarType
classA =
    SUV


classB : CarType
classB =
    Minivan


-- Pluralform für die Anzeige ("SUVs", "Minivans", ...)


plural : CarType -> String
plural carType =
    case carType of
        SUV ->
            "SUVs"

        Minivan ->
            "Minivans"

        Sports_Car ->
            "Sports Cars"

        Wagon ->
            "Wagons"

        Pickup ->
            "Pickups"

        Small_Sporty_Compact_Large_Sedan ->
            "Sedans"



-- DATENAUFBEREITUNG


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


cityMpg : Car -> Float
cityMpg car =
    car.cityMPG
        |> Maybe.withDefault 0
        |> toFloat


carsOfClass : CarType -> List Car
carsOfClass carType =
    List.filter (\c -> c.carType == carType) filteredCars


cityMpgValues : CarType -> List Float
cityMpgValues carType =
    List.map cityMpg (carsOfClass carType)



-- QUANTIL-BERECHNUNG


qPlotPoints : List Float -> List ( Float, Float )
qPlotPoints values =
    let
        sorted =
            List.sort values

        n =
            List.length sorted
    in
    List.indexedMap
        (\i v ->
            ( (toFloat i + 0.5) / toFloat n, v )
        )
        sorted


-- Linear interpoliertes Quantil (entspricht Statistics.quantile aus elm-visualization).
-- Voraussetzung: values ist nicht leer und (für sinnvolle Ergebnisse) sortiert.
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



-- QQ-PLOT BERECHNUNG
-- Hinweis aus der Aufgabe: nimm die F-Values der einen Liste und berechne
-- für diese F-Values die (interpolierten) Quantile der anderen Liste.


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

                    vB =
                        quantileAt sortedB f
                in
                ( vA, vB )
            )



-- WERTE


valuesA : List Float
valuesA =
    cityMpgValues classA


valuesB : List Float
valuesB =
    cityMpgValues classB


qPointsA : List ( Float, Float )
qPointsA =
    qPlotPoints valuesA


qPointsB : List ( Float, Float )
qPointsB =
    qPlotPoints valuesB


qqPoints : List ( Float, Float )
qqPoints =
    qqPlotPoints valuesA valuesB



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



-- ACHSEN-RENDERING


axisStyles : String
axisStyles =
    """
    .axis-line { stroke: #1f2933; stroke-width: 1px; }
    .tick-line { stroke: #1f2933; stroke-width: 1px; }
    .tick-label { fill: #1f2933; font-size: 12px; font-family: sans-serif; }
    .axis-label { fill: #1f2933; font-size: 12px; font-family: sans-serif; }
    .data-point { fill: #ffffff; stroke: #1f2933; stroke-width: 1px; }
    .diagonal { stroke: #1f2933; stroke-width: 1px; }
    """


formatTick : Float -> String
formatTick value =
    let
        rounded =
            (value * 100 |> round |> toFloat) / 100
    in
    String.fromFloat rounded


xTicks : Extent -> List (Svg msg)
xTicks xExtent =
    List.range 0 tickCount
        |> List.concatMap
            (\tickIndex ->
                let
                    ratio =
                        toFloat tickIndex / toFloat tickCount

                    tickValue =
                        xExtent.min + ratio * (xExtent.max - xExtent.min)

                    tickX =
                        scaleX xExtent tickValue
                in
                [ line [ x1 tickX, y1 (plotHeight - padding), x2 tickX, y2 (plotHeight - padding + 6), class [ "tick-line" ] ] []
                , text_
                    [ x tickX, y (plotHeight - padding + 22), textAnchor AnchorMiddle, class [ "tick-label" ] ]
                    [ TypedSvg.Core.text (formatTick tickValue) ]
                ]
            )


yTicks : Extent -> List (Svg msg)
yTicks yExtent =
    List.range 0 tickCount
        |> List.concatMap
            (\tickIndex ->
                let
                    ratio =
                        toFloat tickIndex / toFloat tickCount

                    tickValue =
                        yExtent.min + ratio * (yExtent.max - yExtent.min)

                    tickY =
                        scaleY yExtent tickValue
                in
                [ line [ x1 (padding - 6), y1 tickY, x2 padding, y2 tickY, class [ "tick-line" ] ] []
                , text_
                    [ x (padding - 10), y (tickY + 4), textAnchor AnchorEnd, class [ "tick-label" ] ]
                    [ TypedSvg.Core.text (formatTick tickValue) ]
                ]
            )


axisFrame : String -> String -> Extent -> Extent -> List (Svg msg)
axisFrame xLabel yLabel xExtent yExtent =
    [ style [] [ TypedSvg.Core.text axisStyles ]
    , line [ x1 padding, y1 (plotHeight - padding), x2 (plotWidth - padding), y2 (plotHeight - padding), class [ "axis-line" ] ] []
    , line [ x1 padding, y1 padding, x2 padding, y2 (plotHeight - padding), class [ "axis-line" ] ] []
    , text_ [ x (plotWidth / 2), y (plotHeight - 14), textAnchor AnchorMiddle, class [ "axis-label" ] ] [ TypedSvg.Core.text xLabel ]
    , text_ [ x 14, y 26, class [ "axis-label" ] ] [ TypedSvg.Core.text yLabel ]
    ]
        ++ xTicks xExtent
        ++ yTicks yExtent


renderPoints : List ( Float, Float ) -> Extent -> Extent -> List (Svg msg)
renderPoints points xExtent yExtent =
    List.map
        (\( px, py ) ->
            circle
                [ cx (scaleX xExtent px)
                , cy (scaleY yExtent py)
                , r 4
                , class [ "data-point" ]
                ]
                []
        )
        points



-- PLOTS


qPlot : String -> List ( Float, Float ) -> Svg msg
qPlot yLabel points =
    let
        ys =
            List.map Tuple.second points

        xExtent =
            { min = 0, max = 1 }

        yExtent =
            extentWithPadding ys
    in
    svg [ viewBox 0 0 plotWidth plotHeight, width plotWidth, height plotHeight ]
        (axisFrame "f-Value" yLabel xExtent yExtent
            ++ renderPoints points xExtent yExtent
        )


qqPlot : String -> String -> List ( Float, Float ) -> Svg msg
qqPlot xLabel yLabel points =
    let
        xs =
            List.map Tuple.first points

        ys =
            List.map Tuple.second points

        combined =
            xs ++ ys

        sharedExtent =
            extentWithPadding combined

        xExtent =
            sharedExtent

        yExtent =
            sharedExtent

        diagX1 =
            scaleX xExtent sharedExtent.min

        diagY1 =
            scaleY yExtent sharedExtent.min

        diagX2 =
            scaleX xExtent sharedExtent.max

        diagY2 =
            scaleY yExtent sharedExtent.max
    in
    svg [ viewBox 0 0 plotWidth plotHeight, width plotWidth, height plotHeight ]
        (axisFrame xLabel yLabel xExtent yExtent
            ++ [ line
                    [ x1 diagX1, y1 diagY1, x2 diagX2, y2 diagY2, class [ "diagonal" ] ]
                    []
               ]
            ++ renderPoints points xExtent yExtent
        )



-- MAIN


main : Html msg
main =
    Html.div
        [ Html.Attributes.style "font-family" "sans-serif"
        , Html.Attributes.style "padding" "16px"
        , Html.Attributes.style "line-height" "1.5"
        ]
        [ Html.h3 [] [ Html.text (plural classA ++ " versus " ++ plural classB) ]
        , Html.ul []
            [ Html.li [] [ Html.text ("Number of filtered Cars: " ++ String.fromInt (List.length filteredCars)) ]
            , Html.li [] [ Html.text ("Number of " ++ plural classA ++ ": " ++ String.fromInt (List.length valuesA)) ]
            , Html.li [] [ Html.text ("Number of " ++ plural classB ++ ": " ++ String.fromInt (List.length valuesB)) ]
            ]
        , Html.h3 [] [ Html.text ("Q-Plot cityMPG for " ++ plural classA) ]
        , qPlot "quantiles cityMPG" qPointsA
        , Html.h3 [] [ Html.text ("Q-Plot cityMPG for " ++ plural classB) ]
        , qPlot "quantiles cityMPG" qPointsB
        , Html.h3 [] [ Html.text ("QQ-Plot cityMPG for " ++ plural classA ++ " and " ++ plural classB) ]
        , qqPlot ("quantiles cityMPG " ++ plural classA) ("quantiles cityMPG " ++ plural classB) qqPoints
        ]
