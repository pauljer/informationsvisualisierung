module Uebung7Aufgabe2 exposing (..)

import Browser
import Csv
import Csv.Decode
import Dict exposing (Dict)
import Html exposing (Html, div, h3, pre, text)
import Http

-- MAIN
main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }

-- MODEL
-- Wir speichern nun eine Liste von (String, Maybe Float) anstelle des rohen CSV-Strings.
type alias Model =
    { files : Dict String FileStatus }

type FileStatus
    = Loading
    | Success (List ( String, Maybe Float ))
    | Failure Http.Error

indices : List String
indices =
    [ "DJ", "NIKKEI", "HANGSENG", "DAX", "BOVESPA" ]

baseUrl : String
baseUrl =
    "https://cors-anywhere.herokuapp.com/https://users.informatik.uni-halle.de/~hinnebur/Lehre/InfoVis/U06/"

init : () -> (Model, Cmd Msg)
init _ =
    let
        initialFiles =
            List.map (\name -> ( name, Loading )) indices
                |> Dict.fromList

        commands =
            List.map (\name -> fetchCsv name) indices
    in
    ( { files = initialFiles }
    , Cmd.batch commands
    )

fetchCsv : String -> Cmd Msg
fetchCsv name =
    Http.get
        { url = baseUrl ++ name ++ ".csv"
        , expect = Http.expectString (GotCsv name)
        }

-- PARSING & DECODING (Aus der Aufgabenstellung)
csvString_to_data : String -> List ( String, Maybe Float )
csvString_to_data csvRaw =
    Csv.parse csvRaw
        |> Csv.Decode.decodeCsv decodeStockDay
        |> Result.toMaybe
        |> Maybe.withDefault []

decodeStockDay : Csv.Decode.Decoder (( String, Maybe Float ) -> a) a
decodeStockDay =
    Csv.Decode.map (\a b -> ( a, Just b ))
        (Csv.Decode.field "Date" Ok
            |> Csv.Decode.andMap
                (Csv.Decode.field "Open"
                    (String.toFloat >> Result.fromMaybe "error parsing string")
                )
        )

-- UPDATE
type Msg
    = GotCsv String (Result Http.Error String)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        GotCsv name result ->
            let
                newStatus =
                    case result of
                        Ok csvContent ->
                            -- Hier parsen wir den CSV-String direkt nach dem Laden in unsere Datenstruktur
                            Success (csvString_to_data csvContent)

                        Err error ->
                            Failure error

                updatedFiles =
                    Dict.insert name newStatus model.files
            in
            ( { model | files = updatedFiles }, Cmd.none )

-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none

-- VIEW
view : Model -> Html Msg
view model =
    div []
        (List.map (viewFileStatus model.files) indices)

viewFileStatus : Dict String FileStatus -> String -> Html Msg
viewFileStatus files name =
    let
        status =
            Dict.get name files |> Maybe.withDefault Loading
    in
    div []
        [ h3 [] [ text ("Index: " ++ name) ]
        , case status of
            Loading ->
                text "Lade Daten über Proxy..."

            Failure _ ->
                text "Fehler beim Laden der CSV-Datei."

            Success dataList ->
                -- Wir nehmen die ersten 5 Einträge zur Vorschau und formatieren sie lesbar
                let
                    previewRows =
                        List.take 10 dataList
                            |> List.map formatRow
                            |> String.join "\n"
                in
                pre [] [ text (previewRows ++ "\n... [Rest der Liste gekürzt]") ]
        ]

-- Hilfsfunktion zur Formatierung eines einzelnen Datensatzes
formatRow : ( String, Maybe Float ) -> String
formatRow ( date, maybeOpen ) =
    let
        openStr =
            case maybeOpen of
                Just value ->
                    String.fromFloat value

                Nothing ->
                    "Fehlend / Fehler beim Parsen des Kurses"
    in
    "Datum: " ++ date ++ " | Eröffnungskurs: " ++ openStr