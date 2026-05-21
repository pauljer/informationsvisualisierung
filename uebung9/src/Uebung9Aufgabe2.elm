module Uebung9Aufgabe2 exposing (main)

{-| Übung 9.2 – Flare-Baum als RADIALER Baum

Lädt flare.json (D3-Standardbeispiel, ~252 Knoten) per HTTP und
stellt den Baum radial dar – analog zu
<https://observablehq.com/@d3/radial-tree-component>.

Vorgehen:
  1. `Hierarchy.tidy` (Walker-Algorithmus aus
     `gampleman/elm-visualization`) liefert für jeden Knoten ein
     kartesisches (x, y).
  2. x wird linear auf den Winkel 0…2π abgebildet, y auf den Radius.
  3. Gezeichnet wird per TypedSvg: Knoten als Kreise auf (r·cos α,
     r·sin α), Kanten als gerade Verbindungslinien.
  4. Die Labels stehen radial nach außen; auf der linken Hälfte
     werden sie zusätzlich um 180° gedreht, damit sie nicht auf dem
     Kopf stehen.

Vorlage: https://ellie-app.com/hPNc9LjnMCsa1
-}

import Browser
import Color exposing (Color)
import Hierarchy
import Html exposing (Html)
import Html.Attributes as HA
import Http
import Json.Decode
import Tree exposing (Tree)
import TypedSvg exposing (circle, g, line, svg, text_)
import TypedSvg.Attributes as TA exposing (textAnchor, transform, viewBox)
import TypedSvg.Attributes.InPx as InPx exposing (cx, cy, fontSize, r)
import TypedSvg.Core exposing (Svg, text)
import TypedSvg.Types exposing (AnchorAlignment(..), Paint(..), Transform(..))



-- ============================================================
-- MODEL / HTTP / DECODER
-- ============================================================


type alias Model =
    { tree : Tree String
    , errorMsg : String
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( { tree = Tree.singleton "", errorMsg = "Loading ..." }
    , Http.get
        { url = "https://cors-anywhere.herokuapp.com/https://users.informatik.uni-halle.de/~hinnebur/Lehre/InfoVis/U07/flare.json"
        , expect = Http.expectJson GotFlare treeDecoder
        }
    )


type Msg
    = GotFlare (Result Http.Error (Tree String))


treeDecoder : Json.Decode.Decoder (Tree String)
treeDecoder =
    Json.Decode.map2
        (\name children ->
            case children of
                Nothing ->
                    Tree.tree name []

                Just c ->
                    Tree.tree name c
        )
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.maybe <|
            Json.Decode.field "children" <|
                Json.Decode.list <|
                    Json.Decode.lazy (\_ -> treeDecoder)
        )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotFlare (Ok newTree) ->
            ( { model | tree = newTree, errorMsg = "" }, Cmd.none )

        GotFlare (Err error) ->
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
-- LAYOUT (kartesisch via Hierarchy.tidy, dann radial gemappt)
-- ============================================================


type alias Positioned =
    { x : Float
    , y : Float
    , width : Float
    , height : Float
    , node : String
    }


type alias Polar =
    { node : String
    , angle : Float -- 0 … 2π
    , radius : Float
    , px : Float
    , py : Float
    }


nodeBoxW : Float
nodeBoxW =
    14


nodeBoxH : Float
nodeBoxH =
    1


cartesianLayout : Tree String -> Tree Positioned
cartesianLayout t =
    Hierarchy.tidy
        [ Hierarchy.nodeSize (\_ -> ( nodeBoxW, nodeBoxH ))
        , Hierarchy.parentChildMargin 1
        , Hierarchy.peerMargin 0
        ]
        t


{-| Maximale Tiefe des Baums (0-basiert). -}
treeDepth : Tree a -> Int
treeDepth t =
    case Tree.children t of
        [] ->
            0

        cs ->
            1 + (cs |> List.map treeDepth |> List.maximum |> Maybe.withDefault 0)


