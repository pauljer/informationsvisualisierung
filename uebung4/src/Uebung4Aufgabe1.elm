module Uebung4Aufgabe1 exposing (main)

import Html exposing (Html, div)
import Html.Attributes as HA
import Svg exposing (Svg, svg, g, circle)
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


normalQuantiles =
    List.map (\f -> mu + sigma * invNormalCdf f) quantilePositions


standardNormalQuantiles =
    List.map invNormalCdf quantilePositions


-- PLOT

plot title xData yData xLabel yLabel =
    let
        xMin =
            List.minimum xData |> Maybe.withDefault 0

        xMax =
            List.maximum xData |> Maybe.withDefault 1

        yMin =
            List.minimum yData |> Maybe.withDefault 0

        yMax =
            List.maximum yData |> Maybe.withDefault 1

        xScale =
            Scale.linear ( 0, 1200 )
                ( xMin - 0.05, xMax + 0.05 )

        yScale =
            Scale.linear ( 750, 0 )
                ( yMin - 0.5, yMax + 0.5 )

        point ( x, y ) =
            let
                px =
                    Scale.convert xScale x

                py =
                    Scale.convert yScale y
            in
            g [ Attr.class "point" ]
                [ circle
                    [ Attr.cx (String.fromFloat px)
                    , Attr.cy (String.fromFloat py)
                    , Attr.r "6"
                    ]
                    []
                , Svg.text_
                    [ Attr.x (String.fromFloat px)
                    , Attr.y (String.fromFloat (py - 10))
                    , Attr.textAnchor "middle"
                    , Attr.fontSize "12px"
                    ]
                    [ Svg.text ("(" ++String.fromFloat x ++ ", " ++ String.fromFloat y ++ "") ]
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
            ([ Svg.style []
                [ Svg.text """
                    .point circle {
                        stroke: rgba(0,0,0,0.4);
                        fill: rgba(255,255,255,0.3);
                    }

                    .point text {
                        display: none;
                    }

                    .point:hover circle {
                        fill: rgb(118,214,78);
                        stroke: black;
                    }

                    .point:hover text {
                        display: inline;
                    }
                """ ]
             ]

                ++ [ g [ Attr.transform "translate(60,40)" ]
                        (List.map2 (\x y -> point ( x, y )) xData yData)

                   , g [ Attr.transform "translate(60,790)" ]
                        [ Axis.bottom [] xScale ]

                   , g [ Attr.transform "translate(60,40)" ]
                        [ Axis.left [] yScale ]

                   , Svg.text_
                        [ Attr.x "60"
                        , Attr.y "30"
                        , Attr.fontSize "18px"
                        ]
                        [ Svg.text yLabel ]
                   ]
            )

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

        , plot "Q-Plot cityMPG for SUVs"
            quantilePositions
            sorted
            "f-Value cityMPG"
            "quantiles cityMPG"

        , plot "Normal-QQ-Plot cityMPG for SUVs"
            normalQuantiles
            sorted
            "Normal quantiles"
            "quantiles cityMPG SUVs"

        , plot "Normal-01-QQ-Plot cityMPG for SUVs"
            standardNormalQuantiles
            sorted
            "Normal quantiles"
            "quantiles cityMPG SUVs"
        ]


main =
    view