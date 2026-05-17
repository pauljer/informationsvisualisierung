module Uebung8Aufgabe2 exposing (main)

import Axis
import Browser
import Cars exposing (Car, CarType(..), WheelDrive(..), cars)
import Color exposing (Color)
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events as HE
import Scale exposing (ContinuousScale)
import TypedSvg exposing (g, line, svg, text_)
import TypedSvg.Attributes as TA exposing (transform, viewBox)
import TypedSvg.Attributes.InPx exposing (fontSize, strokeWidth, x, x1, x2, y, y1, y2)
import TypedSvg.Core exposing (Svg)
import TypedSvg.Types exposing (AnchorAlignment(..), Paint(..), StrokeLinecap(..), Transform(..))



-- ============================================================
-- AUFGABE 8.2 — Stick Figure nach Pickett & Grinstein (1988)
-- ============================================================
--
-- Es werden 11 numerische Attribute genutzt und jeweils auf den
-- Winkel eines Liniensegments einer Stick Figure abgebildet.
-- Die Figur besteht aus einem vertikalen Rumpf und drei "Hubs"
-- (oben / Mitte / unten), an denen die Limbs befestigt sind.
-- Jeder Limb hat einen festen Basis-Winkel und einen erlaubten
-- Winkel-Bereich; der konkrete Winkel = Basis ± (range * 2 * (n-0.5))
-- mit n = lineare Normalisierung des Attributwerts auf [0,1] über
-- alle gefilterten Autos.
--
-- Zusätzlich:
--   * carType -> Farbe der Figur
--   * Legenden-Figur (groß) für das erste Auto inkl. Tabelle
--     (Wert, Basis-Winkel, Winkel-Bereich)
--   * Scatterplot aus 8.1, aber die Punkte sind Mini-Stick-Figures
--     deren Größe per Slider eingestellt werden kann.
-- ============================================================
--
-- FILTERED CAR ----------------------------------------------------
--   alle 11 numerischen Attribute (Float) + 3 Meta-Felder
--   Autos ohne Wert in irgendeinem dieser Felder werden verworfen.


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



-- SCATTERPLOT-ATTRIBUTE (Dropdowns, 7 Stück) ---------------------


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



-- STICK FIGURE: 3 Hubs + 11 Limbs --------------------------------


type Hub
    = HubTop
    | HubCenter
    | HubBottom


type alias LimbSpec =
    { label : String
    , hub : Hub
    , baseAngleDeg : Float
    , rangeDeg : Float
    , getter : FilteredCar -> Float
    }


limbSpecs : List LimbSpec
limbSpecs =
    [ -- Kopf (genau senkrecht nach oben, kleiner Schwenk):
      LimbSpec "wheelBase" HubTop 90 30 .wheelBase

    -- vier "Arme" oben links/rechts:
    , LimbSpec "retailPrice" HubTop 135 25 .retailPrice
    , LimbSpec "dealerCost" HubTop 160 15 .dealerCost
    , LimbSpec "engineSize" HubTop 45 25 .engineSize
    , LimbSpec "cyl" HubTop 20 15 .cyl

    -- zwei horizontale Limbs in der Mitte:
    , LimbSpec "hp" HubCenter 180 30 .hp
    , LimbSpec "cityMPG" HubCenter 0 30 .cityMPG

    -- vier "Beine" unten links/rechts:
    , LimbSpec "hwyMPG" HubBottom 225 25 .hwyMPG
    , LimbSpec "weight" HubBottom 200 15 .weight
    , LimbSpec "carLen" HubBottom 315 25 .carLen
    , LimbSpec "carWidth" HubBottom 340 15 .carWidth
    ]



-- Normalisierung der Attributwerte auf [0,1] über alle filteredCars


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


limbAngleRad : LimbSpec -> FilteredCar -> Float
limbAngleRad spec car =
    let
        n =
            normalize spec.getter (spec.getter car)

        base =
            degrees spec.baseAngleDeg

        range =
            degrees spec.rangeDeg
    in
    base + (n - 0.5) * 2 * range


hubOffset : Hub -> ( Float, Float )
hubOffset hub =
    case hub of
        HubTop ->
            ( 0, -1 )

        HubCenter ->
            ( 0, 0 )

        HubBottom ->
            ( 0, 1 )



