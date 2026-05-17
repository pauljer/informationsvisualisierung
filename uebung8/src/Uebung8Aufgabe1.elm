module Uebung8Aufgabe1 exposing (main)

import Axis
import Browser
import Cars exposing (Car, cars)
import Color
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events as HE
import Scale exposing (ContinuousScale)
import TypedSvg exposing (circle, g, svg, text_)
import TypedSvg.Attributes as TA exposing (transform, viewBox)
import TypedSvg.Attributes.InPx exposing (cx, cy, fontSize, r, x, y)
import TypedSvg.Core exposing (Svg)
import TypedSvg.Types exposing (AnchorAlignment(..), Paint(..), Transform(..))



-- ============================================================
-- TYPEN
-- ============================================================


{-| Nach dem Wegfiltern aller Autos, denen mindestens eines der
sieben benötigten Attribute fehlt, sind alle Felder ohne Maybe.
-}
type alias FilteredCar =
    { vehicleName : String
    , cityMPG : Float
    , retailPrice : Float
    , dealerCost : Float
    , carLen : Float
    , weight : Float
    , carWidth : Float
    , engineSize : Float
    }


type alias Attribute =
    { name : String
    , get : FilteredCar -> Float
    }


attributes : List Attribute
attributes =
    [ Attribute "cityMPG" .cityMPG
    , Attribute "retailPrice" .retailPrice
    , Attribute "dealerCost" .dealerCost
    , Attribute "carLen" .carLen
    , Attribute "weight" .weight
    , Attribute "carWidth" .carWidth
    , Attribute "engineSize" .engineSize
    ]


findAttribute : String -> Attribute
findAttribute name =
    attributes
        |> List.filter (\a -> a.name == name)
        |> List.head
        |> Maybe.withDefault (Attribute "cityMPG" .cityMPG)



-- ============================================================
-- DATEN-FILTER
-- ============================================================


andMap : Maybe a -> Maybe (a -> b) -> Maybe b
andMap ma mf =
    case ( mf, ma ) of
        ( Just f, Just a ) ->
            Just (f a)

        _ ->
            Nothing


toFilteredCar : Car -> Maybe FilteredCar
toFilteredCar c =
    Just FilteredCar
        |> andMap (Just c.vehicleName)
        |> andMap (Maybe.map toFloat c.cityMPG)
        |> andMap (Maybe.map toFloat c.retailPrice)
        |> andMap (Maybe.map toFloat c.dealerCost)
        |> andMap (Maybe.map toFloat c.carLen)
        |> andMap (Maybe.map toFloat c.weight)
        |> andMap (Maybe.map toFloat c.carWidth)
        |> andMap c.engineSize


filteredCars : List FilteredCar
filteredCars =
    List.filterMap toFilteredCar cars



-- ============================================================
-- MODEL / UPDATE
-- ============================================================


type alias Model =
    { xAttr : String
    , yAttr : String
    }


type Msg
    = SelectX String
    | SelectY String


init : () -> ( Model, Cmd Msg )
init _ =
    ( { xAttr = "cityMPG", yAttr = "retailPrice" }, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SelectX name ->
            ( { model | xAttr = name }, Cmd.none )

        SelectY name ->
            ( { model | yAttr = name }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- ============================================================
-- PLOT
-- ============================================================


padding : Float
padding =
    60


plotW : Float
plotW =
    900


plotH : Float
plotH =
    600


niceExtent : (FilteredCar -> Float) -> ( Float, Float )
niceExtent get =
    let
        values =
            List.map get filteredCars

        lo =
            List.minimum values |> Maybe.withDefault 0

        hi =
            List.maximum values |> Maybe.withDefault 1

        pad =
            max 1 ((hi - lo) * 0.05)
    in
    ( lo - pad, hi + pad )


scatterplot : Model -> Svg Msg
scatterplot model =
    let
        xA =
            findAttribute model.xAttr

        yA =
            findAttribute model.yAttr

        xScale : ContinuousScale Float
        xScale =
            Scale.linear ( 0, plotW - 2 * padding ) (niceExtent xA.get)

        yScale : ContinuousScale Float
        yScale =
            Scale.linear ( plotH - 2 * padding, 0 ) (niceExtent yA.get)

        point : FilteredCar -> Svg msg
        point c =
            circle
                [ cx (Scale.convert xScale (xA.get c))
                , cy (Scale.convert yScale (yA.get c))
                , r 3.5
                , TA.fill (Paint (Color.rgba 0.2 0.45 0.85 0.55))
                , TA.stroke (Paint (Color.rgba 0.1 0.2 0.5 0.9))
                , TypedSvg.Attributes.InPx.strokeWidth 0.6
                ]
                []
    in
    svg
        [ viewBox 0 0 plotW plotH
        , TA.width (TypedSvg.Types.Percent 100)
        , TA.height (TypedSvg.Types.px plotH)
        ]
        [ g [ transform [ Translate padding (plotH - padding) ] ]
            [ Axis.bottom [ Axis.tickCount 10 ] xScale ]
        , g [ transform [ Translate padding padding ] ]
            [ Axis.left [ Axis.tickCount 10 ] yScale ]
        , g [ transform [ Translate padding padding ] ]
            (List.map point filteredCars)
        , text_
            [ x (plotW / 2)
            , y (plotH - 10)
            , TA.textAnchor AnchorMiddle
            , fontSize 14
            ]
            [ TypedSvg.Core.text xA.name ]
        , text_
            [ x 15
            , y (plotH / 2)
            , TA.textAnchor AnchorMiddle
            , fontSize 14
            , transform [ Rotate -90 15 (plotH / 2) ]
            ]
            [ TypedSvg.Core.text yA.name ]
        ]



-- ============================================================
-- VIEW
-- ============================================================


attributeSelect : (String -> Msg) -> String -> Html Msg
attributeSelect toMsg current =
    Html.select
        [ HE.onInput toMsg ]
        (List.map
            (\a ->
                Html.option
                    [ HA.value a.name, HA.selected (a.name == current) ]
                    [ Html.text a.name ]
            )
            attributes
        )


view : Model -> Html Msg
view model =
    Html.div
        [ HA.style "font-family" "sans-serif"
        , HA.style "padding" "12px"
        ]
        [ Html.h2 [] [ Html.text "Aufgabe 8.1 – Scatterplot" ]
        , Html.p []
            [ Html.text
                ("Es werden "
                    ++ String.fromInt (List.length filteredCars)
                    ++ " Autos angezeigt (alle Autos ohne Wert in einem der sieben Attribute wurden entfernt)."
                )
            ]
        , Html.div
            [ HA.style "display" "flex"
            , HA.style "gap" "24px"
            , HA.style "margin-bottom" "12px"
            ]
            [ Html.label []
                [ Html.text "X-Achse: "
                , attributeSelect SelectX model.xAttr
                ]
            , Html.label []
                [ Html.text "Y-Achse: "
                , attributeSelect SelectY model.yAttr
                ]
            ]
        , scatterplot model
        ]



-- ============================================================
-- MAIN
-- ============================================================


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }
