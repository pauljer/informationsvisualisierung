module Uebung4Aufgabe1 exposing (main)

import Html exposing (Html, div)
import Html.Attributes as HA
import Svg exposing (Svg, svg, g, circle, line, text_)
import Svg.Attributes as Attr
import Scale
import Axis
import Cars exposing (cars, CarType(..))


-- FILTER

validCars =
    List.filter
        (\c ->
            Maybe.withDefault False
                (Maybe.map4 (\_ _ _ _ -> True)
                    c.cityMPG
                    c.retailPrice
                    c.dealerCost
                    c.carLen
                )
        )
        cars


selectedClass =
    SUV


carsOfClass =
    List.filter (\c -> c.carType == selectedClass) validCars


cityValues =
    carsOfClass
        |> List.filterMap (.cityMPG >> Maybe.map toFloat)


-- STATISTIK

mean xs =
    List.sum xs / toFloat (List.length xs)


std xs =
    let
        m =
            mean xs
    in
    xs
        |> List.map (\x -> (x - m) ^ 2)
        |> List.sum
        |> (\s -> s / toFloat (List.length xs))
        |> sqrt


mu =
    mean cityValues


sigma =
    std cityValues


n =
    toFloat (List.length cityValues)


-- QUANTILE

sorted =
    List.sort cityValues


quantilePositions =
    List.indexedMap (\i _ -> (toFloat i + 0.5) / n) sorted


invNormalCdf f =
    if f >= 0.5 then
        5.5556 * (1 - ((1 - f) / f) ^ 0.1186)
    else
        -5.5556 * (1 - (f / (1 - f)) ^ 0.1186)


-- 🔥 WICHTIG: zwei verschiedene QQ-Varianten

-- Normalverteilung mit μ und σ
normalQuantiles =
    List.map (\f -> mu + sigma * invNormalCdf f) quantilePositions


-- Standardnormalverteilung
standardNormalQuantiles =
    List.map invNormalCdf quantilePositions


-- REFERENZLINIE (über Quartile)

referenceLine xData yData =
    let
        nLocal =
            List.length xData

        i25 =
            floor (0.25 * toFloat (nLocal - 1))

        i75 =
            floor (0.75 * toFloat (nLocal - 1))

        x25 =
            List.drop i25 xData |> List.head |> Maybe.withDefault 0

        y25 =
            List.drop i25 yData |> List.head |> Maybe.withDefault 0

        x75 =
            List.drop i75 xData |> List.head |> Maybe.withDefault 0

        y75 =
            List.drop i75 yData |> List.head |> Maybe.withDefault 0

        slope =
            (y75 - y25) / (x75 - x25)

        intercept =
            y25 - slope * x25
    in
    ( slope, intercept )


-- PLOT

plot title xData yData xLabel yLabel showLine =
    let
        xMin =
            List.minimum xData |> Maybe.withDefault -2

        xMax =
            List.maximum xData |> Maybe.withDefault 2

        yMin =
            List.minimum yData |> Maybe.withDefault 0

        yMax =
            List.maximum yData |> Maybe.withDefault 1

        xScale =
            Scale.linear ( 0, 1200 )
                ( xMin - 0.2, xMax + 0.2 )

        yScale =
            Scale.linear ( 750, 0 )
                ( yMin - 1, yMax + 1 )


        ( slope, intercept ) =
            referenceLine xData yData


        lineElement =
            if showLine then
                [ line
                    [ Attr.x1 (String.fromFloat (Scale.convert xScale xMin))
                    , Attr.y1 (String.fromFloat (Scale.convert yScale (slope * xMin + intercept)))
                    , Attr.x2 (String.fromFloat (Scale.convert xScale xMax))
                    , Attr.y2 (String.fromFloat (Scale.convert yScale (slope * xMax + intercept)))
                    , Attr.stroke "black"
                    , Attr.strokeWidth "2"
                    ]
                    []
                ]

            else
                []


        point ( x, y ) =
            g [ Attr.class "point" ]
                [ circle
                    [ Attr.cx (String.fromFloat (Scale.convert xScale x))
                    , Attr.cy (String.fromFloat (Scale.convert yScale y))
                    , Attr.r "6"
                    ]
                    []
                , text_
                    [ Attr.x (String.fromFloat (Scale.convert xScale x))
                    , Attr.y (String.fromFloat (Scale.convert yScale y - 10))
                    , Attr.textAnchor "middle"
                    ]
                    [ Svg.text
                        ("("
                            ++ String.fromFloat x
                            ++ ", "
                            ++ String.fromFloat y
                            ++ ")"
                        )
                    ]
                ]
    in
    div [ HA.style "margin-top" "50px" ]
        [ div
            [ HA.style "font-size" "28px"
            , HA.style "font-weight" "bold"
            ]
            [ Html.text title ]

        , svg
            [ Attr.viewBox "0 0 1300 850"
            , Attr.width "95vw"
            , Attr.height "80vh"
            ]
            [ Svg.style []
                [ Svg.text """
                    .point circle { stroke: #777; fill: white; }
                    .point text { display: none; font-size: 14px; }
                    .point:hover circle { fill: green; }
                    .point:hover text { display: block; }
                """ ]

            , g [ Attr.transform "translate(60,40)" ]
                ( lineElement
                    ++ List.map2 (\x y -> point ( x, y )) xData yData
                )

            , g [ Attr.transform "translate(60,790)" ]
                [ Axis.bottom [] xScale ]

            , g [ Attr.transform "translate(60,40)" ]
                [ Axis.left [] yScale ]

            , text_
                [ Attr.x "60"
                , Attr.y "30"
                , Attr.fontSize "18px"
                ]
                [ Svg.text yLabel ]
            ]

        , div
            [ HA.style "text-align" "center"
            , HA.style "font-size" "18px"
            ]
            [ Html.text xLabel ]
        ]


-- VIEW

view =
    div [ HA.style "font-family" "Arial" ]
        [ div
            [ HA.style "font-size" "34px"
            , HA.style "font-weight" "bold"
            ]
            [ Html.text "SUVs versus Minivans" ]

        , div []
            [ Html.text
                ("Number of filtered Cars: "
                    ++ String.fromInt (List.length validCars)
                )
            ]

        , div []
            [ Html.text
                ("Number of SUVs: "
                    ++ String.fromInt (List.length carsOfClass)
                )
            ]

        -- Q-Plot
        , plot "Q-Plot cityMPG for SUVs"
            quantilePositions
            sorted
            "f-Value cityMPG"
            "quantiles cityMPG"
            False

        -- Normal-QQ (μ,σ)
        , plot "Normal-QQ-Plot cityMPG for SUVs"
            normalQuantiles
            sorted
            "Normal quantiles (μ,σ)"
            "quantiles cityMPG SUVs"
            True

        -- Standardnormal QQ
        , plot "Normal-01-QQ-Plot cityMPG for SUVs"
            standardNormalQuantiles
            sorted
            "Standard normal quantiles"
            "quantiles cityMPG SUVs"
            True
        ]


main =
    view