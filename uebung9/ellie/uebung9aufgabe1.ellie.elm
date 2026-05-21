module Main exposing (main)

{-| Übung 9.1 – Explizite Baumdarstellungen (Ellie-Version)

Zeichnet zwei Bäume mit Hilfe des Walker-Algorithmus aus
`gampleman/elm-visualization` (Modul `Hierarchy`, Funktion `tidy`):

(a) Den binären Baum von Folie 405
(b) Den allgemeinen geordneten Baum von Folie 412

Die Knoten werden als kleine graue Kreise gezeichnet. Beim Hover
über einen Knoten erscheint die Bezeichnung in einer dem Knoten
zugeordneten Farbe.

-}

import Browser
import Color exposing (Color)
import Hierarchy
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events
import Tree exposing (Tree)
import TypedSvg exposing (circle, g, line, rect, svg, text_)
import TypedSvg.Attributes as TA exposing (textAnchor, transform, viewBox)
import TypedSvg.Attributes.InPx as InPx
    exposing
        ( cx
        , cy
        , fontSize
        , height
        , r
        , rx
        , width
        , x
        , y
        )
import TypedSvg.Core exposing (Svg, text)
import TypedSvg.Types exposing (AnchorAlignment(..), Paint(..), Transform(..))



-- ============================================================
-- BÄUME
-- ============================================================


binaryTree : Tree String
binaryTree =
    Tree.tree "A"
        [ Tree.tree "B"
            [ Tree.tree "D"
                [ Tree.singleton "H"
                , Tree.singleton "I"
                ]
            , Tree.tree "E"
                [ Tree.singleton "J"
                , Tree.singleton "K"
                ]
            ]
        , Tree.tree "C"
            [ Tree.tree "F"
                [ Tree.singleton "L"
                , Tree.singleton "M"
                ]
            , Tree.tree "G"
                [ Tree.singleton "N"
                , Tree.singleton "O"
                ]
            ]
        ]


generalTree : Tree String
generalTree =
    Tree.tree "root"
        [ Tree.tree "home"
            [ Tree.singleton "user1"
            , Tree.singleton "user2"
            ]
        , Tree.singleton "etc"
        , Tree.tree "var"
            [ Tree.singleton "log" ]
        ]



-- ============================================================
-- LAYOUT (Walker-Algorithmus über Hierarchy.tidy)
-- ============================================================


type alias Positioned =
    { x : Float
    , y : Float
    , width : Float
    , height : Float
    , node : String
    }


nodeBoxW : Float
nodeBoxW =
    60


nodeBoxH : Float
nodeBoxH =
    60


layout : Float -> Float -> Tree String -> Tree Positioned
layout w h t =
    Hierarchy.tidy
        [ Hierarchy.nodeSize (\_ -> ( nodeBoxW, nodeBoxH ))
        , Hierarchy.parentChildMargin 60
        , Hierarchy.peerMargin 20
        , Hierarchy.size w h
        ]
        t



-- ============================================================
-- FARBE PRO KNOTEN
-- ============================================================


palette : List Color
palette =
    [ Color.rgb 0.85 0.20 0.20
    , Color.rgb 0.20 0.55 0.85
    , Color.rgb 0.25 0.65 0.30
    , Color.rgb 0.85 0.50 0.10
    , Color.rgb 0.55 0.35 0.75
    , Color.rgb 0.80 0.60 0.10
    , Color.rgb 0.20 0.65 0.65
    , Color.rgb 0.75 0.30 0.55
    ]


colorFor : String -> Color
colorFor name =
    let
        sum =
            name
                |> String.toList
                |> List.map Char.toCode
                |> List.sum

        n =
            List.length palette

        idx =
            modBy n sum
    in
    palette
        |> List.drop idx
        |> List.head
        |> Maybe.withDefault (Color.rgb 0.4 0.4 0.4)



-- ============================================================
-- MODEL / UPDATE
-- ============================================================


