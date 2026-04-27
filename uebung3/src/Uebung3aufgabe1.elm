module Uebung3aufgabe1 exposing (main)

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
    720


plotHeight : Float
plotHeight =
    480


padding : Float
padding =
    70


tickCount : Int
tickCount =
    5



-- AUSWAHL


selectedClass : CarType
selectedClass =
    SUV



-- DATENAUFBEREITUNG (kompatibel zu Übung 2)


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


carsInClass : List Car
carsInClass =
    List.filter (\car -> car.carType == selectedClass) filteredCars


cityMpg : Car -> Float
cityMpg car =
    car.cityMPG
        |> Maybe.withDefault 0
        |> toFloat



-- Q-PLOT BERECHNUNG
-- Liste der Datenwerte -> Liste von (f-Value, Quantil) Punkten


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


qPoints : List ( Float, Float )
qPoints =
    qPlotPoints (List.map cityMpg carsInClass)



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
    .tick-label { fill: #334e68; font-size: 12px; font-family: sans-serif; }
    .axis-label { fill: #102a43; font-size: 14px; font-family: sans-serif; font-weight: 600; }
    .data-point { fill: #2f6feb; stroke: #1d3f8a; stroke-width: 1px; }
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
                [ line
                    [ x1 tickX
                    , y1 (plotHeight - padding)
                    , x2 tickX
                    , y2 (plotHeight - padding + 6)
                    , class [ "tick-line" ]
                    ]
                    []
                , text_
                    [ x tickX
                    , y (plotHeight - padding + 24)
                    , textAnchor AnchorMiddle
                    , class [ "tick-label" ]
                    ]
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
                [ line
                    [ x1 (padding - 6)
                    , y1 tickY
                    , x2 padding
                    , y2 tickY
                    , class [ "tick-line" ]
                    ]
                    []
                , text_
                    [ x (padding - 10)
                    , y (tickY + 4)
                    , textAnchor AnchorEnd
                    , class [ "tick-label" ]
                    ]
                    [ TypedSvg.Core.text (formatTick tickValue) ]
                ]
            )



-- SCATTERPLOT (universell, nimmt Liste von (x, y) Punkten)


scatterplot : String -> String -> List ( Float, Float ) -> Extent -> Extent -> Svg msg
scatterplot xLabel yLabel points xExtent yExtent =
    svg [ viewBox 0 0 plotWidth plotHeight, width plotWidth, height plotHeight ]
        ([ style [] [ TypedSvg.Core.text axisStyles ]
         , line
            [ x1 padding
            , y1 (plotHeight - padding)
            , x2 (plotWidth - padding)
            , y2 (plotHeight - padding)
            , class [ "axis-line" ]
            ]
            []
         , line
            [ x1 padding
            , y1 padding
            , x2 padding
            , y2 (plotHeight - padding)
            , class [ "axis-line" ]
            ]
            []
         , text_
            [ x (plotWidth / 2)
            , y (plotHeight - 18)
            , textAnchor AnchorMiddle
            , class [ "axis-label" ]
            ]
            [ TypedSvg.Core.text xLabel ]
         , text_
            [ x 14
            , y 30
            , class [ "axis-label" ]
            ]
            [ TypedSvg.Core.text yLabel ]
         ]
            ++ xTicks xExtent
            ++ yTicks yExtent
            ++ List.map
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
        )



-- MAIN


main : Html msg
main =
    let
        xs =
            List.map Tuple.first qPoints

        ys =
            List.map Tuple.second qPoints

        xExtent =
            { min = 0, max = 1 }

        yExtent =
            extentWithPadding ys
    in
    Html.div
        [ Html.Attributes.style "font-family" "sans-serif"
        , Html.Attributes.style "padding" "16px"
        , Html.Attributes.style "line-height" "1.5"
        ]
        [ Html.h2 [] [ Html.text "Aufgabe 3.1 — Quantil-Plot" ]
        , Html.p []
            [ Html.text ("Gewählte Autoklasse: " ++ carTypeToString selectedClass) ]
        , Html.p []
            [ Html.text
                ("Anzahl Autos in der Klasse (gefilterte Datenmenge mit cityMPG, retailPrice, dealerCost, carLen): "
                    ++ String.fromInt (List.length carsInClass)
                )
            ]
        , Html.p []
            [ Html.text "Q-Plot: x-Achse zeigt die F-Values (i + 0.5) / n, y-Achse zeigt das Quantil (cityMPG)." ]
        , scatterplot "f-Value" "cityMPG (Quantil)" qPoints xExtent yExtent
        , Html.p [ Html.Attributes.style "color" "#52606d", Html.Attributes.style "font-size" "12px" ]
            [ Html.text
                ("(Anzahl Punkte im Plot: "
                    ++ String.fromInt (List.length xs)
                    ++ ")"
                )
            ]
        ]
