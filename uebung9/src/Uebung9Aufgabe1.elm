module Uebung9Aufgabe1 exposing (main)

{-| Übung 9.1 - Explizite Baumdarstellungen

Zeichnet zwei Bäume mit Hilfe des Walker-Algorithmus aus
`gampleman/elm-visualization` (Modul `Hierarchy`, Funktion `tidy`):

(a) Den binären Baum von Folie 405
(b) Den allgemeinen geordneten Baum von Folie 412
    (Dateisystem-Beispiel: root, home, user1, user2, etc, var, log)

Die Baumstruktur wird mit dem Datentyp `Tree` aus
`gampleman/elm-rosetree` aufgebaut.

-}

import Browser
import Color
import Hierarchy
import Html exposing (Html)
import Html.Attributes as HA
import Tree exposing (Tree)
import TypedSvg exposing (circle, g, line, svg, text_)
import TypedSvg.Attributes as TA exposing (textAnchor, transform, viewBox)
import TypedSvg.Attributes.InPx as InPx
    exposing
        ( cx
        , cy
        , fontSize
        , r
        , x1
        , x2
        , y1
        , y2
        )
import TypedSvg.Core exposing (Svg, text)
import TypedSvg.Types exposing (AnchorAlignment(..), Paint(..), Transform(..))



-- ============================================================
-- BÄUME
-- ============================================================


{-| Binärer Baum von Folie 405.
Beispielbaum mit zwei Ebenen von linken/rechten Kindern.
-}
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


{-| Allgemeiner geordneter Baum von Folie 412.
Dateisystem-Beispiel mit Knoten unterschiedlicher Kinder-Anzahl.
-}
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
-- LAYOUT
-- ============================================================


type alias Positioned =
    { x : Float
    , y : Float
    , width : Float
    , height : Float
    , node : String
    }


{-| Größe eines einzelnen Knotens (Breite, Höhe).
-}
nodeWidth : Float
nodeWidth =
    60


nodeHeight : Float
nodeHeight =
    60


{-| Wendet das Tidy-Layout (Walker-Algorithmus) auf einen Baum an.
-}
layout : Float -> Float -> Tree String -> Tree Positioned
layout w h t =
    Hierarchy.tidy
        [ Hierarchy.nodeSize (\_ -> ( nodeWidth, nodeHeight ))
        , Hierarchy.parentChildMargin 60
        , Hierarchy.peerMargin 20
        , Hierarchy.size w h
        ]
        t



-- ============================================================
-- ZEICHNEN
-- ============================================================


nodeRadius : Float
nodeRadius =
    22


{-| Berechnet aus einem Positioned-Knoten den Mittelpunkt
des Kreises (Position kommt vom Layout als linke obere Ecke
des Boundingbox).
-}
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
                    , TA.stroke (Paint (Color.rgb 0.4 0.4 0.4))
                    , InPx.strokeWidth 1.5
                    ]
                    []
            )
        |> g []


viewNodes : Tree Positioned -> Svg msg
viewNodes t =
    t
        |> Tree.toList
        |> List.map
            (\p ->
                let
                    ( cxv, cyv ) =
                        center p
                in
                g [ transform [ Translate cxv cyv ] ]
                    [ circle
                        [ cx 0
                        , cy 0
                        , r nodeRadius
                        , TA.fill (Paint (Color.rgb 0.85 0.92 1))
                        , TA.stroke (Paint (Color.rgb 0.2 0.3 0.5))
                        , InPx.strokeWidth 1.5
                        ]
                        []
                    , text_
                        [ textAnchor AnchorMiddle
                        , fontSize 14
                        , InPx.y 5
                        , TA.fill (Paint Color.black)
                        ]
                        [ text p.node ]
                    ]
            )
        |> g []


{-| Zeichnet einen einzelnen Baum als SVG mit Titel.
-}
viewTree : String -> Float -> Float -> Tree String -> Html msg
viewTree title w h t =
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
                , viewNodes laid
                ]
            ]
        ]



-- ============================================================
-- MAIN
-- ============================================================


view : () -> Html msg
view _ =
    Html.div
        [ HA.style "font-family" "sans-serif"
        , HA.style "padding" "20px"
        ]
        [ Html.h2 [] [ Html.text "Übung 9.1 – Explizite Baumdarstellungen (Walker-Algorithmus)" ]
        , Html.p []
            [ Html.text
                "Layout berechnet mit Hierarchy.tidy aus gampleman/elm-visualization."
            ]
        , viewTree "(a) Binärer Baum (Folie 405)" 520 380 binaryTree
        , viewTree "(b) Allgemeiner geordneter Baum (Folie 412)" 520 380 generalTree
        ]


main : Program () () ()
main =
    Browser.sandbox
        { init = ()
        , update = \_ m -> m
        , view = view
        }