type alias Model =
    { hovered : Maybe String }


init : Model
init =
    { hovered = Nothing }


type Msg
    = Hover String
    | Unhover


update : Msg -> Model -> Model
update msg model =
    case msg of
        Hover name ->
            { model | hovered = Just name }

        Unhover ->
            { model | hovered = Nothing }



-- ============================================================
-- ZEICHNEN
-- ============================================================


nodeRadius : Float
nodeRadius =
    11


center : Positioned -> ( Float, Float )
center p =
    ( p.x + p.width / 2, p.y + p.height / 2 )


viewEdges : Tree Positioned -> Svg msg
viewEdges t =
    t
        |> Tree.links
        |> List.map
            (\( from, to ) ->
                let
                    ( fx, fy ) =
                        center from

                    ( tx, ty ) =
                        center to
                in
                line
                    [ InPx.x1 fx
                    , InPx.y1 fy
                    , InPx.x2 tx
                    , InPx.y2 ty
                    , TA.stroke (Paint (Color.rgb 0.45 0.45 0.45))
                    , InPx.strokeWidth 1.6
                    ]
                    []
            )
        |> g []


viewNode : Maybe String -> Positioned -> Svg Msg
viewNode hovered p =
    let
        ( cxv, cyv ) =
            center p

        isHovered =
            hovered == Just p.node

        fillColor =
            if isHovered then
                colorFor p.node

            else
                Color.rgb 0.5 0.5 0.5
    in
    circle
        [ cx cxv
        , cy cyv
        , r nodeRadius
        , TA.fill (Paint fillColor)
        , TA.stroke (Paint (Color.rgb 0.3 0.3 0.3))
        , InPx.strokeWidth 1
        , TA.cursor TypedSvg.Types.CursorPointer
        , Html.Events.onMouseOver (Hover p.node)
        , Html.Events.onMouseOut Unhover
        ]
        []


viewHoverLabel : Maybe String -> Tree Positioned -> Svg msg
viewHoverLabel hovered laid =
    case hovered of
        Nothing ->
            g [] []

        Just name ->
            case
                laid
                    |> Tree.toList
                    |> List.filter (\p -> p.node == name)
                    |> List.head
            of
                Nothing ->
                    g [] []

                Just p ->
                    let
                        ( cxv, _ ) =
                            center p

                        ( _, cyv ) =
                            center p

                        color =
                            colorFor name

                        labelW =
                            toFloat (String.length name) * 8.5 + 14

                        labelH =
                            22

                        bx =
                            cxv - labelW / 2

                        by =
                            cyv - nodeRadius - labelH - 6
                    in
                    g []
                        [ rect
                            [ x bx
                            , y by
                            , width labelW
                            , height labelH
                            , rx 4
                            , TA.fill (Paint Color.white)
                            , TA.stroke (Paint color)
                            , InPx.strokeWidth 1.5
                            ]
                            []
                        , text_
                            [ textAnchor AnchorMiddle
                            , fontSize 13
                            , InPx.x cxv
                            , InPx.y (by + 15)
                            , TA.fill (Paint color)
                            , TA.fontWeight TypedSvg.Types.FontWeightBold
                            ]
                            [ text name ]
                        ]


viewNodes : Maybe String -> Tree Positioned -> Svg Msg
viewNodes hovered t =
    t
        |> Tree.toList
        |> List.map (viewNode hovered)
        |> g []


viewTree : Maybe String -> String -> Float -> Float -> Tree String -> Html Msg
viewTree hovered title w h t =
    let
        padding =
            40

        laid =
            layout (w - 2 * padding) (h - 2 * padding) t
    in
    Html.div
        [ HA.style "display" "inline-block"
        , HA.style "vertical-align" "top"
        , HA.style "margin" "10px"
        , HA.style "border" "1px solid #ccc"
        , HA.style "padding" "10px"
        , HA.style "background" "white"
        ]
        [ Html.h3 [ HA.style "margin" "0 0 10px 0" ] [ Html.text title ]
        , svg
            [ viewBox 0 0 w h
            , TA.width (TypedSvg.Types.px w)
            , TA.height (TypedSvg.Types.px h)
            ]
            [ g [ transform [ Translate padding padding ] ]
                [ viewEdges laid
                , viewNodes hovered laid
                , viewHoverLabel hovered laid
                ]
            ]
        ]



