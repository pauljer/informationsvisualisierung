module Uebung6Aufgabe2 exposing (main)

import Axis
import Cars exposing (Car, CarType(..), cars)
import Color
import Html exposing (Html)
import Html.Attributes as HA
import Path
import Scale exposing (ContinuousScale)
import Shape
import TypedSvg exposing (g, rect, svg, text_)
import TypedSvg.Attributes as TA exposing (transform, viewBox)
import TypedSvg.Attributes.InPx exposing (fontSize, height, strokeWidth, width, x, y)
import TypedSvg.Core exposing (Svg)
import TypedSvg.Types exposing (AnchorAlignment(..), Align(..), Paint(..), Transform(..), MeetOrSlice(..))


type alias MultiDimPoint =
    { pointName : String, value : List Float }


type alias MultiDimData =
    { dimDescription : List String
    , data : List (List MultiDimPoint)
    }


padding : Float
padding =
    60


-- X-Ray: weiße Linien mit Deckkraft 0.1
lineColor : Color.Color
lineColor =
    Color.rgba 1 1 1 0.1


-- Achsenbeschriftungen weiß, da Hintergrund schwarz
axisColor : Color.Color
axisColor =
    Color.white


parallelCoodinatesPlot : Float -> Float -> MultiDimData -> Svg msg
parallelCoodinatesPlot w ar model =
    let
        h =
            w / ar

        numDims =
            List.length model.dimDescription

        xScale =
            Scale.linear ( 0, w ) ( 1, toFloat numDims )

        allPoints =
            List.concat model.data

        getCol : Int -> List Float
        getCol i =
            List.filterMap (\p -> List.drop i p.value |> List.head) allPoints

        dimRanges : List ( Float, Float )
        dimRanges =
            List.range 0 (numDims - 1)
                |> List.map getCol
                |> List.map
                    (\col ->
                        case ( List.minimum col, List.maximum col ) of
                            ( Just mn, Just mx ) ->
                                ( mn, mx )

                            _ ->
                                ( 0, 1 )
                    )

        yScales : List (ContinuousScale Float)
        yScales =
            List.map (\( mn, mx ) -> Scale.linear ( h, 0 ) ( mn, mx )) dimRanges

        getYScale : Int -> ContinuousScale Float
        getYScale i =
            List.drop i yScales |> List.head |> Maybe.withDefault (Scale.linear ( h, 0 ) ( 0, 1 ))

        axesNodes =
            List.indexedMap
                (\idx desc ->
                    let
                        xPos =
                            Scale.convert xScale (toFloat (idx + 1))

                        scaleY =
                            getYScale idx
                    in
                    g
                        [ transform [ Translate xPos 0 ]
                        , TA.stroke (Paint axisColor)
                        , TA.fill (Paint axisColor)
                        ]
                        [ Axis.left [ Axis.tickCount 10 ] scaleY
                        , text_
                            [ x 0
                            , y -20
                            , TA.textAnchor AnchorMiddle
                            , fontSize 14
                            , TA.stroke PaintNone
                            , TA.fill (Paint axisColor)
                            ]
                            [ TypedSvg.Core.text desc ]
                        ]
                )
                model.dimDescription

        toLinePath : MultiDimPoint -> Path.Path
        toLinePath pt =
            List.indexedMap
                (\idx val ->
                    let
                        xPos =
                            Scale.convert xScale (toFloat (idx + 1))

                        scaleY =
                            getYScale idx

                        yPos =
                            Scale.convert scaleY val
                    in
                    Just ( xPos, yPos )
                )
                pt.value
                |> Shape.line Shape.linearCurve

        lineNodes =
            allPoints
                |> List.map
                    (\pt ->
                        Path.element (toLinePath pt)
                            [ TA.stroke (Paint lineColor)
                            , TA.fill PaintNone
                            , strokeWidth 2
                            ]
                    )

        background =
            rect
                [ x 0
                , y 0
                , width w
                , height h
                , TA.fill (Paint Color.black)
                ]
                []
    in
    svg
        [ viewBox 0 0 (w + 2 * padding) (h + 2 * padding)
        , TA.width (TypedSvg.Types.Percent 100)
        , TA.height (TypedSvg.Types.Percent 100)
        , TA.preserveAspectRatio (Align ScaleMin ScaleMin) Slice
        ]
        [ g [ transform [ Translate padding padding ] ]
            (background :: lineNodes ++ axesNodes)
        ]


filterCars : List Car -> List Car
filterCars list =
    list
        |> List.filter
            (\c ->
                c.carType
                    == SUV
                    && c.cityMPG
                    /= Nothing
                    && c.retailPrice
                    /= Nothing
                    && c.dealerCost
                    /= Nothing
                    && c.carLen
                    /= Nothing
            )


carsToMultiDimData : List Car -> MultiDimData
carsToMultiDimData list =
    let
        filtered =
            filterCars list

        points =
            filtered
                |> List.filterMap
                    (\c ->
                        Maybe.map4
                            (\city ret deal len ->
                                { pointName = c.vehicleName
                                , value = [ toFloat city, toFloat ret, toFloat deal, toFloat len ]
                                }
                            )
                            c.cityMPG
                            c.retailPrice
                            c.dealerCost
                            c.carLen
                    )
    in
    { dimDescription = [ "cityMPG", "retailPrice", "dealerCost", "carLen" ]
    , data = [ points ]
    }


main : Html msg
main =
    let
        filtered =
            filterCars cars

        mdData =
            carsToMultiDimData cars
    in
    Html.div
        [ HA.style "font-family" "sans-serif"
        , HA.style "padding" "16px"
        ]
        [ Html.h2 [] [ Html.text "SUVs (X-Ray)" ]
        , Html.ul []
            [ Html.li [] [ Html.text ("Number of filtered Cars: " ++ String.fromInt (List.length filtered)) ]
            ]
        , Html.div
            [ HA.style "border" "1px solid black"
            , HA.style "margin-top" "20px"
            , HA.style "background-color" "black"
            ]
            [ parallelCoodinatesPlot 1000 2 mdData ]
        ]
