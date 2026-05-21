module Uebung9Aufgabe3 exposing (main)

{-| Übung 9.3 – Länder-Hierarchie als Baum

Lädt countryHierarchy.json (Welt → Kontinente → Subregionen → Länder)
per HTTP, dekodiert sie mit einem eigenen Decoder zu einem
`Tree String` und stellt den Baum mit `Hierarchy.tidy` (Walker-
Algorithmus) aus `gampleman/elm-visualization` dar.

JSON-Format:

    {
      "data": { "id": "World" },
      "children": [
        { "data": { "id": "Asia" },
          "children": [ ... ]
        },
        ...
      ]
    }

Darstellung: horizontaler Baum (Wurzel links, Blätter rechts), damit
die Länder-Namen waagerecht und vollständig lesbar bleiben.
-}

import Browser
import Color exposing (Color)
import Hierarchy
import Html exposing (Html)
import Html.Attributes as HA
import Http
import Json.Decode as D exposing (Decoder)
import Tree exposing (Tree)
import TypedSvg exposing (circle, g, line, svg, text_)
import TypedSvg.Attributes as TA exposing (textAnchor, transform, viewBox)
import TypedSvg.Attributes.InPx as InPx exposing (cx, cy, fontSize, r)
import TypedSvg.Core exposing (Svg, text)
import TypedSvg.Types exposing (AnchorAlignment(..), Paint(..), Transform(..))



-- ============================================================
-- MODEL / HTTP
-- ============================================================


