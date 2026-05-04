module Uebung4Aufgabe2 exposing (main)

import Html exposing (Html, div)
import Html.Attributes as HA
import Svg exposing (Svg, svg, g, circle, line, text_)
import Svg.Attributes as Attr
import Cars exposing (cars, CarType(..))



-- FILTER (kompatibel zu Uebung 2 / 3 / 4.1)


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


classLabel : String
classLabel =
    "SUVs"


attrLabel : String
attrLabel =
    "retailPrice"


carsOfClass =
    List.filter (\c -> c.carType == selectedClass) validCars



-- Attribut: retailPrice (rechtsschiefe Verteilung)


rawValues : List Float
rawValues =
    carsOfClass
        |> List.filterMap (.retailPrice >> Maybe.map toFloat)



-- TRANSFORMATIONEN


type alias Transformation =
    { name : String
    , apply : Float -> Float
    }


transformations : List Transformation
transformations =
    [ { name = "Original (p = 1)", apply = \x -> x }
    , { name = "Power p = 0.5  (sqrt)", apply = \x -> x ^ 0.5 }
    , { name = "Power p = 0.25", apply = \x -> x ^ 0.25 }
    , { name = "Log  (p -> 0)", apply = \x -> logBase e x }
    , { name = "Power p = -0.25", apply = \x -> -1 * x ^ -0.25 }
    , { name = "Power p = -0.5", apply = \x -> -1 * x ^ -0.5 }
    ]



-- STATISTIK


mean : List Float -> Float
mean xs =
    List.sum xs / toFloat (List.length xs)


std : List Float -> Float
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



-- INVERSE STANDARD-NORMAL-CDF (Shore 1982)


invNormalCdf : Float -> Float
invNormalCdf f =
    if f >= 0.5 then
        5.5556 * (1 - ((1 - f) / f) ^ 0.1186)

    else
        -5.5556 * (1 - (f / (1 - f)) ^ 0.1186)



-- REFERENZLINIE durch (qn(0.25), qe(0.25)) und (qn(0.75), qe(0.75))


referenceLine : List Float -> List Float -> ( Float, Float )
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
            if x75 - x25 == 0 then
                0

            else
                (y75 - y25) / (x75 - x25)

        intercept =
            y25 - slope * x25
    in
    ( slope, intercept )



-- SKALA / ACHSEN (manuell, damit Ellie-Variante kompatibel bleibt)


linearScale : ( Float, Float ) -> ( Float, Float ) -> Float -> Float
linearScale ( r0, r1 ) ( d0, d1 ) v =
    if d1 == d0 then
        (r0 + r1) / 2

    else
        r0 + (v - d0) / (d1 - d0) * (r1 - r0)


tickValues : Float -> Float -> Int -> List Float
tickValues d0 d1 count =
    List.range 0 count
        |> List.map
            (\i ->
                d0 + toFloat i / toFloat count * (d1 - d0)
            )


formatTick : Float -> String
formatTick v =
    let
        rounded =
            (v * 100 |> round |> toFloat) / 100
    in
    String.fromFloat rounded


bottomAxis : ( Float, Float ) -> Float -> ( Float, Float ) -> Svg msg
bottomAxis ( r0, r1 ) yPos ( d0, d1 ) =
    let
        sc v =
            linearScale ( r0, r1 ) ( d0, d1 ) v
    in
    g []
        ([ line
            [ Attr.x1 (String.fromFloat r0)
            , Attr.y1 (String.fromFloat yPos)
            , Attr.x2 (String.fromFloat r1)
            , Attr.y2 (String.fromFloat yPos)
            , Attr.stroke "#1f2933"
            , Attr.strokeWidth "1"
            ]
            []
         ]
            ++ List.concatMap
                (\v ->
                    let
                        x =
                            sc v
                    in
                    [ line
                        [ Attr.x1 (String.fromFloat x)
                        , Attr.y1 (String.fromFloat yPos)
                        , Attr.x2 (String.fromFloat x)
                        , Attr.y2 (String.fromFloat (yPos + 5))
                        , Attr.stroke "#1f2933"
                        ]
                        []
                    , text_
                        [ Attr.x (String.fromFloat x)
                        , Attr.y (String.fromFloat (yPos + 18))
                        , Attr.textAnchor "middle"
                        , Attr.fontSize "11"
                        , Attr.fill "#1f2933"
                        ]
                        [ Svg.text (formatTick v) ]
                    ]
                )
                (tickValues d0 d1 6)
        )


