module Main exposing (main)

{-| Übung 10.2 – Squarified Treemap der Flare-Daten.

Nutzt `Hierarchy.treemap` aus `gampleman/elm-visualization` mit dem
`squarify`-Tiling. Es werden zwei Treemaps gezeichnet: einmal werden
die Teilbäume ab der ersten Ebene unter der Wurzel eingefärbt
(wie im Originalbeispiel), zusätzlich werden die Teilbäume ab der
zweiten Ebene unter der Wurzel verschieden eingefärbt.
-}

import Browser
import Color exposing (Color)
import Dict exposing (Dict)
import Hierarchy
import Html exposing (Html)
import Html.Attributes as HA
import Http
import Json.Decode as D exposing (Decoder)
import Scale.Color
import Tree exposing (Tree)
import TypedSvg
import TypedSvg.Attributes
import TypedSvg.Attributes.InPx as InPx
import TypedSvg.Core
import TypedSvg.Types



-- ============================================================
-- MODEL
-- ============================================================


type alias Node =
    { name : String
    , value : Int
    , group1 : String
    , group2 : String
    }


type alias Model =
    { statusMsg : String
    , tree : Maybe (Tree Node)
    }


type Msg
    = GotFlare (Result Http.Error (Tree ( String, Int )))


init : () -> ( Model, Cmd Msg )
init _ =
    ( { statusMsg = "Loading …", tree = Nothing }
    , Http.get
        { url =
            -- Halle-Server liefert keinen CORS-Header → über Proxy holen.
            "https://api.allorigins.win/raw?url=https%3A%2F%2Fusers.informatik.uni-halle.de%2F~hinnebur%2FLehre%2FInfoVis%2FU07%2Fflare.json"
        , expect = Http.expectJson GotFlare treeDecoder
        }
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotFlare (Ok t) ->
            ( { model | tree = Just (annotate 0 "" "" (sumUpInnerValues t)), statusMsg = "" }
            , Cmd.none
            )

        GotFlare (Err err) ->
            ( { model | statusMsg = "Fehler beim Laden: " ++ httpErrToString err }
            , Cmd.none
            )


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = \_ -> Sub.none
        , view = view
        }


httpErrToString : Http.Error -> String
httpErrToString err =
    case err of
        Http.BadUrl u ->
            "BadUrl " ++ u

        Http.Timeout ->
            "Timeout"

        Http.NetworkError ->
            "NetworkError"

        Http.BadStatus s ->
            "BadStatus " ++ String.fromInt s

        Http.BadBody b ->
            "BadBody " ++ b



-- ============================================================
-- JSON-DECODER
-- ============================================================


treeDecoder : Decoder (Tree ( String, Int ))
treeDecoder =
    D.map3
        (\name maybeValue maybeChildren ->
            Tree.tree ( name, Maybe.withDefault 0 maybeValue )
                (Maybe.withDefault [] maybeChildren)
        )
        (D.field "name" D.string)
        (D.maybe (D.field "value" D.int))
        (D.maybe (D.field "children" (D.list (D.lazy (\_ -> treeDecoder)))))


sumUpInnerValues : Tree ( String, Int ) -> Tree ( String, Int )
sumUpInnerValues t =
    let
        children =
            List.map sumUpInnerValues (Tree.children t)

        ( name, ownValue ) =
            Tree.label t
    in
    case children of
        [] ->
            Tree.singleton ( name, ownValue )

        _ ->
            let
                sum =
                    List.sum (List.map (Tuple.second << Tree.label) children)
            in
            Tree.tree ( name, sum ) children



-- ============================================================
-- ANNOTATION: jedem Knoten den Namen seines Vorfahren auf
-- Ebene 1 (group1) bzw. Ebene 2 (group2) zuordnen.
-- ============================================================


annotate : Int -> String -> String -> Tree ( String, Int ) -> Tree Node
annotate depth g1 g2 t =
    let
        ( name, value ) =
            Tree.label t

        newG1 =
            if depth == 1 then
                name

            else
                g1

        newG2 =
            if depth == 2 then
                name

            else
                g2
    in
    Tree.tree
        { name = name, value = value, group1 = newG1, group2 = newG2 }
        (List.map (annotate (depth + 1) newG1 newG2) (Tree.children t))



-- ============================================================
-- VIEW
-- ============================================================


