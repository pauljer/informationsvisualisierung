module Uebung8Aufgabe3 exposing (main)

import Axis
import Browser
import Cars exposing (Car, CarType(..), WheelDrive(..), cars)
import Color exposing (Color)
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events as HE
import Scale exposing (ContinuousScale)
import TypedSvg exposing (circle, g, line, polygon, svg, text_)
import TypedSvg.Attributes as TA exposing (points, transform, viewBox)
import TypedSvg.Attributes.InPx exposing (fontSize, strokeWidth, x, x1, x2, y, y1, y2)
import TypedSvg.Core exposing (Svg)
import TypedSvg.Types exposing (AnchorAlignment(..), Paint(..), StrokeLinecap(..), Transform(..))



-- ============================================================
-- AUFGABE 8.3 — Star Plot (Radar Chart) Icons im Scatterplot
-- ============================================================
--
-- Es werden alle 11 numerischen Attribute eines Autos als Achsen
-- eines Sterns angeordnet (gleichmäßig auf 360°). Der Wert auf
-- jeder Achse wird linear auf [0,1] normiert (über alle gefilterten
-- Autos); die Punkte werden zu einem geschlossenen Polygon
-- verbunden. Dieses Polygon wird als Icon an die Position
-- (xAttr, yAttr) des Scatterplots aus 8.1 gezeichnet.
-- ============================================================


type alias FilteredCar =
    { vehicleName : String
    , carType : CarType
    , wheelDrive : WheelDrive
    , retailPrice : Float
    , dealerCost : Float
    , engineSize : Float
    , cyl : Float
    , hp : Float
    , cityMPG : Float
    , hwyMPG : Float
    , weight : Float
    , wheelBase : Float
    , carLen : Float
    , carWidth : Float
    }


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
        |> andMap (Just c.carType)
        |> andMap (Just c.wheelDrive)
        |> andMap (Maybe.map toFloat c.retailPrice)
        |> andMap (Maybe.map toFloat c.dealerCost)
        |> andMap c.engineSize
        |> andMap c.cyl
        |> andMap (Maybe.map toFloat c.hp)
        |> andMap (Maybe.map toFloat c.cityMPG)
        |> andMap (Maybe.map toFloat c.hwyMPG)
        |> andMap (Maybe.map toFloat c.weight)
        |> andMap (Maybe.map toFloat c.wheelBase)
        |> andMap (Maybe.map toFloat c.carLen)
        |> andMap (Maybe.map toFloat c.carWidth)


filteredCars : List FilteredCar
filteredCars =
    List.filterMap toFilteredCar cars



-- SCATTERPLOT-ATTRIBUTE (Dropdowns, wie in 8.1)


type alias Attribute =
    { name : String, get : FilteredCar -> Float }


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



-- STAR PLOT: 11 Achsen ---------------------------------------------


axisSpecs : List ( String, FilteredCar -> Float )
axisSpecs =
    [ ( "retailPrice", .retailPrice )
    , ( "dealerCost", .dealerCost )
    , ( "engineSize", .engineSize )
    , ( "cyl", .cyl )
    , ( "hp", .hp )
    , ( "cityMPG", .cityMPG )
    , ( "hwyMPG", .hwyMPG )
    , ( "weight", .weight )
    , ( "wheelBase", .wheelBase )
    , ( "carLen", .carLen )
    , ( "carWidth", .carWidth )
    ]


numAxes : Int
numAxes =
    List.length axisSpecs


{-| Math-Winkel der i-ten Achse: 0. Achse zeigt nach oben (90°),
weitere Achsen folgen im Uhrzeigersinn.
-}
axisAngle : Int -> Float
axisAngle i =
    pi / 2 - 2 * pi * toFloat i / toFloat numAxes



-- Normalisierung pro Achse auf [0,1] über alle filteredCars


attrExtent : (FilteredCar -> Float) -> ( Float, Float )
attrExtent get =
    let
        values =
            List.map get filteredCars

        lo =
            Maybe.withDefault 0 (List.minimum values)

        hi =
            Maybe.withDefault 1 (List.maximum values)
    in
    if hi <= lo then
        ( lo, lo + 1 )

    else
        ( lo, hi )