-- RENDERING ------------------------------------------------------
--
-- Lokales Koordinatensystem: Rumpf reicht von (0, -1) bis (0, +1).
-- s ist die "halbe Rumpflänge" in Pixeln; die Figur ist also rund
-- 4*s breit/hoch (Limbs gehen ein s über den Rumpf hinaus).
-- SVG-y zeigt nach unten, deshalb wird in der Endpunkt-Berechnung
-- sin(a) abgezogen, damit Winkel 90° wie gewohnt "nach oben" zeigt.


stickFigureLines : Float -> Float -> Float -> Float -> Color -> FilteredCar -> List (Svg msg)
stickFigureLines centerX centerY s sw color car =
    let
        toWorld : ( Float, Float ) -> ( Float, Float )
        toWorld ( lx, ly ) =
            ( centerX + s * lx, centerY + s * ly )

        bodyTop =
            toWorld ( 0, -1 )

        bodyBot =
            toWorld ( 0, 1 )

        bodyLine =
            mkLine bodyTop bodyBot sw color

        limbLine spec =
            let
                ( ox, oy ) =
                    hubOffset spec.hub

                a =
                    limbAngleRad spec car

                endLocal =
                    ( ox + cos a, oy - sin a )
            in
            mkLine (toWorld ( ox, oy )) (toWorld endLocal) sw color
    in
    bodyLine :: List.map limbLine limbSpecs


mkLine : ( Float, Float ) -> ( Float, Float ) -> Float -> Color -> Svg msg
mkLine ( ax, ay ) ( bx, by ) sw color =
    line
        [ x1 ax
        , y1 ay
        , x2 bx
        , y2 by
        , TA.stroke (Paint color)
        , strokeWidth sw
        , TA.strokeLinecap StrokeLinecapRound
        ]
        []



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



-- MODEL / UPDATE -------------------------------------------------


type alias Model =
    { xAttr : String
    , yAttr : String
    , stickSize : Float
    }


type Msg
    = SelectX String
    | SelectY String
    | SetStickSize String