view : Model -> Html Msg
view model =
    Html.div
        [ HA.style "font-family" "sans-serif", HA.style "padding" "16px" ]
        [ Html.h2 [] [ Html.text "Übung 10.2 – Squarified Treemap" ]
        , case model.tree of
            Nothing ->
                Html.p [] [ Html.text model.statusMsg ]

            Just t ->
                Html.div []
                    [ Html.h3 [] [ Html.text "Färbung nach Teilbäumen ab Ebene 1 unter der Wurzel" ]
                    , drawTreemap .group1 t
                    , Html.h3 [] [ Html.text "Färbung nach Teilbäumen ab Ebene 2 unter der Wurzel" ]
                    , drawTreemap .group2 t
                    ]
        ]


treeWidth : Float
treeWidth =
    960


treeHeight : Float
treeHeight =
    500


{-| Zeichnet eine Squarified Treemap und färbt die Blätter über die
übergebene Gruppenfunktion ein (`.group1` oder `.group2`).
-}
drawTreemap : (Node -> String) -> Tree Node -> Html msg
drawTreemap getGroup t =
    let
        groupNames =
            collectGroups getGroup t

        colorFor =
            colorScale groupNames

        layouted =
            t
                |> Tree.sortWith (\_ a b -> compare (Tree.label b).value (Tree.label a).value)
                |> Hierarchy.treemap
                    [ Hierarchy.tile Hierarchy.squarify
                    , Hierarchy.padding (always 1)
                    , Hierarchy.size treeWidth treeHeight
                    ]
                    (.value >> toFloat)
    in
    TypedSvg.svg
        [ TypedSvg.Attributes.viewBox 0 0 treeWidth treeHeight
        , TypedSvg.Attributes.width (TypedSvg.Types.Percent 100)
        , TypedSvg.Attributes.preserveAspectRatio
            (TypedSvg.Types.Align TypedSvg.Types.ScaleMid TypedSvg.Types.ScaleMid)
            TypedSvg.Types.Meet
        ]
        (layouted
            |> Tree.leaves
            |> List.map
                (\item ->
                    TypedSvg.g
                        [ TypedSvg.Attributes.transform
                            [ TypedSvg.Types.Translate item.x item.y ]
                        ]
                        [ TypedSvg.title []
                            [ TypedSvg.Core.text
                                (item.node.name
                                    ++ " ("
                                    ++ String.fromInt item.node.value
                                    ++ ")"
                                )
                            ]
                        , TypedSvg.rect
                            [ InPx.width item.width
                            , InPx.height item.height
                            , TypedSvg.Attributes.fill
                                (TypedSvg.Types.Paint (colorFor (getGroup item.node)))
                            , TypedSvg.Attributes.stroke
                                (TypedSvg.Types.Paint Color.white)
                            ]
                            []
                        ]
                )
        )



-- ============================================================
-- FARB-ZUORDNUNG
-- ============================================================


{-| Sammelt alle (nicht-leeren) Gruppen-Namen in Reihenfolge ihres
ersten Auftretens.
-}
collectGroups : (Node -> String) -> Tree Node -> List String
collectGroups getGroup t =
    let
        step n acc =
            let
                g =
                    getGroup n
            in
            if g == "" || List.member g acc then
                acc

            else
                g :: acc
    in
    t
        |> Tree.foldl step []
        |> List.reverse


{-| Konkatenierte kategorische Paletten, damit auch viele Gruppen
ohne Farbwiederholung dargestellt werden können. Reicht das nicht,
wird zyklisch wiederverwendet.
-}
palette : List Color
palette =
    Scale.Color.tableau10
        ++ Scale.Color.paired
        ++ Scale.Color.set1
        ++ Scale.Color.set2
        ++ Scale.Color.category10
        ++ Scale.Color.accent


{-| Baut aus den Gruppen-Namen eine Funktion `String -> Color`.
-}
colorScale : List String -> String -> Color
colorScale groups =
    let
        n =
            List.length palette

        dict : Dict String Color
        dict =
            groups
                |> List.indexedMap
                    (\i name ->
                        ( name
                        , palette
                            |> List.drop (modBy (max 1 n) i)
                            |> List.head
                            |> Maybe.withDefault Color.lightGray
                        )
                    )
                |> Dict.fromList
    in
    \name ->
        Dict.get name dict |> Maybe.withDefault Color.lightGray
