module Uebung7Aufgabe4_5 exposing (..)

import Browser
import Color exposing (Color)
import Csv
import Csv.Decode
import Date exposing (Date)
import Dict exposing (Dict)
import Html exposing (Html, div, h3, text)
import Http
import Scale.Color
import Time
import TypedSvg
import TypedSvg.Attributes
import TypedSvg.Core
import TypedSvg.Types

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
    | Success (List ( String, Maybe Float ))
    | Failure Http.Error

type RecordedData data attributes
    = RecordedData PixelPosition data attributes

type alias PixelPosition =
    ( Int, Int )

type alias Level =
    { width : Int, height : Int }

type alias CurrentRecordedData msg =
    RecordedData ( String, Maybe Float ) (List (TypedSvg.Core.Attribute msg))

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

-- PARSING (Aus Aufgabe 3 / 7.4)
csvString_to_data : String -> List ( String, Maybe Float )
csvString_to_data csvRaw =
    Csv.parse csvRaw
        |> Csv.Decode.decodeCsv decodeStockDay
        |> Result.withDefault []

decodeStockDay : Csv.Decode.Decoder (( String, Maybe Float ) -> a) a
decodeStockDay =
    Csv.Decode.map (\a b -> ( a, Just b ))
        (Csv.Decode.field "Date" Ok
            |> Csv.Decode.andMap
                (Csv.Decode.field "Open"
                    (String.toFloat >> Result.fromMaybe "error")
                )
        )

-- TIMELINE ERWEITERUNG (Aus Aufgabe 7.3)
startDate : Date
startDate =
    Date.fromCalendarDate 1980 Time.Dec 23

endDate : Date
endDate =
    Date.fromCalendarDate 2011 Time.Jun 9

holidayDict : Dict String (Maybe Float)
holidayDict =
    Date.range Date.Day 1 startDate endDate
        |> List.map (\d -> ( Date.toIsoString d, Nothing ))
        |> Dict.fromList

expandTimeline : List ( String, Maybe Float ) -> List ( String, Maybe Float )
expandTimeline loadedData =
    let
        loadedDict =
            Dict.fromList loadedData
    in
    Dict.union loadedDict holidayDict
        |> Dict.toList
        |> List.sortWith (\( d1, _ ) ( d2, _ ) -> compare d1 d2)

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
                            Success (expandTimeline (csvString_to_data csvContent))

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
    div [ TypedSvg.Attributes.style "padding: 20px; font-family: sans-serif;" ]
        [ h3 [] [ text "Recursive Pattern Visualisierung" ]
        , case Dict.get "DJ" model.files of
            Just (Success fullData) ->
                renderPattern fullData

            Just Loading ->
                text "Lade echte CSV-Daten vom Server..."

            Just (Failure _) ->
                text "Fehler beim Laden. Proxy aktiv?"

            Nothing ->
                text "Initialisiere..."
        ]

-- CONFIGURATION RECURSIVE PATTERN
w : Float
w = 6

h : Float
h = 6

level : List Level
level =
    [ { width = 1, height = 1 }
    , { width = 3, height = 3 }
    , { width = 2, height = 3 }
    , { width = 4, height = 1 }
    , { width = 1, height = 12 }
    , { width = 5, height = 1 } 
    ]

-- VISUALISIERUNG RENDERN
renderPattern : List ( String, Maybe Float ) -> Html Msg
renderPattern firstData =
    let
        pList =
            createPixelMap ( 0, 0 ) level

        ourData : List (CurrentRecordedData msg)
        ourData =
            List.map2 (\p d -> RecordedData p d []) pList firstData

        -- Alle gültigen Zahlenwerte für die Min/Max-Berechnung extrahieren
        currentData : List Float
        currentData =
            firstData
                |> List.map Tuple.second
                |> List.filterMap identity

        drawPosition : CurrentRecordedData msg -> CurrentRecordedData msg
        drawPosition (RecordedData pixelPosition value _) =
            RecordedData
                pixelPosition
                value
                (drawTuplePosition ( w, h ) level pixelPosition)

        -- KORREKTUR: Mathematisch erzwungene Normalisierung per Hand
        createColor : Maybe Float -> Color
        createColor value =
            case value of
                Just val ->
                    let
                        minVal = List.minimum currentData |> Maybe.withDefault 0.0
                        maxVal = List.maximum currentData |> Maybe.withDefault 1.0
                        
                        range = if maxVal == minVal then 1.0 else maxVal - minVal
                        normalized = (val - minVal) / range
                    in
                    Scale.Color.viridisInterpolator normalized

                Nothing ->
                    Color.rgb255 180 180 180 -- Stabiles Hellgrau für Wochenenden

        createStyle : Maybe Float -> List (TypedSvg.Core.Attribute msg)
        createStyle value =
            [ TypedSvg.Attributes.title (Maybe.withDefault "N.A." (Maybe.map String.fromFloat value))
            , TypedSvg.Attributes.fill (TypedSvg.Types.Paint (createColor value))
            ]

        drawStyle : CurrentRecordedData msg -> CurrentRecordedData msg
        drawStyle (RecordedData pixelPosition ( dateString, value ) attributeList) =
            RecordedData
                pixelPosition
                ( dateString, value )
                (List.append attributeList (createStyle value))

        draw_neu : CurrentRecordedData msg -> TypedSvg.Core.Svg msg
        draw_neu (RecordedData _ _ attributeList) =
            TypedSvg.rect attributeList []

        svgElements =
            List.map (drawPosition >> drawStyle >> draw_neu) ourData
    in
    TypedSvg.svg 
        [ TypedSvg.Attributes.width (TypedSvg.Types.px 1200)
        , TypedSvg.Attributes.height (TypedSvg.Types.px 900)
        , TypedSvg.Attributes.viewBox 0 0 1200 900
        ] 
        [ TypedSvg.g [] svgElements ]


-- =========================================================================
-- MATHEMATISCHE KOORDINATENBERECHNUNG
-- =========================================================================

augmentLevel : List Level -> List Level
augmentLevel list =
    case list of
        [] -> []
        [ x ] -> [ x ]
        x :: y :: rest ->
            { width = x.width * y.width, height = x.height * y.height } 
                :: augmentLevel (y :: rest)

createPixelMap : PixelPosition -> List Level -> List PixelPosition
createPixelMap ( startX, startY ) levels =
    let
        totalPixels =
            List.foldl (\l acc -> acc * l.width * l.height) 1 levels
    in
    List.range 0 (totalPixels - 1)
        |> List.map (\i -> getCoordinates i levels ( startX, startY ))

getCoordinates : Int -> List Level -> PixelPosition -> PixelPosition
getCoordinates index levels ( startX, startY ) =
    let
        computeCoords : Int -> List Level -> ( Int, Int ) -> ( Int, Int ) -> ( Int, Int )
        computeCoords idx list ( currentW, currentH ) ( x, y ) =
            case list of
                [] -> ( x, y )
                lvl :: rest ->
                    let
                        lvlSize = lvl.width * lvl.height
                        lvlIndex = remainderBy lvlSize idx
                        nextIdx = idx // lvlSize

                        lvlX = remainderBy lvl.width lvlIndex
                        lvlY = lvlIndex // lvl.width
                    in
                    computeCoords nextIdx rest ( currentW * lvl.width, currentH * lvl.height ) ( x + lvlX * currentW, y + lvlY * currentH )
    in
    computeCoords index levels ( 1, 1 ) ( startX, startY )

drawTuplePosition : ( Float, Float ) -> List Level -> PixelPosition -> List (TypedSvg.Core.Attribute msg)
drawTuplePosition ( pixelW, pixelH ) levels ( posX, posY ) =
    [ TypedSvg.Attributes.x (TypedSvg.Types.px (toFloat posX * pixelW))
    , TypedSvg.Attributes.y (TypedSvg.Types.px (toFloat posY * pixelH))
    , TypedSvg.Attributes.width (TypedSvg.Types.px pixelW)
    , TypedSvg.Attributes.height (TypedSvg.Types.px pixelH)
    ]