-- ============================================================
-- MAIN
-- ============================================================


view : Model -> Html Msg
view model =
    Html.div
        [ HA.style "font-family" "sans-serif"
        , HA.style "padding" "20px"
        ]
        [ Html.h2 [] [ Html.text "Übung 9.1 – Explizite Baumdarstellungen (Walker-Algorithmus)" ]
        , Html.p []
            [ Html.text
                "Layout berechnet mit Hierarchy.tidy aus gampleman/elm-visualization. "
            , Html.text "Bewege die Maus über einen Knoten, um den Namen einzublenden."
            ]
        , viewTree model.hovered "(a) Binärer Baum (Folie 405)" 520 380 binaryTree
        , viewTree model.hovered "(b) Allgemeiner geordneter Baum (Folie 412)" 520 380 generalTree
        , viewDebug "testTree" generalTree
        ]



-- ============================================================
-- DEBUG-AUSGABE (Child/Parent + Layout-Koordinaten)
-- ============================================================


{-| Liste aller (Kind, Maybe Elternteil)-Paare in DFS-Reihenfolge. -}
parentChildPairs : Tree String -> List ( String, Maybe String )
parentChildPairs t =
    let
        go parent node acc =
            let
                label =
                    Tree.label node

                acc1 =
                    ( label, parent ) :: acc
            in
            List.foldl (go (Just label)) acc1 (Tree.children node)
    in
    List.reverse (go Nothing t [])


{-| Gitter-Koordinaten: x als Spalten-Index nach Sortierung, y als Tiefe. -}
layoutCoords : Tree String -> List ( String, Int, Int )
layoutCoords t =
    let
        laid =
            layout (520 - 80) (380 - 80) t

        nodes =
            Tree.toList laid

        depthOf p =
            round (p.y / (nodeBoxH + 20))

        sortedByX =
            nodes
                |> List.sortBy .x

        xs =
            sortedByX
                |> List.map .x

        minX =
            xs |> List.minimum |> Maybe.withDefault 0

        step =
            (nodeBoxW + 20) / 2
    in
    nodes
        |> List.map
            (\p ->
                let
                    gridX =
                        round ((p.x - minX) / step) - 2
                in
                ( p.node, gridX, depthOf p + 1 )
            )
        |> List.sortBy (\( n, _, _ ) -> n)


viewDebug : String -> Tree String -> Html msg
viewDebug name t =
    let
        pairs =
            parentChildPairs t

        coords =
            layoutCoords t

        pairItem ( child, parent ) =
            Html.li []
                [ Html.text
                    ("( "
                        ++ child
                        ++ ", "
                        ++ (case parent of
                                Just p ->
                                    p

                                Nothing ->
                                    "Nothing"
                           )
                        ++ ")"
                    )
                ]

        coordItem ( n, gx, gy ) =
            Html.li []
                [ Html.text
                    ("("
                        ++ n
                        ++ ", x="
                        ++ String.fromInt gx
                        ++ ",y="
                        ++ String.fromInt gy
                        ++ ")"
                    )
                ]
    in
    Html.div [ HA.style "margin-top" "30px", HA.style "font-family" "serif" ]
        [ Html.div [] [ Html.text ("Converted " ++ name ++ " (Child, Maybe Parent)") ]
        , Html.ul [] (List.map pairItem pairs)
        , Html.div [] [ Html.text "Tree Layout" ]
        , Html.ul [] (List.map coordItem coords)
        ]


main : Program () Model Msg
main =
    Browser.sandbox
        { init = init
        , update = update
        , view = view
        }
