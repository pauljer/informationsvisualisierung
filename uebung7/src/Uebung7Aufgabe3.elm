module Uebung7Aufgabe3 exposing (..)

import Browser
import Csv
import Csv.Decode
import Date exposing (Date)
import Dict exposing (Dict)
import Html exposing (Html, div, h3, pre, text)
import Http
import Time

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
type alias Model =
    { files : Dict String FileStatus }

type FileStatus
    = Loading
    | Success DatasetInfo
    | Failure Http.Error

type alias DatasetInfo =
    { originalLength : Int
    , expandedLength : Int
    , previewData : List ( String, Maybe Float )
    }

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

-- PARSING & DECODING
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

-- DATENVORVERARBEITUNG (Aufgabe 7.3)
startDate : Date
startDate =
    Date.fromCalendarDate 1980 Time.Dec 23

endDate : Date
endDate =
    Date.fromCalendarDate 2011 Time.Jun 9

-- Generiert das Feiertags-Dict mit allen Tagen im Zeitraum auf "Nothing" gesetzt
holidayDict : Dict String (Maybe Float)
holidayDict =
    Date.range Date.Day 1 startDate endDate
        |> List.map (\d -> ( Date.toIsoString d, Nothing ))
        |> Dict.fromList

-- Kombiniert geladene Daten mit der Feiertags-Timeline via Dict.union
expandTimeline : List ( String, Maybe Float ) -> List ( String, Maybe Float )
expandTimeline loadedData =
    let
        loadedDict =
            Dict.fromList loadedData

        combinedDict =
            Dict.union loadedDict holidayDict
    in
    Dict.toList combinedDict
        |> List.reverse

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
                            let
                                rawData =
                                    csvString_to_data csvContent

                                expandedData =
                                    expandTimeline rawData
                            in
                            Success
                                { originalLength = List.length rawData
                                , expandedLength = List.length expandedData
                                , previewData = List.take 10 expandedData
                                }

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
                text "Lade und verarbeite Daten..."

            Failure _ ->
                text "Fehler beim Laden der CSV-Datei."

            Success info ->
                let
                    statsText =
                        "Einträge vor Erweiterung: "
                            ++ String.fromInt info.originalLength
                            ++ "\nEinträge nach Erweiterung: "
                            ++ String.fromInt info.expandedLength
                            ++ "\n\nVorschau der ersten 10 Tage:\n"

                    previewRows =
                        List.map formatRow info.previewData
                            |> String.join "\n"
                in
                pre [] [ text (statsText ++ previewRows) ]
        ]

formatRow : ( String, Maybe Float ) -> String
formatRow ( date, maybeOpen ) =
    let
        openStr =
            case maybeOpen of
                Just value ->
                    String.fromFloat value

                Nothing ->
                    "Fehlend (Wochenende / Feiertag -> Wert ist Nothing)"
    in
    "Datum: " ++ date ++ " | Eröffnungskurs: " ++ openStr