leftAxis : ( Float, Float ) -> Float -> ( Float, Float ) -> Svg msg
leftAxis ( r0, r1 ) xPos ( d0, d1 ) =
    let
        sc v =
            linearScale ( r0, r1 ) ( d0, d1 ) v
    in
    g []
        ([ line
            [ Attr.x1 (String.fromFloat xPos)
            , Attr.y1 (String.fromFloat r0)
            , Attr.x2 (String.fromFloat xPos)
            , Attr.y2 (String.fromFloat r1)
            , Attr.stroke "#1f2933"
            , Attr.strokeWidth "1"
            ]
            []
         ]
            ++ List.concatMap
                (\v ->
                    let
                        y =
                            sc v
                    in
                    [ line
                        [ Attr.x1 (String.fromFloat (xPos - 5))
                        , Attr.y1 (String.fromFloat y)
                        , Attr.x2 (String.fromFloat xPos)
                        , Attr.y2 (String.fromFloat y)
                        , Attr.stroke "#1f2933"
                        ]
                        []
                    , text_
                        [ Attr.x (String.fromFloat (xPos - 9))
                        , Attr.y (String.fromFloat (y + 4))
                        , Attr.textAnchor "end"
                        , Attr.fontSize "11"
                        , Attr.fill "#1f2933"
                        ]
                        [ Svg.text (formatTick v) ]
                    ]
                )
                (tickValues d0 d1 6)
        )



-- EIN PANEL (Normal-QQ-Plot fuer eine Transformation)


