module Energy exposing
    ( Row, Band, Group(..)
    , bands, bandsStacked, groupName, groupColor
    , totalGeneration, bandValue
    , Metric(..), metricLabel, metricUnit, metricValue, metricInterpolator
    , hourOf, dayOf, dayLabel
    , HeatCell, binHourly, heatExtent
    , sumByBand
    )

{-| Domänenmodell für die EnergyCharts-`publicpower`-Daten.

Eine `Row` ist eine Messung (ein Land, ein Zeitpunkt). Aus den ~18 Quellen-
Spalten werden 8 fachlich sinnvolle **Bänder** gebildet (Solar, Wind, …), die
in allen drei Sichten konsistent verwendet werden (gleiche Reihenfolge, gleiche
Farben). Dieses Modul kapselt zudem die Aggregation für Heatmap (stündliche
Bins) und Treemap (Summen je Band).
-}

import Color exposing (Color)
import Dict exposing (Dict)
import Scale.Color
import Time



-- ============================================================
-- ROW
-- ============================================================


{-| Eine Zeile aus `energycharts_publicpower`. Werte in GW.
-}
type alias Row =
    { unixSeconds : Int
    , countryId : String
    , load : Float
    , solar : Float
    , windOnshore : Float
    , windOffshore : Float
    , hydroRor : Float
    , hydroReservoir : Float
    , hydroPumped : Float
    , biomass : Float
    , geothermal : Float
    , nuclear : Float
    , brownCoal : Float
    , hardCoal : Float
    , oil : Float
    , gas : Float
    , coalDerivedGas : Float
    , waste : Float
    , others : Float
    }



-- ============================================================
-- BÄNDER (8 zusammengefasste Quellen)
-- ============================================================


type Group
    = Renewable
    | Conventional


groupName : Group -> String
groupName g =
    case g of
        Renewable ->
            "Erneuerbar"

        Conventional ->
            "Konventionell"


{-| Hintergrundfarbe für die Gruppen-Beschriftung in der Treemap. -}
groupColor : Group -> Color
groupColor g =
    case g of
        Renewable ->
            Color.rgb255 35 80 45

        Conventional ->
            Color.rgb255 60 60 60


{-| Ein Band fasst mehrere Roh-Spalten zu einer Erzeugungsart zusammen. -}
type alias Band =
    { name : String
    , group : Group
    , color : Color
    , value : Row -> Float
    }


rgb : Int -> Int -> Int -> Color
rgb =
    Color.rgb255


{-| Kanonische Reihenfolge (Erneuerbare zuerst) – für Legende & Treemap. -}
bands : List Band
bands =
    [ solarBand
    , windBand
    , hydroBand
    , biomassBand
    , nuclearBand
    , coalBand
    , gasBand
    , otherBand
    ]


{-| Stapel-Reihenfolge von unten nach oben: Konventionelles unten,
Erneuerbare oben – so liegt der „grüne Deckel" sichtbar unter der Last-Linie.
-}
bandsStacked : List Band
bandsStacked =
    [ coalBand
    , gasBand
    , otherBand
    , nuclearBand
    , biomassBand
    , hydroBand
    , windBand
    , solarBand
    ]


solarBand : Band
solarBand =
    Band "Solar" Renewable (rgb 255 209 59) .solar


windBand : Band
windBand =
    Band "Wind" Renewable (rgb 79 163 209) (\r -> r.windOnshore + r.windOffshore)


hydroBand : Band
hydroBand =
    Band "Wasserkraft" Renewable (rgb 46 111 149) (\r -> r.hydroRor + r.hydroReservoir + r.hydroPumped)


biomassBand : Band
biomassBand =
    Band "Biomasse" Renewable (rgb 91 168 91) (\r -> r.biomass + r.geothermal)


nuclearBand : Band
nuclearBand =
    Band "Kernkraft" Conventional (rgb 184 111 184) .nuclear


coalBand : Band
coalBand =
    Band "Kohle" Conventional (rgb 74 74 74) (\r -> r.brownCoal + r.hardCoal + r.coalDerivedGas)


gasBand : Band
gasBand =
    Band "Gas/Öl" Conventional (rgb 156 122 91) (\r -> r.gas + r.oil)


otherBand : Band
otherBand =
    Band "Sonstige" Conventional (rgb 176 176 176) (\r -> r.waste + r.others)


bandValue : Band -> Row -> Float
bandValue b r =
    b.value r


{-| Gesamte Erzeugung (Summe aller Bänder) – Basis für Anteile. -}
totalGeneration : Row -> Float
totalGeneration r =
    List.sum (List.map (\b -> b.value r) bands)



-- ============================================================
-- METRIK FÜR DIE HEATMAP
-- ============================================================


