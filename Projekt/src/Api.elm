module Api exposing
    ( pageLimit
    , getToken
    , getLatest
    , loadPage
    )

{-| Zugriff auf die ScienceData-/EnergyCharts-API über den lokalen Proxy
(`proxy.js`, Port 3001).

Wichtige API-Eigenheit (selbst verifiziert): Filter auf der String-Spalte
`country_id` funktionieren **nicht** (`=`/`like` liefern leer). Daher wird per
**numerischem** `unix_seconds`-Fenster geladen und das Land anschließend
**client-seitig** gefiltert (siehe `Main`). `limit_val` ist bis 5000 nutzbar,
Pagination über `offset_val`.
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


{-| Zeilen pro Seite (Server-Limit). -}
pageLimit : Int
pageLimit =
    5000



-- ============================================================
-- TOKEN
-- ============================================================


{-| Holt über den Proxy ein Bearer-Token (Basic-Auth passiert im Proxy). -}
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


{-| Jüngster Zeitstempel der Tabelle (order by desc, 1 Zeile). -}
getLatest : String -> (Result Http.Error (Maybe Int) -> msg) -> Cmd msg
getLatest token toMsg =
    request token
        (queryBody [] [ orderBy "unix_seconds" "desc" ] 1 0)
        (D.map (List.head >> Maybe.map .unixSeconds) (D.list rowDecoder))
        toMsg


{-| Eine Seite des Zeitfensters `unix_seconds >= tmin` (stabile Sortierung
über `id`, daher sicher paginierbar). -}
loadPage : String -> Int -> Int -> (Result Http.Error (List Row) -> msg) -> Cmd msg
loadPage token tmin offset toMsg =
    request token
        (queryBody [ whereGte "unix_seconds" tmin ]
            [ orderBy "unix_seconds" "asc", orderBy "id" "asc" ]
            pageLimit
            offset
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


queryBody : List E.Value -> List E.Value -> Int -> Int -> E.Value
queryBody whereList orderList limit offset =
    E.object
        [ ( "p_table_name", E.string tableName )
        , ( "where_", E.list identity whereList )
        , ( "order_by", E.list identity orderList )
        , ( "limit_val", E.int limit )
        , ( "offset_val", E.int offset )
        ]


whereGte : String -> Int -> E.Value
whereGte col val =
    E.object
        [ ( "col", E.string col )
        , ( "op", E.string ">=" )
        , ( "val", E.int val )
        , ( "logic", E.string "and" )
        ]


orderBy : String -> String -> E.Value
orderBy col dir =
    E.object [ ( "col", E.string col ), ( "dir", E.string dir ) ]



-- ============================================================
-- DECODER  (null-tolerant: fehlende/None-Werte -> 0)
-- ============================================================


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