normalize : (FilteredCar -> Float) -> Float -> Float
normalize get v =
    let
        ( lo, hi ) =
            attrExtent get
    in
    (v - lo) / (hi - lo)


{-| Liefert die Polygon-Eckpunkte des Star-Plots für ein Auto,
zentriert auf (cx, cy) mit Radius s (s entspricht n=1.0).
SVG-y zeigt nach unten -> sin(a) wird abgezogen.
-}
starPoints : Float -> Float -> Float -> FilteredCar -> List ( Float, Float )
starPoints centerX centerY s car =
    List.indexedMap
        (\i ( _, get ) ->
            let
                n =
                    normalize get (get car)

                a =
                    axisAngle i
            in
            ( centerX + s * n * cos a
            , centerY - s * n * sin a
            )
        )
        axisSpecs


starIcon : Float -> Float -> Float -> Float -> Color -> FilteredCar -> Svg msg
starIcon centerX centerY s sw color car =
    polygon
        [ points (starPoints centerX centerY s car)
        , TA.stroke (Paint color)
        , strokeWidth sw
        , TA.fill (Paint (withAlpha 0.28 color))
        , TA.strokeLinecap StrokeLinecapRound
        ]
        []


withAlpha : Float -> Color -> Color
withAlpha a c =
    let
        { red, green, blue } =
            Color.toRgba c
    in
    Color.rgba red green blue a



-- CARTYPE -> FARBE


carTypeColor : CarType -> Color
carTypeColor ct =
    case ct of
        Small_Sporty_Compact_Large_Sedan ->
            Color.rgb 0.20 0.45 0.85

        Sports_Car ->
            Color.rgb 0.85 0.20 0.20

        SUV ->
            Color.rgb 0.30 0.65 0.35

        Wagon ->
            Color.rgb 0.80 0.55 0.10

        Minivan ->
            Color.rgb 0.55 0.35 0.75

        Pickup ->
            Color.rgb 0.40 0.30 0.20


carTypeName : CarType -> String
carTypeName ct =
    case ct of
        Small_Sporty_Compact_Large_Sedan ->
            "Sedan/Kompakt"

        Sports_Car ->
            "Sportwagen"

        SUV ->
            "SUV"

        Wagon ->
            "Kombi"

        Minivan ->
            "Minivan"

        Pickup ->
            "Pickup"



-- MODEL / UPDATE


type alias Model =
    { xAttr : String
    , yAttr : String
    , iconSize : Float
    }


type Msg
    = SelectX String
    | SelectY String
    | SetIconSize String