init : () -> ( Model, Cmd Msg )
init _ =
    ( { xAttr = "cityMPG", yAttr = "retailPrice", stickSize = 6 }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SelectX name ->
            ( { model | xAttr = name }, Cmd.none )

        SelectY name ->
            ( { model | yAttr = name }, Cmd.none )

        SetStickSize s ->
            ( { model | stickSize = Maybe.withDefault model.stickSize (String.toFloat s) }
            , Cmd.none
            )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- LEGENDE: große Stick Figure + Tabelle für das erste Auto -------


legendCar : Maybe FilteredCar
legendCar =
    List.head filteredCars


legendSize : Float
legendSize =
    110


legendCanvasW : Float
legendCanvasW =
    560


legendCanvasH : Float
legendCanvasH =
    520


legendView : Html msg
legendView =
    case legendCar of
        Nothing ->
            Html.text ""

        Just car ->
            let
                cx0 =
                    260

                cy0 =
                    260

                color =
                    carTypeColor car.carType

                figureLines =
                    stickFigureLines cx0 cy0 legendSize 2.6 color car

                labels =
                    List.map (limbLabel cx0 cy0 legendSize car) limbSpecs

                hubDots =
                    [ hubDot (cx0 + 0) (cy0 - legendSize)
                    , hubDot (cx0 + 0) cy0
                    , hubDot (cx0 + 0) (cy0 + legendSize)
                    ]

                figureSvg =
                    svg
                        [ viewBox 0 0 legendCanvasW legendCanvasH
                        , TA.width (TypedSvg.Types.px legendCanvasW)
                        , TA.height (TypedSvg.Types.px legendCanvasH)
                        ]
                        (figureLines ++ hubDots ++ labels)
            in
            Html.div
                [ HA.style "display" "flex"
                , HA.style "gap" "24px"
                , HA.style "align-items" "flex-start"
                , HA.style "margin-bottom" "24px"
                ]
                [ Html.div []
                    [ Html.h3 [] [ Html.text ("Legenden-Figur — " ++ car.vehicleName) ]
                    , Html.p [ HA.style "margin" "0 0 8px 0" ]
                        [ Html.text ("Typ: " ++ carTypeName car.carType ++ " — Farbe der Figur.") ]
                    , figureSvg
                    ]
                , legendTable car
                ]


hubDot : Float -> Float -> Svg msg
hubDot px py =
    TypedSvg.circle
        [ TypedSvg.Attributes.InPx.cx px
        , TypedSvg.Attributes.InPx.cy py
        , TypedSvg.Attributes.InPx.r 3
        , TA.fill (Paint (Color.rgb 0.1 0.1 0.1))
        ]
        []


limbLabel : Float -> Float -> Float -> FilteredCar -> LimbSpec -> Svg msg
limbLabel centerX centerY s car spec =
    let
        ( ox, oy ) =
            hubOffset spec.hub

        a =
            limbAngleRad spec car

        ex =
            centerX + s * (ox + 1.18 * cos a)

        ey =
            centerY + s * (oy - 1.18 * sin a)

        anchor =
            if cos a > 0.2 then
                AnchorStart

            else if cos a < -0.2 then
                AnchorEnd

            else
                AnchorMiddle
    in
    text_
        [ x ex
        , y ey
        , fontSize 11
        , TA.textAnchor anchor
        ]
        [ TypedSvg.Core.text (spec.label ++ " = " ++ fmtValue (spec.getter car)) ]


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


legendTable : FilteredCar -> Html msg
legendTable car =
    Html.div []
        [ Html.h3 [] [ Html.text "Attribut → Winkel-Mapping" ]
        , Html.p [ HA.style "margin" "0 0 8px 0", HA.style "max-width" "440px" ]
            [ Html.text
                ("Jedes Attribut wird linear auf [0,1] normiert (über alle "
                    ++ String.fromInt (List.length filteredCars)
                    ++ " gefilterten Autos) und dann auf den unten angegebenen Winkel-Bereich um den Basis-Winkel abgebildet."
                )
            ]
        , Html.table
            [ HA.style "border-collapse" "collapse"
            , HA.style "font-size" "13px"
            ]
            (legendHeader :: List.map (legendRow car) limbSpecs)
        ]


legendHeader : Html msg
legendHeader =
    Html.tr []
        [ th "Attribut"
        , th "Wert"
        , th "Hub"
        , th "Basis-Winkel"
        , th "Winkel-Bereich"
        , th "akt. Winkel"
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


legendRow : FilteredCar -> LimbSpec -> Html msg
legendRow car spec =
    let
        currentDeg =
            limbAngleRad spec car * 180 / pi

        hubLabel =
            case spec.hub of
                HubTop ->
                    "oben"

                HubCenter ->
                    "Mitte"

                HubBottom ->
                    "unten"
    in
    Html.tr []
        [ td spec.label
        , td (fmtValue (spec.getter car))
        , td hubLabel
        , td (String.fromFloat spec.baseAngleDeg ++ "°")
        , td ("±" ++ String.fromFloat spec.rangeDeg ++ "°")
        , td (fmtValue currentDeg ++ "°")
        ]



-- SCATTERPLOT mit Mini-Stick-Figures statt Kreisen ---------------


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
            model.stickSize

        sw =
            max 0.5 (s * 0.18)

        figure : FilteredCar -> List (Svg msg)
        figure c =
            stickFigureLines
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
            (List.concatMap figure filteredCars)
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



-- VIEW -----------------------------------------------------------


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
        [ Html.h2 [] [ Html.text "Aufgabe 8.2 — Stick Figure (Pickett & Grinstein 1988)" ]
        , Html.p [ HA.style "max-width" "880px" ]
            [ Html.text
                ("Es werden "
                    ++ String.fromInt (List.length filteredCars)
                    ++ " Autos angezeigt (alle Autos ohne Wert in einem der 11 numerischen Attribute wurden entfernt)."
                )
            ]
        , legendView
        , Html.hr [] []
        , Html.h3 [] [ Html.text "Scatterplot mit Stick Figures statt Kreisen" ]
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
                [ Html.text ("Stick-Figure-Größe: " ++ fmtValue model.stickSize ++ " px  ")
                , Html.input
                    [ HA.type_ "range"
                    , HA.min "2"
                    , HA.max "20"
                    , HA.step "0.5"
                    , HA.value (String.fromFloat model.stickSize)
                    , HE.onInput SetStickSize
                    , HA.style "width" "220px"
                    , HA.style "vertical-align" "middle"
                    ]
                    []
                ]
            ]
        , scatterplot model
        ]



-- MAIN -----------------------------------------------------------


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }
