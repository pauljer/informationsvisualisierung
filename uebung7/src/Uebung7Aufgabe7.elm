module Uebung7Aufgabe7 exposing (..)

import Browser
import Date exposing (Date)
import Dict exposing (Dict)
import Html exposing (Html, div, h3, option, select, text)
import Html.Attributes
import Html.Events exposing (onInput)
import Http
import Scale.Color
import Time
import TypedSvg
import TypedSvg.Attributes
import TypedSvg.Core
import TypedSvg.Types

import Color exposing (Color)

type alias Model =
    { files : Dict String FileStatus
    , currentScale : ColorScale
    , currentIndex : String
    , weekendFilter : WeekendFilter
    }

type FileStatus
    = Loading
    | Success (List ( String, Maybe Float ))
    | Failure Http.Error

type ColorScale
    = Viridis
    | Magma
    | Inferno

type WeekendFilter
    = IncludeWeekends
    | ExcludeWeekends

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

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }

init : () -> (Model, Cmd Msg)
init _ =
    let
        initialFiles =
            List.map (\name -> ( name, Loading )) indices
                |> Dict.fromList

        commands =
            List.map (\name -> fetchCsv name) indices
    in
    ( { files = initialFiles, currentScale = Viridis, currentIndex = "DJ", weekendFilter = IncludeWeekends }
    , Cmd.batch commands
    )

fetchCsv : String -> Cmd Msg
fetchCsv name =
    Http.get
        { url = baseUrl ++ name ++ ".csv"
        , expect = Http.expectString (GotCsv name)
        }

csvString_to_data : String -> List ( String, Maybe Float )
csvString_to_data csvRaw =
    let
        lines =
            String.lines csvRaw
                |> List.filter (\line -> String.trim line /= "")

        firstLine =
            List.head lines |> Maybe.withDefault ""

        separator =
            if String.contains ";" firstLine then
                ";"

            else
                ","

        rows =
            List.map (\line -> String.split separator line) lines

        headers =
            List.head rows |> Maybe.withDefault []

        dataRows =
            List.drop 1 rows

        dateIdx =
            List.indexedMap (\idx name -> ( String.trim name, idx )) headers
                |> List.filter (\( name, _ ) -> name == "Date")
                |> List.map Tuple.second
                |> List.head
                |> Maybe.withDefault 0

        openIdx =
            List.indexedMap (\idx name -> ( String.trim name, idx )) headers
                |> List.filter (\( name, _ ) -> name == "Open")
                |> List.map Tuple.second
                |> List.head
                |> Maybe.withDefault 1

        parseRow row =
            let
                dateVal =
                    List.drop dateIdx row |> List.head |> Maybe.withDefault "" |> String.trim

                openStr =
                    List.drop openIdx row |> List.head |> Maybe.withDefault "" |> String.trim
            in
            if dateVal == "" then
                Nothing

            else
                Just ( dateVal, String.toFloat openStr )
    in
    List.filterMap parseRow dataRows

startDate : Date
startDate =
    Date.fromCalendarDate 1980 Time.Dec 23

endDate : Date
endDate =
    Date.fromCalendarDate 2011 Time.Jun 9

generateBaseTimeline : WeekendFilter -> List ( String, Maybe Float )
generateBaseTimeline filter =
    let
        allDays =
            Date.range Date.Day 1 startDate endDate

        isWeekend d =
            let
                wdStr =
                    Date.weekday d |> Debug.toString
            in
            wdStr == "Sat" || wdStr == "Sun"

        filteredDays =
            case filter of
                IncludeWeekends ->
                    allDays

                ExcludeWeekends ->
                    List.filter (\d -> not (isWeekend d)) allDays
    in
    List.map (\d -> ( Date.toIsoString d, Nothing )) filteredDays

expandTimeline : WeekendFilter -> List ( String, Maybe Float ) -> List ( String, Maybe Float )
expandTimeline filter loadedData =
    let
        loadedDict =
            Dict.fromList loadedData

        baseDict =
            Dict.fromList (generateBaseTimeline filter)
    in
    Dict.union loadedDict baseDict
        |> Dict.toList
        |> List.sortWith (\( d1, _ ) ( d2, _ ) -> compare d1 d2)

