module Uebung3aufgabe1 exposing (main)

import Html exposing (Html, div)
import Html.Attributes as HA
import Html as Html
import TypedSvg exposing (circle, g, svg, text_)
import TypedSvg.Attributes as Attr
import TypedSvg.Attributes.InPx exposing (cx, cy, r, width, height, x, y)
import TypedSvg.Core as SvgCore exposing (Svg)
import TypedSvg.Types exposing (Transform(..), AnchorAlignment(..))
import Scale
import Axis
import Cars exposing (cars, CarType(..))
import Cars


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


selectedClass : CarType
selectedClass =
    SUV


carsOfClass =
    List.filter (\c -> c.carType == selectedClass) validCars


cityValues : List Float
cityValues =
    carsOfClass
        |> List.filterMap (\c -> c.cityMPG |> Maybe.map toFloat)


sorted =
    List.sort cityValues


n =
    toFloat (List.length sorted)


quantilePoints : List ( Float, Float )
quantilePoints =
    List.indexedMap
        (\i yVal ->
            ( (toFloat i + 1) / n, yVal )
        )
        sorted


plot : Svg msg
plot =
    let
        xScale =
            Scale.linear ( 0, 1400 ) ( 0, 1 )

        yScale =
            Scale.linear ( 800, 0 ) ( 9, 24 )

        point ( xVal, yVal ) =
            let
                px =
                    Scale.convert xScale xVal

                py =
                    Scale.convert yScale yVal
            in
            g [ Attr.class [ "point" ] ]
                [ circle
                    [ cx px
                    , cy py
                    , r 6
                    ]
                    []
                , text_
                    [ x px
                    , y (py - 10)
                    , Attr.textAnchor AnchorMiddle
                    ]
                    [ SvgCore.text
                        ("("
                            ++ String.fromFloat xVal
                            ++ ", "
                            ++ String.fromFloat yVal
                            ++ ")"
                        )
                    ]
                ]
    in
    svg
        [ width 1600
        , height 900
        ]
        [ TypedSvg.style []
            [ SvgCore.text """
                .point circle {
                    stroke: #777;
                    fill: white;
                }
                .point text {
                    display: none;
                    font-size: 14px;
                }
                .point:hover circle {
                    fill: green;
                }
                .point:hover text {
                    display: block;
                }
            """ ]
        , text_
            [ x 80
            , y 30
            ]
            [ SvgCore.text "quantiles cityMPG" ]
        , text_
            [ x 800
            , y 880
            , Attr.textAnchor AnchorMiddle
            ]
            [ SvgCore.text "f-Value cityMPG" ]
        , g [ Attr.transform [ Translate 80 40 ] ]
            (List.map point quantilePoints)
        , g [ Attr.transform [ Translate 80 840 ] ]
            [ Axis.bottom [ Axis.tickCount 5 ] xScale ]
        , g [ Attr.transform [ Translate 80 40 ] ]
            [ Axis.left [ Axis.tickCount 6 ] yScale ]
        ]


view : Html msg
view =
    div [ HA.style "font-family" "Arial" ]
        [ div
            [ HA.style "font-size" "30px"
            , HA.style "font-weight" "bold"
            ]
            [ Html.text
                ("Q-Plot cityMPG for "
                    ++ Cars.carTypeToString selectedClass
                )
            ]
        , div []
            [ Html.text
                ("Anzahl Autos: "
                    ++ String.fromInt (List.length carsOfClass)
                )
            ]
        , plot
        ]


main : Html msg
main =
    view