init : () -> ( Model, Cmd Msg )
init _ =
    ( { xAttr = "cityMPG", yAttr = "retailPrice", iconSize = 8 }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SelectX name ->
            ( { model | xAttr = name }, Cmd.none )

        SelectY name ->
            ( { model | yAttr = name }, Cmd.none )

        SetIconSize s ->
            ( { model | iconSize = Maybe.withDefault model.iconSize (String.toFloat s) }
            , Cmd.none
            )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- LEGENDE: großer Star Plot für das erste Auto ---------------------


legendCar : Maybe FilteredCar
legendCar =
    List.head filteredCars


legendSize : Float
legendSize =
    150


legendCanvasW : Float
legendCanvasW =
    560


legendCanvasH : Float
legendCanvasH =
    440


fmtValue : Float -> String
fmtValue v =
    let
        rounded =
            toFloat (round (v * 100)) / 100
    in
    if rounded == toFloat (round rounded) then
        String.fromInt (round rounded)

    else
        String.fromFloat rounded


legendView : Html msg
legendView =
    case legendCar of
        Nothing ->
            Html.text ""

        Just car ->
            let
                cx0 =
                    230

                cy0 =
                    220

                color =
                    carTypeColor car.carType

                axisLines =
                    List.indexedMap (axisLine cx0 cy0 legendSize) axisSpecs

                gridRings =
                    List.map (gridCircle cx0 cy0 legendSize) [ 0.25, 0.5, 0.75, 1.0 ]

                axisLabels =
                    List.indexedMap (axisLabel cx0 cy0 legendSize car) axisSpecs

                iconSvg =
                    starIcon cx0 cy0 legendSize 2.4 color car

                vertexDots =
                    List.map (\( px, py ) -> vertexDot px py color)
                        (starPoints cx0 cy0 legendSize car)

                figureSvg =
                    svg
                        [ viewBox 0 0 legendCanvasW legendCanvasH
                        , TA.width (TypedSvg.Types.px legendCanvasW)
                        , TA.height (TypedSvg.Types.px legendCanvasH)
                        ]
                        (gridRings ++ axisLines ++ [ iconSvg ] ++ vertexDots ++ axisLabels)
            in
            Html.div
                [ HA.style "display" "flex"
                , HA.style "gap" "24px"
                , HA.style "align-items" "flex-start"
                , HA.style "margin-bottom" "24px"
                , HA.style "flex-wrap" "wrap"
                ]
                [ Html.div []
                    [ Html.h3 [] [ Html.text ("Legenden-Star-Plot — " ++ car.vehicleName) ]
                    , Html.p [ HA.style "margin" "0 0 8px 0", HA.style "max-width" "500px" ]
                        [ Html.text
                            ("Typ: "
                                ++ carTypeName car.carType
                                ++ ". Die "
                                ++ String.fromInt numAxes
                                ++ " Achsen sind gleichmäßig auf 360° verteilt (Δ ≈ "
                                ++ fmtValue (360 / toFloat numAxes)
                                ++ "°). Jeder Achswert ist linear auf [0,1] normiert; konzentrische Hilfskreise bei 0,25 / 0,5 / 0,75 / 1,0."
                            )
                        ]
                    , figureSvg
                    ]
                , legendTable car
                ]


axisLine : Float -> Float -> Float -> Int -> ( String, FilteredCar -> Float ) -> Svg msg
axisLine centerX centerY s i _ =
    let
        a =
            axisAngle i
    in
    line
        [ x1 centerX
        , y1 centerY
        , x2 (centerX + s * cos a)
        , y2 (centerY - s * sin a)
        , TA.stroke (Paint (Color.rgb 0.75 0.75 0.75))
        , strokeWidth 0.8
        ]
        []


gridCircle : Float -> Float -> Float -> Float -> Svg msg
gridCircle centerX centerY s frac =
    circle
        [ TypedSvg.Attributes.InPx.cx centerX
        , TypedSvg.Attributes.InPx.cy centerY
        , TypedSvg.Attributes.InPx.r (s * frac)
        , TA.fill (Paint (Color.rgba 0 0 0 0))
        , TA.stroke (Paint (Color.rgb 0.88 0.88 0.88))
        , strokeWidth 0.6
        ]
        []


vertexDot : Float -> Float -> Color -> Svg msg
vertexDot px py color =
    circle
        [ TypedSvg.Attributes.InPx.cx px
        , TypedSvg.Attributes.InPx.cy py
        , TypedSvg.Attributes.InPx.r 2.5
        , TA.fill (Paint color)
        ]
        []


axisLabel : Float -> Float -> Float -> FilteredCar -> Int -> ( String, FilteredCar -> Float ) -> Svg msg
axisLabel centerX centerY s car i ( name, get ) =
    let
        a =
            axisAngle i

        rLabel =
            s + 14

        lx =
            centerX + rLabel * cos a

        ly =
            centerY - rLabel * sin a

        anchor =
            if cos a > 0.2 then
                AnchorStart

            else if cos a < -0.2 then
                AnchorEnd

            else
                AnchorMiddle
    in
    text_
        [ x lx
        , y ly
        , fontSize 11
        , TA.textAnchor anchor
        ]
        [ TypedSvg.Core.text (name ++ " = " ++ fmtValue (get car)) ]


legendTable : FilteredCar -> Html msg
legendTable car =
    Html.div []
        [ Html.h3 [] [ Html.text "Achse → Wert" ]
        , Html.table
            [ HA.style "border-collapse" "collapse"
            , HA.style "font-size" "13px"
            ]
            (legendHeader :: List.indexedMap (legendRow car) axisSpecs)
        ]


legendHeader : Html msg
legendHeader =
    Html.tr []
        [ th "Achse"
        , th "Attribut"
        , th "Wert"
        , th "Winkel"
        , th "norm."
        ]


th : String -> Html msg
th s =
    Html.th
        [ HA.style "border-bottom" "1px solid #888"
        , HA.style "padding" "4px 10px"
        , HA.style "text-align" "left"
        ]
        [ Html.text s ]


td : String -> Html msg
td s =
    Html.td
        [ HA.style "padding" "3px 10px"
        , HA.style "border-bottom" "1px solid #eee"
        ]
        [ Html.text s ]


legendRow : FilteredCar -> Int -> ( String, FilteredCar -> Float ) -> Html msg
legendRow car i ( name, get ) =
    let
        deg =
            axisAngle i * 180 / pi

        n =
            normalize get (get car)
    in
    Html.tr []
        [ td (String.fromInt (i + 1))
        , td name
        , td (fmtValue (get car))
        , td (fmtValue deg ++ "°")
        , td (fmtValue (toFloat (round (n * 100)) / 100))
        ]



-- SCATTERPLOT mit Star-Plot-Icons statt Kreisen --------------------


padding : Float
padding =
    60


plotW : Float
plotW =
    980


plotH : Float
plotH =
    640


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

        s =
            model.iconSize

        sw =
            max 0.4 (s * 0.12)

        icon : FilteredCar -> Svg msg
        icon c =
            starIcon
                (Scale.convert xScale (xA.get c))
                (Scale.convert yScale (yA.get c))
                s
                sw
                (carTypeColor c.carType)
                c
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
            (List.map icon filteredCars)
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



-- VIEW


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


carTypeLegend : Html msg
carTypeLegend =
    let
        item ct =
            Html.span
                [ HA.style "display" "inline-flex"
                , HA.style "align-items" "center"
                , HA.style "gap" "6px"
                , HA.style "margin-right" "14px"
                ]
                [ Html.span
                    [ HA.style "display" "inline-block"
                    , HA.style "width" "12px"
                    , HA.style "height" "12px"
                    , HA.style "background" (colorToCss (carTypeColor ct))
                    ]
                    []
                , Html.text (carTypeName ct)
                ]
    in
    Html.div [ HA.style "margin" "8px 0", HA.style "font-size" "13px" ]
        (List.map item
            [ Small_Sporty_Compact_Large_Sedan
            , Sports_Car
            , SUV
            , Wagon
            , Minivan
            , Pickup
            ]
        )


colorToCss : Color -> String
colorToCss c =
    let
        { red, green, blue } =
            Color.toRgba c

        to255 v =
            String.fromInt (round (v * 255))
    in
    "rgb(" ++ to255 red ++ "," ++ to255 green ++ "," ++ to255 blue ++ ")"


view : Model -> Html Msg
view model =
    Html.div
        [ HA.style "font-family" "sans-serif"
        , HA.style "padding" "12px"
        ]
        [ Html.h2 [] [ Html.text "Aufgabe 8.3 — Star Plot Icons" ]
        , Html.p [ HA.style "max-width" "880px" ]
            [ Html.text
                ("Es werden "
                    ++ String.fromInt (List.length filteredCars)
                    ++ " Autos angezeigt (alle Autos ohne Wert in einem der 11 numerischen Attribute wurden entfernt)."
                )
            ]
        , legendView
        , Html.hr [] []
        , Html.h3 [] [ Html.text "Scatterplot mit Star-Plot-Icons statt Kreisen" ]
        , carTypeLegend
        , Html.div
            [ HA.style "display" "flex"
            , HA.style "gap" "24px"
            , HA.style "align-items" "center"
            , HA.style "margin-bottom" "12px"
            , HA.style "flex-wrap" "wrap"
            ]
            [ Html.label []
                [ Html.text "X-Achse: "
                , attributeSelect SelectX model.xAttr
                ]
            , Html.label []
                [ Html.text "Y-Achse: "
                , attributeSelect SelectY model.yAttr
                ]
            , Html.label []
                [ Html.text ("Icon-Größe: " ++ fmtValue model.iconSize ++ " px  ")
                , Html.input
                    [ HA.type_ "range"
                    , HA.min "3"
                    , HA.max "30"
                    , HA.step "0.5"
                    , HA.value (String.fromFloat model.iconSize)
                    , HE.onInput SetIconSize
                    , HA.style "width" "220px"
                    , HA.style "vertical-align" "middle"
                    ]
                    []
                ]
            ]
        , scatterplot model
        ]



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }
