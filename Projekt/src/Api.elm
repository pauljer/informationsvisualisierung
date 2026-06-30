module Api exposing
    ( getToken
    , getRecent
    , loadCountryWindow
    )

{-| Zugriff auf die ScienceData-/EnergyCharts-API über den lokalen Proxy
(`proxy.js`, Port 3001).

**Performance-Tricks.** Zwei API-Eigenheiten dieser DB:

  - Filter auf der String-Spalte `country_id` funktionieren serverseitig nicht.
  - Abfragen mit **leerem** `where_` materialisieren die ganze Tabelle (~15 s);
    Abfragen mit numerischem Filter sind schnell (<1 s).

Die Zeilen liegen **pro Land in zusammenhängenden `id`-Blöcken** (zeitlich
aufsteigend). Deshalb:

1.  `getRecent` lädt **eine** gefilterte Abfrage (`unix_seconds > jetzt−90 T`,
    nach Zeit absteigend) und liefert daraus zugleich den jüngsten Zeitpunkt
    `tmax` **und** je Land die größte `id` (= Obergrenze seines Blocks).
2.  `loadCountryWindow` lädt ein Land per **numerischem** `id`-Bereich
    `(lo, hi]` plus `unix_seconds >= tmin` – **eine** kleine Abfrage
    (≈170–2900 Zeilen) statt zehntausender Zeilen über mehrere Seiten.
-}

import Energy exposing (Row)
import Http
import Json.Decode as D exposing (Decoder)
import Json.Decode.Pipeline exposing (optional, required)
import Json.Encode as E


proxyBase : String
proxyBase =
    "http://localhost:3001"


tableName : String
tableName =
    "energycharts_publicpower"


limit : Int
limit =
    5000



-- ============================================================
-- TOKEN
-- ============================================================


getToken : (Result Http.Error String -> msg) -> Cmd msg
getToken toMsg =
    Http.post
        { url = proxyBase ++ "/token"
        , body = Http.emptyBody
        , expect = Http.expectJson toMsg (D.field "token" D.string)
        }



-- ============================================================
-- ABFRAGEN
-- ============================================================


{-| Eine gefilterte Abfrage der jüngsten Daten (ab `lbUnix`), nach Zeit
absteigend. Liefert `(country_id, id, unix_seconds)`-Tripel, woraus `Main`
sowohl `tmax` (größtes `unix_seconds`) als auch je Land die größte `id`
(Block-Obergrenze) bildet. -}
getRecent : String -> Int -> (Result Http.Error (List ( String, Int, Int )) -> msg) -> Cmd msg
getRecent token lbUnix toMsg =
    request token
        (queryBody [ whereInt "unix_seconds" ">" lbUnix ] [ orderBy "unix_seconds" "desc" ] limit)
        (D.list recentDecoder)
        toMsg


{-| Lädt genau ein Land über seinen `id`-Block `(lo, hi]` im Zeitfenster. -}
loadCountryWindow : String -> ( Int, Int ) -> Int -> (Result Http.Error (List Row) -> msg) -> Cmd msg
loadCountryWindow token ( lo, hi ) tmin toMsg =
    request token
        (queryBody
            [ whereInt "id" ">" lo
            , whereInt "id" "<=" hi
            , whereInt "unix_seconds" ">=" tmin
            ]
            [ orderBy "unix_seconds" "asc" ]
            limit
        )
        (D.list rowDecoder)
        toMsg



-- ============================================================
-- HTTP / BODY
-- ============================================================


request : String -> E.Value -> Decoder a -> (Result Http.Error a -> msg) -> Cmd msg
request token body decoder toMsg =
    Http.request
        { method = "POST"
        , headers = [ Http.header "Authorization" ("Bearer " ++ token) ]
        , url = proxyBase ++ "/proxy"
        , body = Http.jsonBody body
        , expect = Http.expectJson toMsg decoder
        , timeout = Nothing
        , tracker = Nothing
        }


queryBody : List E.Value -> List E.Value -> Int -> E.Value
queryBody whereList orderList limit_ =
    E.object
        [ ( "p_table_name", E.string tableName )
        , ( "where_", E.list identity whereList )
        , ( "order_by", E.list identity orderList )
        , ( "limit_val", E.int limit_ )
        , ( "offset_val", E.int 0 )
        ]


whereInt : String -> String -> Int -> E.Value
whereInt col op val =
    E.object
        [ ( "col", E.string col )
        , ( "op", E.string op )
        , ( "val", E.int val )
        , ( "logic", E.string "and" )
        ]


orderBy : String -> String -> E.Value
orderBy col dir =
    E.object [ ( "col", E.string col ), ( "dir", E.string dir ) ]



-- ============================================================
-- DECODER
-- ============================================================


recentDecoder : Decoder ( String, Int, Int )
recentDecoder =
    D.map3 (\c i u -> ( c, i, u ))
        (D.field "country_id" D.string)
        (D.field "id" D.int)
        (D.field "unix_seconds" D.int)


num : Decoder Float
num =
    D.oneOf [ D.float, D.null 0 ]


rowDecoder : Decoder Row
rowDecoder =
    D.succeed Row
        |> required "unix_seconds" D.int
        |> optional "country_id" D.string ""
        |> optional "load_in_gw" num 0
        |> optional "solar_in_gw" num 0
        |> optional "wind_onshore_in_gw" num 0
        |> optional "wind_offshore_in_gw" num 0
        |> optional "hydro_run_of_river_in_gw" num 0
        |> optional "hydro_water_reservoir_in_gw" num 0
        |> optional "hydro_pumped_storage_in_gw" num 0
        |> optional "biomass_in_gw" num 0
        |> optional "geothermal_in_gw" num 0
        |> optional "nuclear_energy_in_gw" num 0
        |> optional "fossil_brown_coal_lignite_in_gw" num 0
        |> optional "fossil_hard_coal_in_gw" num 0
        |> optional "fossil_oil_in_gw" num 0
        |> optional "fossil_gas_in_gw" num 0
        |> optional "fossil_coal_derived_gas_in_gw" num 0
        |> optional "waste_in_gw" num 0
        |> optional "others_in_gw" num 0
