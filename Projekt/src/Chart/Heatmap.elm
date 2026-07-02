module Chart.Heatmap exposing (Config, view)

{-| Sicht 2 (Bereich *Icon-/Pixel-orientiert*): Stunde×Tag-Heatmap.

Anwendungsfrage: *Welche täglichen und saisonalen Rhythmen hat die
(Solar-)Erzeugung?* Erneuerbare sind fundamental von Tages- und Jahreszyklen
getrieben – dichte, periodische Zeitdaten. Genau dafür sind pixel-orientierte
Techniken gedacht: jede Zelle ist ein Pixel, das **einen** Wert per Farbe
codiert (x = Tag, y = Stunde). Das Solar-Mittagsband und die Saisondrift
werden so auf einen Blick lesbar.

Farbskala über `Scale.Color` (wie in Übung 7).
-}

import Color exposing (Color)
import Dict exposing (Dict)
import Energy exposing (HeatCell)
import List.Extra
import TypedSvg exposing (g, rect, svg, text_, title)
import TypedSvg.Attributes as TA exposing (transform, viewBox)
import TypedSvg.Attributes.InPx as InPx
import TypedSvg.Core exposing (Svg)
import TypedSvg.Events as TE
import TypedSvg.Types exposing (AnchorAlignment(..), Paint(..), Transform(..))


type alias Config msg =
    { width : Float
    , height : Float
    , cells : List HeatCell
    , extent : ( Float, Float )
    , unit : String
    , interpolator : Float -> Color
    , focusedDay : Maybe Int
    , onClickDay : Int -> msg
    }


pad : { left : Float, right : Float, top : Float, bottom : Float }
pad =
    { left = 34, right = 10, top = 8, bottom = 22 }


view : Config msg -> Svg msg
view cfg =
    let
        plotW =
            cfg.width - pad.left - pad.right

        plotH =
            cfg.height - pad.top - pad.bottom

        days =
            cfg.cells |> List.map .day |> List.Extra.unique |> List.sort

        nDays =
            List.length days

        cellW =
            if nDays == 0 then
                plotW

            else
                plotW / toFloat nDays

        cellH =
            plotH / 24

        dayCol : Dict Int Int
        dayCol =
            days |> List.indexedMap (\i d -> ( d, i )) |> Dict.fromList

        ( vmin, vmax ) =
            cfg.extent

        norm v =
            if vmax <= vmin then
                0.5

            else
                Basics.max 0 (Basics.min 1 ((v - vmin) / (vmax - vmin)))

        pad2 n =
            if n < 10 then
                "0" ++ String.fromInt n

            else
                String.fromInt n

        cellSvg : HeatCell -> Svg msg
        cellSvg c =
            let
                col =
                    Dict.get c.day dayCol |> Maybe.withDefault 0

                tip =
                    Energy.dayLabel c.day
                        ++ "  "
                        ++ pad2 c.hour
                        ++ ":00  ·  "
                        ++ String.fromFloat (toFloat (round (c.value * 10)) / 10)
                        ++ " "
                        ++ cfg.unit
            in
            rect
                [ InPx.x (toFloat col * cellW)
                , InPx.y (toFloat c.hour * cellH)
                , InPx.width (cellW + 0.6)
                , InPx.height (cellH + 0.6)
                , TA.fill (Paint (cfg.interpolator (norm c.value)))
                , TE.onClick (cfg.onClickDay c.day)
                ]
                [ title [] [ TypedSvg.Core.text tip ] ]

        focusOutline =
            case cfg.focusedDay |> Maybe.andThen (\d -> Dict.get d dayCol) of
                Just col ->
                    [ rect
                        [ InPx.x (toFloat col * cellW)
                        , InPx.y 0
                        , InPx.width cellW
                        , InPx.height plotH
                        , TA.fill PaintNone
                        , TA.stroke (Paint Color.black)
                        , InPx.strokeWidth 1.6
                        ]
                        []
                    ]

                Nothing ->
                    []

        hourLabels =
            [ 0, 6, 12, 18 ]
                |> List.map
                    (\h ->
                        text_
                            [ InPx.x -8
                            , InPx.y (toFloat h * cellH + 4)
                            , TA.textAnchor AnchorEnd
                            , InPx.fontSize 11
                            , TA.fill (Paint (Color.rgb255 71 85 105))
                            ]
                            [ TypedSvg.Core.text (String.fromInt h ++ "h") ]
                    )

        step =
            Basics.max 1 (nDays // 10)

        dayLabels =
            days
                |> List.indexedMap Tuple.pair
                |> List.filterMap
                    (\( i, d ) ->
                        if modBy step i == 0 then
                            Just
                                (text_
                                    [ InPx.x (toFloat i * cellW + cellW / 2)
                                    , InPx.y (plotH + 14)
                                    , TA.textAnchor AnchorMiddle
                                    , InPx.fontSize 11
                                    , TA.fill (Paint (Color.rgb255 71 85 105))
                                    ]
                                    [ TypedSvg.Core.text (Energy.dayLabel d) ]
                                )

                        else
                            Nothing
                    )
    in
    svg
        [ viewBox 0 0 cfg.width cfg.height
        , TA.width (TypedSvg.Types.Percent 100)
        ]
        [ g [ transform [ Translate pad.left pad.top ] ]
            (List.map cellSvg cfg.cells ++ focusOutline ++ hourLabels ++ dayLabels)
        ]