type Metric
    = SolarShare
    | RenewableShare
    | LoadMetric


metricLabel : Metric -> String
metricLabel m =
    case m of
        SolarShare ->
            "Solar-Anteil"

        RenewableShare ->
            "Erneuerbaren-Anteil"

        LoadMetric ->
            "Last"


metricUnit : Metric -> String
metricUnit m =
    case m of
        LoadMetric ->
            "GW"

        _ ->
            "%"


{-| Wert der gewählten Metrik für eine Zeile (Anteile in Prozent). -}
metricValue : Metric -> Row -> Float
metricValue m r =
    let
        total =
            totalGeneration r
    in
    case m of
        SolarShare ->
            if total <= 0 then
                0

            else
                100 * r.solar / total

        RenewableShare ->
            if total <= 0 then
                0

            else
                100 * List.sum (List.map (\b -> b.value r) (List.filter (\b -> b.group == Renewable) bands)) / total

        LoadMetric ->
            r.load


{-| Sequentielle Farbskala je Metrik (0..1 -> Farbe). -}
metricInterpolator : Metric -> Float -> Color
metricInterpolator m =
    case m of
        SolarShare ->
            Scale.Color.yellowOrangeRedInterpolator

        RenewableShare ->
            Scale.Color.yellowGreenInterpolator

        LoadMetric ->
            Scale.Color.infernoInterpolator



-- ============================================================
-- ZEIT-HILFEN (UTC, aus unix_seconds)
-- ============================================================


hourOf : Int -> Int
hourOf unix =
    modBy 24 (unix // 3600)


{-| Absolute Tagesnummer seit Epoche (UTC) – als Spalten-Schlüssel. -}
dayOf : Int -> Int
dayOf unix =
    unix // 86400


{-| Kurzes Datums-Label "TT.MM." aus einer Tagesnummer. -}
dayLabel : Int -> String
dayLabel dayIndex =
    let
        posix =
            Time.millisToPosix (dayIndex * 86400 * 1000)

        d =
            Time.toDay Time.utc posix

        mon =
            monthNum (Time.toMonth Time.utc posix)

        pad n =
            if n < 10 then
                "0" ++ String.fromInt n

            else
                String.fromInt n
    in
    pad d ++ "." ++ pad mon ++ "."


monthNum : Time.Month -> Int
monthNum m =
    case m of
        Time.Jan -> 1
        Time.Feb -> 2
        Time.Mar -> 3
        Time.Apr -> 4
        Time.May -> 5
        Time.Jun -> 6
        Time.Jul -> 7
        Time.Aug -> 8
        Time.Sep -> 9
        Time.Oct -> 10
        Time.Nov -> 11
        Time.Dec -> 12



-- ============================================================
-- HEATMAP-BINNING  (Mittelwert je (Tag, Stunde))
-- ============================================================


type alias HeatCell =
    { day : Int
    , hour : Int
    , value : Float
    }


{-| Mittelt die Metrik je (Tagesnummer, Stunde). Mehrere 15-Minuten-Werte einer
Stunde werden so zu einem Stunden-Pixel zusammengefasst.
-}
binHourly : Metric -> List Row -> List HeatCell
binHourly metric rows =
    let
        step : Row -> Dict ( Int, Int ) ( Float, Int ) -> Dict ( Int, Int ) ( Float, Int )
        step r acc =
            let
                key =
                    ( dayOf r.unixSeconds, hourOf r.unixSeconds )

                v =
                    metricValue metric r
            in
            Dict.update key
                (\existing ->
                    case existing of
                        Just ( sum, n ) ->
                            Just ( sum + v, n + 1 )

                        Nothing ->
                            Just ( v, 1 )
                )
                acc
    in
    List.foldl step Dict.empty rows
        |> Dict.toList
        |> List.map
            (\( ( day, hour ), ( sum, n ) ) ->
                { day = day, hour = hour, value = sum / toFloat (max 1 n) }
            )


{-| Wertebereich (min, max) über alle Zellen – für die Farbskala. -}
heatExtent : List HeatCell -> ( Float, Float )
heatExtent cells =
    let
        vals =
            List.map .value cells
    in
    ( List.minimum vals |> Maybe.withDefault 0
    , List.maximum vals |> Maybe.withDefault 1
    )



-- ============================================================
-- TREEMAP-SUMMEN
-- ============================================================


{-| Summe je Band über alle übergebenen Zeilen (∝ Energie im Zeitraum).
Bänder mit Summe 0 werden weggelassen, damit die Treemap keine
Null-Flächen erzeugt.
-}
sumByBand : List Row -> List ( Band, Float )
sumByBand rows =
    bands
        |> List.map (\b -> ( b, List.sum (List.map b.value rows) ))
        |> List.filter (\( _, v ) -> v > 0)