type Msg
    = GotCsv String (Result Http.Error String)
    | ChangeScale String
    | ChangeIndex String
    | ChangeWeekendFilter String

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        GotCsv name result ->
            let
                newStatus =
                    case result of
                        Ok csvContent ->
                            Success (csvString_to_data csvContent)

                        Err error ->
                            Failure error

                updatedFiles =
                    Dict.insert name newStatus model.files
            in
            ( { model | files = updatedFiles }, Cmd.none )

        ChangeScale scaleStr ->
            let
                nextScale =
                    case scaleStr of
                        "Magma" -> Magma
                        "Inferno" -> Inferno
                        _ -> Viridis
            in
            ( { model | currentScale = nextScale }, Cmd.none )

        ChangeIndex indexStr ->
            ( { model | currentIndex = indexStr }, Cmd.none )

        ChangeWeekendFilter filterStr ->
            let
                nextFilter =
                    if filterStr == "Exclude" then
                        ExcludeWeekends

                    else
                        IncludeWeekends
            in
            ( { model | weekendFilter = nextFilter }, Cmd.none )

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none

view : Model -> Html Msg
view model =
    div [ TypedSvg.Attributes.style "padding: 20px; font-family: sans-serif;" ]
        [ h3 [] [ text "Aufgabe 7.7: Optimierte Visualisierung ohne Wochenenden" ]
        , div [ TypedSvg.Attributes.style "margin-bottom: 20px; display: flex; gap: 20px;" ]
            [ div []
                [ text "Index auswählen: "
                , select [ onInput ChangeIndex ]
                    (List.map (\name -> option [ Html.Attributes.value name, Html.Attributes.selected (model.currentIndex == name) ] [ text name ]) indices)
                ]
            , div []
                [ text "Farbskala umschalten: "
                , select [ onInput ChangeScale ]
                    [ option [ Html.Attributes.value "Viridis" ] [ text "Viridis" ]
                    , option [ Html.Attributes.value "Magma" ] [ text "Magma" ]
                    , option [ Html.Attributes.value "Inferno" ] [ text "Inferno" ]
                    ]
                ]
            , div []
                [ text "Wochenenden: "
                , select [ onInput ChangeWeekendFilter ]
                    [ option [ Html.Attributes.value "Include" ] [ text "Mit Wochenenden" ]
                    , option [ Html.Attributes.value "Exclude" ] [ text "Ohne Wochenenden" ]
                    ]
                ]
            ]
        , case Dict.get model.currentIndex model.files of
            Just (Success rawData) ->
                renderPattern model.currentScale (expandTimeline model.weekendFilter rawData)

            Just Loading ->
                text ("Lade CSV-Daten für " ++ model.currentIndex ++ " vom Server...")

            Just (Failure _) ->
                text "Fehler beim Laden. Ist der CORS-Proxy aktiv?"

            Nothing ->
                text "Initialisiere..."
        ]

w : Float
w = 5

h : Float
h = 5

level : List Level
level =
    [ { width = 1, height = 1 }
    , { width = 5, height = 1 }
    , { width = 1, height = 4 }
    , { width = 3, height = 4 }
    , { width = 4, height = 1 }
    , { width = 1, height = 10 }
    ]

renderPattern : ColorScale -> List ( String, Maybe Float ) -> Html Msg
renderPattern activeScale firstData =
    let
        pList =
            createPixelMap ( 0, 0 ) level

        ourData : List (CurrentRecordedData msg)
        ourData =
            List.map2 (\p d -> RecordedData p d []) pList firstData

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

        getInterpolator : Float -> Color
        getInterpolator normalizedVal =
            case activeScale of
                Viridis -> Scale.Color.viridisInterpolator normalizedVal
                Magma -> Scale.Color.magmaInterpolator normalizedVal
                Inferno -> Scale.Color.infernoInterpolator normalizedVal

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
                    getInterpolator normalized

                Nothing ->
                    Color.rgb255 220 220 220

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

augmentLevel : List Level -> List Level
augmentLevel list =
    case list of
        [] -> []
        [ x ] -> [ x ]
        x :: y :: rest ->
            { width = x.width * y.width, height = x.height * y.height } :: augmentLevel (y :: rest)

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