type alias Model =
    { tree : Tree String
    , errorMsg : String
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( { tree = Tree.singleton "", errorMsg = "Loading ..." }
    , Http.get
        { url = "https://cors-anywhere.herokuapp.com/https://gist.githubusercontent.com/curran/1dd7ab046a4ed32380b21e81a38447aa/raw/e04346c8fa26fb1d0f3a866f6ff30ddee74f9ae6/countryHierarchy.json"
        , expect = Http.expectJson GotCountries countryDecoder
        }
    )


type Msg
    = GotCountries (Result Http.Error (Tree String))



-- ============================================================
-- EIGENER DECODER (data.id + optional children)
-- ============================================================


countryDecoder : Decoder (Tree String)
countryDecoder =
    D.map2
        (\name maybeKids ->
            Tree.tree name (Maybe.withDefault [] maybeKids)
        )
        (D.field "data" (D.field "id" D.string))
        (D.maybe
            (D.field "children"
                (D.list (D.lazy (\_ -> countryDecoder)))
            )
        )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotCountries (Ok newTree) ->
            ( { model | tree = newTree, errorMsg = "" }, Cmd.none )

        GotCountries (Err error) ->
            ( { model
                | tree = Tree.singleton ""
                , errorMsg =
                    case error of
                        Http.BadBody m ->
                            "BadBody: " ++ m

                        Http.BadUrl m ->
                            "BadUrl: " ++ m

                        Http.Timeout ->
                            "Timeout"

                        Http.NetworkError ->
                            "NetworkError"

                        Http.BadStatus s ->
                            "BadStatus: " ++ String.fromInt s
              }
            , Cmd.none
            )



-- ============================================================
-- LAYOUT (horizontal: Tiefe nach rechts, x = vertikale Position)
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
    16


nodeBoxH : Float
nodeBoxH =
    220


layout : Tree String -> Tree Positioned
layout t =
    Hierarchy.tidy
        [ Hierarchy.nodeSize (\_ -> ( nodeBoxW, nodeBoxH ))
        , Hierarchy.parentChildMargin 20
        , Hierarchy.peerMargin 2
        ]
        t


{-| Kartesisches Layout (x, y) → horizontal (Tiefe nach rechts):
swap x ↔ y, sodass die Tiefe horizontal verläuft. -}
type alias HPos =
    { node : String, px : Float, py : Float }


toHorizontal : Tree Positioned -> List HPos
toHorizontal t =
    t
        |> Tree.toList
        |> List.map
            (\p ->
                { node = p.node
                , px = p.y -- ursprüngliche Tiefe → x
                , py = p.x + nodeBoxW / 2 -- ursprüngliches x → y
                }
            )


horizontalLinks : Tree Positioned -> List ( HPos, HPos )
horizontalLinks t =
    Tree.links t
        |> List.map
            (\( from, to ) ->
                ( { node = from.node, px = from.y, py = from.x + nodeBoxW / 2 }
                , { node = to.node, px = to.y, py = to.x + nodeBoxW / 2 }
                )
            )



-- ============================================================
-- ZEICHNEN
-- ============================================================


viewEdge : ( HPos, HPos ) -> Svg msg
viewEdge ( a, b ) =
    line
        [ InPx.x1 a.px
        , InPx.y1 a.py
        , InPx.x2 b.px
        , InPx.y2 b.py
        , TA.stroke (Paint (Color.rgb 0.55 0.55 0.55))
        , InPx.strokeWidth 0.6
        ]
        []


{-| Färbung nach Tiefe (anhand x-Position). -}
colorForDepth : Float -> Color
colorForDepth depth =
    case round (depth / nodeBoxH) of
        0 ->
            Color.rgb 0.15 0.15 0.15

        1 ->
            Color.rgb 0.85 0.25 0.25

        2 ->
            Color.rgb 0.20 0.55 0.85

        _ ->
            Color.rgb 0.25 0.65 0.30


viewNode : HPos -> Svg msg
viewNode p =
    let
        col =
            colorForDepth p.px
    in
    g []
        [ circle
            [ cx p.px
            , cy p.py
            , r 3
            , TA.fill (Paint col)
            , TA.stroke (Paint (Color.rgb 0.15 0.15 0.15))
            , InPx.strokeWidth 0.4
            ]
            []
        , text_
            [ InPx.x (p.px + 6)
            , InPx.y (p.py + 3)
            , fontSize 9
            , textAnchor AnchorStart
            , TA.fill (Paint (Color.rgb 0.1 0.1 0.1))
            ]
            [ text p.node ]
        ]


bounds : List HPos -> { minX : Float, minY : Float, maxX : Float, maxY : Float }
bounds nodes =
    { minX = nodes |> List.map .px |> List.minimum |> Maybe.withDefault 0
    , minY = nodes |> List.map .py |> List.minimum |> Maybe.withDefault 0
    , maxX = nodes |> List.map .px |> List.maximum |> Maybe.withDefault 0
    , maxY = nodes |> List.map .py |> List.maximum |> Maybe.withDefault 0
    }


viewTree : Tree String -> Html msg
viewTree t =
    let
        laid =
            layout t

        nodes =
            toHorizontal laid

        edges =
            horizontalLinks laid

        b =
            bounds nodes

        padLeft =
            40

        padRight =
            220

        padY =
            40

        w =
            b.maxX - b.minX + padLeft + padRight

        h =
            b.maxY - b.minY + 2 * padY
    in
    Html.div
        [ HA.style "overflow" "auto"
        , HA.style "border" "1px solid #ccc"
        , HA.style "background" "white"
        , HA.style "max-height" "85vh"
        ]
        [ svg
            [ viewBox (b.minX - padLeft) (b.minY - padY) w h
            , TA.width (TypedSvg.Types.px w)
            , TA.height (TypedSvg.Types.px h)
            ]
            [ g [] (List.map viewEdge edges)
            , g [] (List.map viewNode nodes)
            ]
        ]



-- ============================================================
-- VIEW
-- ============================================================


view : Model -> Html Msg
view model =
    Html.div
        [ HA.style "font-family" "sans-serif"
        , HA.style "padding" "20px"
        ]
        [ Html.h2 [] [ Html.text "Übung 9.3 – Länder-Hierarchie" ]
        , Html.p []
            [ Html.text "Daten: countryHierarchy.json (World → Region → Subregion → Land). "
            , Html.text "Eigener Decoder auf "
            , Html.code [] [ Html.text "data.id" ]
            , Html.text ", Layout per "
            , Html.code [] [ Html.text "Hierarchy.tidy" ]
            , Html.text " aus gampleman/elm-visualization."
            ]
        , if model.errorMsg /= "" then
            Html.p [ HA.style "color" "#a00" ] [ Html.text model.errorMsg ]

          else
            viewTree model.tree
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
