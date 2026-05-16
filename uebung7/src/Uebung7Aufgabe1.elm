module Uebung7Aufgabe1 exposing (..)

import Browser
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
-- Wir speichern den Ladestatus pro Index-Name in einem Dict.
type alias Model =
    { files : Dict String FileStatus }

type FileStatus
    = Loading
    | Success String
    | Failure Http.Error

-- Liste aller Indizes, die geladen werden sollen
indices : List String
indices =
    [ "DJ", "NIKKEI", "HANGSENG", "DAX", "BOVESPA" ]

-- Zuverlässiger CORS-Proxy für Ellie, um die Sperre der Uni-Halle-Server zu umgehen
baseUrl : String
baseUrl =
    "https://cors-anywhere.herokuapp.com/https://users.informatik.uni-halle.de/~hinnebur/Lehre/InfoVis/U06/"

init : () -> (Model, Cmd Msg)
init _ =
    let
        -- 1. Initialisiere das Dict für alle Indizes auf "Loading"
        initialFiles =
            List.map (\name -> ( name, Loading )) indices
                |> Dict.fromList

        -- 2. Erstelle eine Liste von HTTP-Commands mit List.map
        commands =
            List.map (\name -> fetchCsv name) indices
    in
    ( { files = initialFiles }
    , Cmd.batch commands -- 3. Führe alle Anfragen parallel aus
    )

-- Hilfsfunktion zum Erstellen eines einzelnen HTTP-Requests
fetchCsv : String -> Cmd Msg
fetchCsv name =
    Http.get
        { url = baseUrl ++ name ++ ".csv"
        , expect = Http.expectString (GotCsv name)
        }

-- UPDATE
type Msg
    = GotCsv String (Result Http.Error String)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        GotCsv name result ->
            let
                -- Bestimme den neuen Status basierend auf dem HTTP-Resultat
                newStatus =
                    case result of
                        Ok csvContent ->
                            Success csvContent

                        Err error ->
                            Failure error

                -- Aktualisiere das Dict für den spezifischen Index
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

-- Hilfsfunktion, um den Status eines einzelnen Index darzustellen
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
                text "Fehler beim Laden der CSV-Datei über den Proxy."

            Success csvContent ->
                -- Zeigt die ersten 300 Zeichen der CSV zur Kontrolle an
                pre [] [ text (String.left 300 csvContent ++ "\n... [Rest der Datei gekürzt]") ]
        ]