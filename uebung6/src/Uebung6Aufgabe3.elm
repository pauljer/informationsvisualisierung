module Uebung6Aufgabe3 exposing (main)

import Axis
import Browser
import Cars exposing (Car, CarType(..), cars)
import Color
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events as HE
import Path
import Scale exposing (ContinuousScale)
import Shape
import TypedSvg exposing (g, svg, text_)
import TypedSvg.Attributes as TA exposing (transform, viewBox)
import TypedSvg.Attributes.InPx exposing (fontSize, strokeWidth, x, y)
import TypedSvg.Core exposing (Svg)
import TypedSvg.Types exposing (AnchorAlignment(..), Align(..), Paint(..), Scale(..), Transform(..), MeetOrSlice(..))



-- ============================================================
-- TYPEN
-- ============================================================


{-| FilteredCar enthält nur die für den Plot benötigten Felder
ohne Maybe — entsteht nach dem Filtern in `carsToFiltered`.
-}
type alias FilteredCar =
    { vehicleName : String
    , cityMPG : Int
    , retailPrice : Int
    , dealerCost : Int
    , carLen : Int
    }


type alias MultiDimPoint =
    { pointName : String, value : List Float }


type alias MultiDimData =
    { dimDescription : List String
    , data : List (List MultiDimPoint)
    }



-- ============================================================
-- FLEXIBLE DIMENSIONSREIHENFOLGE
-- ============================================================
--
-- Diese Liste legt Reihenfolge UND Auswahl der Dimensionen fest.
-- Jeder Eintrag = (Beschriftung, Zugriffsfunktion auf FilteredCar).
-- Die Reihenfolge wird zur Laufzeit über die up/down-Buttons
-- verändert; siehe `update` und `swapAt`.


type alias Dimension =
    ( String, FilteredCar -> Float )


initialDimensions : List Dimension
initialDimensions =
    [ ( "cityMPG", .cityMPG >> toFloat )
    , ( "retailPrice", .retailPrice >> toFloat )
    , ( "dealerCost", .dealerCost >> toFloat )
    , ( "carLen", .carLen >> toFloat )
    ]



-- ============================================================
-- PLOT
-- ============================================================


padding : Float
padding =
    60


lineColor : Color.Color
lineColor =
    Color.rgba 0 0 0 0.8


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
                    g [ transform [ Translate xPos 0 ] ]
                        [ Axis.left [ Axis.tickCount 10 ] scaleY
                        , text_
                            [ x 0
                            , y -20
                            , TA.textAnchor AnchorMiddle
                            , fontSize 14
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
                            , strokeWidth 1
                            ]
                    )
    in
    svg
        [ viewBox 0 0 (w + 2 * padding) (h + 2 * padding)
        , TA.width (TypedSvg.Types.Percent 100)
        , TA.height (TypedSvg.Types.Percent 100)
        , TA.preserveAspectRatio (Align ScaleMin ScaleMin) Slice
        ]
        [ g [ transform [ Translate padding padding ] ]
            (axesNodes ++ lineNodes)
        ]



-- ============================================================
-- DATENVERARBEITUNG
-- ============================================================


carsToFiltered : List Car -> List FilteredCar
carsToFiltered list =
    list
        |> List.filter (\c -> c.carType == SUV)
        |> List.filterMap
            (\c ->
                Maybe.map4
                    (\city ret deal len ->
                        { vehicleName = c.vehicleName
                        , cityMPG = city
                        , retailPrice = ret
                        , dealerCost = deal
                        , carLen = len
                        }
                    )
                    c.cityMPG
                    c.retailPrice
                    c.dealerCost
                    c.carLen
            )


{-| Wendet die Liste der Zugriffsfunktionen aus `dimensions` per
`List.map` auf jeden FilteredCar an. Die Reihenfolge der Werte in
`value` entspricht damit automatisch der Reihenfolge in `dimensions`.
-}
filteredToMultiDimData : List Dimension -> List FilteredCar -> MultiDimData
filteredToMultiDimData dims filtered =
    let
        accessors =
            List.map Tuple.second dims

        labels =
            List.map Tuple.first dims

        toPoint c =
            { pointName = c.vehicleName
            , value = List.map (\f -> f c) accessors
            }
    in
    { dimDescription = labels
    , data = [ List.map toPoint filtered ]
    }



-- ============================================================
-- INTERAKTION: REIHENFOLGE ÄNDERN
-- ============================================================


type alias Model =
    { dimensions : List Dimension
    , filtered : List FilteredCar
    }


type Msg
    = MoveUp Int
    | MoveDown Int


init : () -> ( Model, Cmd Msg )
init _ =
    ( { dimensions = initialDimensions
      , filtered = carsToFiltered cars
      }
    , Cmd.none
    )


{-| Tauscht die Elemente an Position i und j in einer Liste. -}
swapAt : Int -> Int -> List a -> List a
swapAt i j list =
    let
        elemAt k =
            List.drop k list |> List.head
    in
    case ( elemAt i, elemAt j ) of
        ( Just a, Just b ) ->
            List.indexedMap
                (\k x ->
                    if k == i then
                        b

                    else if k == j then
                        a

                    else
                        x
                )
                list

        _ ->
            list


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        MoveUp i ->
            if i <= 0 then
                ( model, Cmd.none )

            else
                ( { model | dimensions = swapAt (i - 1) i model.dimensions }, Cmd.none )

        MoveDown i ->
            if i >= List.length model.dimensions - 1 then
                ( model, Cmd.none )

            else
                ( { model | dimensions = swapAt i (i + 1) model.dimensions }, Cmd.none )


view : Model -> Html Msg
view model =
    let
        mdData =
            filteredToMultiDimData model.dimensions model.filtered

        dimItem idx ( name, _ ) =
            Html.li []
                [ Html.text name
                , Html.text " "
                , Html.button [ HE.onClick (MoveUp idx) ] [ Html.text "up" ]
                , Html.text " "
                , Html.button [ HE.onClick (MoveDown idx) ] [ Html.text "down" ]
                ]
    in
    Html.div
        [ HA.style "font-family" "sans-serif"
        , HA.style "padding" "16px"
        ]
        [ Html.h2 [] [ Html.text "SUVs" ]
        , Html.ul []
            (Html.li []
                [ Html.text ("Number of filtered Cars: " ++ String.fromInt (List.length model.filtered)) ]
                :: List.indexedMap dimItem model.dimensions
            )
        , Html.div
            [ HA.style "border" "1px solid black"
            , HA.style "margin-top" "20px"
            ]
            [ parallelCoodinatesPlot 1000 2 mdData ]
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