panel : Transformation -> Html msg
panel t =
    let
        transformed =
            List.map t.apply rawValues

        sortedYs =
            List.sort transformed

        n =
            List.length sortedYs

        nF =
            toFloat n

        positions =
            List.indexedMap (\i _ -> (toFloat i + 0.5) / nF) sortedYs

        xs =
            List.map invNormalCdf positions

        xMin =
            List.minimum xs |> Maybe.withDefault -2

        xMax =
            List.maximum xs |> Maybe.withDefault 2

        yMin =
            List.minimum sortedYs |> Maybe.withDefault 0

        yMax =
            List.maximum sortedYs |> Maybe.withDefault 1

        xPad =
            (xMax - xMin) * 0.05

        yPad =
            if yMax == yMin then
                1

            else
                (yMax - yMin) * 0.05

        xDomain =
            ( xMin - xPad, xMax + xPad )

        yDomain =
            ( yMin - yPad, yMax + yPad )

        plotW =
            520

        plotH =
            300

        leftMargin =
            70

        topMargin =
            30

        bottomMargin =
            40

        rightMargin =
            20

        innerW =
            plotW - leftMargin - rightMargin

        innerH =
            plotH - topMargin - bottomMargin

        scaleX =
            linearScale ( 0, toFloat innerW ) xDomain

        scaleY =
            linearScale ( toFloat innerH, 0 ) yDomain

        ( slope, intercept ) =
            referenceLine xs sortedYs

        refLine =
            line
                [ Attr.x1 (String.fromFloat (scaleX xMin))
                , Attr.y1 (String.fromFloat (scaleY (slope * xMin + intercept)))
                , Attr.x2 (String.fromFloat (scaleX xMax))
                , Attr.y2 (String.fromFloat (scaleY (slope * xMax + intercept)))
                , Attr.stroke "#1f2933"
                , Attr.strokeWidth "1"
                ]
                []

        round2 v =
            (v * 100 |> round |> toFloat) / 100

        point ( x, y ) =
            g [ Attr.class "point" ]
                [ circle
                    [ Attr.cx (String.fromFloat (scaleX x))
                    , Attr.cy (String.fromFloat (scaleY y))
                    , Attr.r "4"
                    ]
                    []
                , text_
                    [ Attr.x (String.fromFloat (scaleX x + 6))
                    , Attr.y (String.fromFloat (scaleY y - 6))
                    , Attr.fontSize "11"
                    ]
                    [ Svg.text
                        ("("
                            ++ String.fromFloat (round2 x)
                            ++ ", "
                            ++ String.fromFloat (round2 y)
                            ++ ")"
                        )
                    ]
                ]

        points =
            List.map2 (\x y -> point ( x, y )) xs sortedYs
    in
    div [ HA.style "margin-bottom" "24px" ]
        [ div
            [ HA.style "font-weight" "bold"
            , HA.style "font-size" "16px"
            , HA.style "margin-bottom" "4px"
            ]
            [ Html.text t.name ]
        , svg
            [ Attr.viewBox ("0 0 " ++ String.fromInt plotW ++ " " ++ String.fromInt plotH)
            , Attr.width (String.fromInt plotW)
            , Attr.height (String.fromInt plotH)
            ]
            [ Svg.style []
                [ Svg.text """
                    .point circle { stroke: #1f2933; fill: white; stroke-width: 1px; }
                    .point text { display: none; fill: #1f7a3a; font-weight: 600; pointer-events: none; }
                    .point:hover circle { fill: #2ecc71; stroke: #1f7a3a; stroke-width: 2px; }
                    .point:hover text { display: block; }
                """ ]
            , g [ Attr.transform ("translate(" ++ String.fromInt leftMargin ++ "," ++ String.fromInt topMargin ++ ")") ]
                (refLine :: points)
            , g [ Attr.transform ("translate(" ++ String.fromInt leftMargin ++ "," ++ String.fromInt topMargin ++ ")") ]
                [ bottomAxis ( 0, toFloat innerW ) (toFloat innerH) xDomain ]
            , g [ Attr.transform ("translate(" ++ String.fromInt leftMargin ++ "," ++ String.fromInt topMargin ++ ")") ]
                [ leftAxis ( toFloat innerH, 0 ) 0 yDomain ]
            , text_
                [ Attr.x (String.fromInt (leftMargin + innerW // 2))
                , Attr.y (String.fromInt (plotH - 6))
                , Attr.textAnchor "middle"
                , Attr.fontSize "12"
                ]
                [ Svg.text "Normal quantiles" ]
            , text_
                [ Attr.x "12"
                , Attr.y "20"
                , Attr.fontSize "12"
                ]
                [ Svg.text ("transformed " ++ attrLabel) ]
            ]
        ]



-- VIEW


view : Html msg
view =
    div
        [ HA.style "font-family" "Arial, sans-serif"
        , HA.style "padding" "16px"
        ]
        [ Html.h2 [] [ Html.text ("Normal-QQ-Plots: " ++ attrLabel ++ " bei " ++ classLabel) ]
        , Html.ul []
            [ Html.li []
                [ Html.text
                    ("Number of filtered Cars: "
                        ++ String.fromInt (List.length validCars)
                    )
                ]
            , Html.li []
                [ Html.text
                    ("Number of " ++ classLabel ++ ": "
                        ++ String.fromInt (List.length carsOfClass)
                    )
                ]
            , Html.li []
                [ Html.text
                    ("Mittelwert "
                        ++ attrLabel
                        ++ ": "
                        ++ String.fromFloat ((mean rawValues * 100 |> round |> toFloat) / 100)
                    )
                ]
            , Html.li []
                [ Html.text
                    ("Standardabweichung "
                        ++ attrLabel
                        ++ ": "
                        ++ String.fromFloat ((std rawValues * 100 |> round |> toFloat) / 100)
                    )
                ]
            ]
        , Html.p []
            [ Html.text
                ("Das Original "
                    ++ attrLabel
                    ++ " der "
                    ++ classLabel
                    ++ " ist deutlich rechtsschief. Wir testen Power-Transformationen "
                    ++ "x^p fuer p in {1, 0.5, 0.25, 0, -0.25, -0.5} (mit p=0 = log) "
                    ++ "und vergleichen, welche Transformation die Daten am besten an die Normalverteilung anpasst."
                )
            ]
        , div [] (List.map panel transformations)
        ]


main : Html msg
main =
    view