{-| Kartesische Layout-Knoten → polare Positionen (Winkel, Radius). -}
toRadial : Float -> Tree String -> List Polar
toRadial outerRadius source =
    let
        laid =
            cartesianLayout source

        nodes =
            Tree.toList laid

        xs =
            List.map (.x >> (\v -> v + nodeBoxW / 2)) nodes

        minX =
            xs |> List.minimum |> Maybe.withDefault 0

        maxX =
            xs |> List.maximum |> Maybe.withDefault 1

        xRange =
            max 1 (maxX - minX)

        depth =
            max 1 (treeDepth source)

        depthOf p =
            -- y wächst pro Ebene um (nodeBoxH + parentChildMargin) = 2
            round (p.y / 2)
    in
    nodes
        |> List.map
            (\p ->
                let
                    centerX =
                        p.x + nodeBoxW / 2

                    a =
                        (centerX - minX) / xRange * 2 * pi

                    rad =
                        toFloat (depthOf p) / toFloat depth * outerRadius
                in
                { node = p.node
                , angle = a
                , radius = rad
                , px = rad * cos a
                , py = rad * sin a
                }
            )


{-| Eltern→Kind-Paare als Polar-Knoten (für Kanten). -}
radialLinks : List Polar -> Tree String -> List ( Polar, Polar )
radialLinks polars source =
    let
        find name =
            polars |> List.filter (\q -> q.node == name) |> List.head

        cartesian =
            cartesianLayout source

        pairs =
            Tree.links cartesian
                |> List.map (\( from, to ) -> ( from.node, to.node ))
    in
    pairs
        |> List.filterMap
            (\( a, b ) ->
                case ( find a, find b ) of
                    ( Just pa, Just pb ) ->
                        Just ( pa, pb )

                    _ ->
                        Nothing
            )



-- ============================================================
-- ZEICHNEN
-- ============================================================


viewEdge : ( Polar, Polar ) -> Svg msg
viewEdge ( a, b ) =
    line
        [ InPx.x1 a.px
        , InPx.y1 a.py
        , InPx.x2 b.px
        , InPx.y2 b.py
        , TA.stroke (Paint (Color.rgb 0.6 0.6 0.6))
        , InPx.strokeWidth 0.5
        ]
        []


{-| Winkel in Grad, normalisiert auf [0, 360). -}
angleDeg : Polar -> Float
angleDeg p =
    let
        d =
            p.angle * 180 / pi
    in
    if d < 0 then
        d + 360

    else
        d


viewNode : Polar -> Svg msg
viewNode p =
    let
        deg =
            angleDeg p

        -- Labels auf der linken Hälfte (90°–270°) um 180° drehen
        flipped =
            deg > 90 && deg < 270

        labelRotation =
            if flipped then
                deg + 180

            else
                deg

        labelOffset =
            if flipped then
                -6

            else
                6

        anchor =
            if flipped then
                AnchorEnd

            else
                AnchorStart
    in
    g []
        [ circle
            [ cx p.px
            , cy p.py
            , r 2.2
            , TA.fill (Paint (Color.rgb 0.2 0.45 0.75))
            , TA.stroke (Paint (Color.rgb 0.1 0.25 0.45))
            , InPx.strokeWidth 0.4
            ]
            []
        , text_
            [ InPx.x 0
            , InPx.y 0
            , fontSize 8
            , textAnchor anchor
            , TA.fill (Paint (Color.rgb 0.1 0.1 0.1))
            , transform
                [ Translate p.px p.py
                , Rotate labelRotation 0 0
                , Translate labelOffset 3
                ]
            ]
            [ text p.node ]
        ]


viewTree : Tree String -> Html msg
viewTree t =
    let
        outerRadius =
            420

        polars =
            toRadial outerRadius t

        edges =
            radialLinks polars t

        size =
            (outerRadius + 120) * 2
    in
    Html.div
        [ HA.style "overflow" "auto"
        , HA.style "border" "1px solid #ccc"
        , HA.style "background" "white"
        , HA.style "max-height" "85vh"
        ]
        [ svg
            [ viewBox (-size / 2) (-size / 2) size size
            , TA.width (TypedSvg.Types.px size)
            , TA.height (TypedSvg.Types.px size)
            ]
            [ g [] (List.map viewEdge edges)
            , g [] (List.map viewNode polars)
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
        [ Html.h2 [] [ Html.text "Übung 9.2 – Flare als radialer Baum" ]
        , Html.p []
            [ Html.text "Daten: flare.json. Layout per "
            , Html.code [] [ Html.text "Hierarchy.tidy" ]
            , Html.text " (x → Winkel, y → Radius), radiale Anordnung wie in "
            , Html.a
                [ HA.href "https://observablehq.com/@d3/radial-tree-component"
                , HA.target "_blank"
                ]
                [ Html.text "D3 radial-tree-component" ]
            , Html.text ". Labels stehen radial nach außen."
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
