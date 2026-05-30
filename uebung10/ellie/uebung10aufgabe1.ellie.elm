module Main exposing (main)

{-| Übung 10.1 – Einfache Treemap (abwechselnde x/y-Split-Achse).

Lädt `flare.json`, baut daraus einen `Tree (String, Int)`,
summiert die Werte der Blätter in die inneren Knoten und zeichnet
zwei Treemaps: erst den `testTree` aus der Vorlage, dann den
geladenen Flare-Baum. Darunter folgt die textuelle Auflistung des
Baums als verschachtelte `<ul>`.
-}

import Browser
import Color
import Html exposing (Html)
import Html.Attributes as HA
import Http
import Json.Decode as D exposing (Decoder)
import List.Extra
import Scale exposing (ContinuousScale)
import Tree exposing (Tree)
import TypedSvg
import TypedSvg.Attributes
import TypedSvg.Core
import TypedSvg.Types



-- ============================================================
-- MODEL
-- ============================================================


type alias Label =
    ( String, Int )


type alias Model =
    { statusMsg : String
    , testTree : Tree Label
    , tree : Maybe (Tree Label)
    }


type Msg
    = GotFlare (Result Http.Error (Tree Label))



-- ============================================================
-- INIT / UPDATE / SUBSCRIPTIONS / MAIN
-- ============================================================


init : () -> ( Model, Cmd Msg )
init _ =
    ( { statusMsg = "Loading …"
      , testTree = sumUpInnerValues testTree
      , tree = Nothing
      }
    , Http.get
        { url =
            -- Halle-Server liefert keinen CORS-Header → über Proxy holen,
            -- damit Ellie die JSON-Datei laden darf.
            "https://api.allorigins.win/raw?url=https%3A%2F%2Fusers.informatik.uni-halle.de%2F~hinnebur%2FLehre%2FInfoVis%2FU07%2Fflare.json"
        , expect = Http.expectJson GotFlare treeDecoder
        }
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotFlare (Ok t) ->
            ( { model | tree = Just (sumUpInnerValues t), statusMsg = "" }
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
-- DATEN: testTree aus der Vorlage
-- ============================================================


testTree : Tree Label
testTree =
    Tree.tree ( "a", 0 )
        [ Tree.tree ( "b", 0 )
            [ Tree.singleton ( "d", 1 )
            , Tree.singleton ( "e", 2 )
            ]
        , Tree.tree ( "c", 0 )
            [ Tree.tree ( "f", 0 )
                [ Tree.singleton ( "i", 1 )
                , Tree.tree ( "j", 0 )
                    [ Tree.singleton ( "k", 1 )
                    , Tree.singleton ( "l", 1 )
                    ]
                ]
            , Tree.singleton ( "g", 2 )
            , Tree.singleton ( "h", 2 )
            ]
        ]



-- ============================================================
-- JSON-DECODER für flare.json
-- ============================================================


{-| `flare.json` enthält Knoten `{ name, value?, children? }`. Blätter
haben ein `value`, innere Knoten meist keines (deren Wert wird per
`sumUpInnerValues` aus den Blättern aufaddiert).
-}
treeDecoder : Decoder (Tree Label)
treeDecoder =
    D.map3
        (\name maybeValue maybeChildren ->
            let
                value =
                    Maybe.withDefault 0 maybeValue

                children =
                    Maybe.withDefault [] maybeChildren
            in
            Tree.tree ( name, value ) children
        )
        (D.field "name" D.string)
        (D.maybe (D.field "value" D.int))
        (D.maybe (D.field "children" (D.list (D.lazy (\_ -> treeDecoder)))))



-- ============================================================
-- WERTE DER INNEREN KNOTEN AUFADDIEREN
-- ============================================================


{-| Setzt für jeden inneren Knoten den Wert auf die Summe seiner
Kinder-Werte. Blätter bleiben unverändert.
-}
sumUpInnerValues : Tree Label -> Tree Label
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
-- VIEW
-- ============================================================


view : Model -> Html Msg
view model =
    Html.div
        [ HA.style "font-family" "sans-serif", HA.style "padding" "16px" ]
        [ Html.h2 [] [ Html.text "Übung 10.1 – Einfache Treemap" ]
        , Html.h3 [] [ Html.text "testTree" ]
        , drawTreemapSimple model.testTree
        , Html.h3 [] [ Html.text "flare.json" ]
        , case model.tree of
            Nothing ->
                Html.p [] [ Html.text model.statusMsg ]

            Just t ->
                Html.div []
                    [ drawTreemapSimple t
                    , Html.h3 [] [ Html.text "Baum als Liste" ]
                    , Html.ul [] [ treeToListItem t ]
                    ]
        ]


{-| Zeichnet eine Treemap in ein 500×500-SVG mit 20 px Padding.

Beginnt mit `splitX = True`, d. h. die erste Aufteilung erfolgt
entlang der x-Achse. Bei jedem rekursiven Aufruf wird `splitX`
geflippt, sodass sich x- und y-Splits abwechseln.
-}
drawTreemapSimple : Tree Label -> Html msg
drawTreemapSimple t =
    let
        w =
            500

        h =
            500

        padding =
            20
    in
    TypedSvg.svg
        [ TypedSvg.Attributes.viewBox 0 0 (w + 2 * padding) (h + 2 * padding)
        , TypedSvg.Attributes.width (TypedSvg.Types.Percent 50)
        , TypedSvg.Attributes.height (TypedSvg.Types.Percent 50)
        , TypedSvg.Attributes.preserveAspectRatio
            (TypedSvg.Types.Align TypedSvg.Types.ScaleMin TypedSvg.Types.ScaleMin)
            TypedSvg.Types.Slice
        ]
        [ TypedSvg.g
            [ TypedSvg.Attributes.transform
                [ TypedSvg.Types.Translate padding padding ]
            ]
            (drawTreeNode True 0 0 w h t)
        ]


{-| Rekursive Treemap-Funktion.

  - `splitX`  – `True`, wenn die Kinder entlang der x-Achse aufgeteilt
    werden, `False` für die y-Achse. Wird beim Abstieg negiert.
  - `(x, y, w, h)` – aktuelles Rechteck.
  - `t` – aktueller Teilbaum.

Es wird zuerst das Rechteck des Knotens selbst gezeichnet, dann
werden die Kinder proportional zu ihrem (vorher aufaddierten) Wert
entlang der Split-Achse linear skaliert und rekursiv gezeichnet.

-}
drawTreeNode : Bool -> Float -> Float -> Float -> Float -> Tree Label -> List (TypedSvg.Core.Svg msg)
drawTreeNode splitX x y w h t =
    let
        ( _, totalValue ) =
            Tree.label t

        extent =
            ( 0, toFloat totalValue )

        ( splitOffset, splitSize ) =
            if splitX then
                ( x, w )

            else
                ( y, h )

        scale : ContinuousScale Float
        scale =
            Scale.linear ( splitOffset, splitOffset + splitSize ) extent

        childrenSizes : List Float
        childrenSizes =
            List.map (toFloat << Tuple.second << Tree.label) (Tree.children t)

        {- kumulierte Startpositionen entlang der Split-Achse. -}
        childrenCumSum : List Float
        childrenCumSum =
            List.Extra.scanl (+) 0 childrenSizes

        rectSvg =
            TypedSvg.rect
                [ TypedSvg.Attributes.x (TypedSvg.Types.px x)
                , TypedSvg.Attributes.y (TypedSvg.Types.px y)
                , TypedSvg.Attributes.width (TypedSvg.Types.px w)
                , TypedSvg.Attributes.height (TypedSvg.Types.px h)
                , TypedSvg.Attributes.stroke (TypedSvg.Types.Paint Color.black)
                , TypedSvg.Attributes.fill TypedSvg.Types.PaintNone
                ]
                []

        drawChild childPos childSize childNode =
            let
                pos =
                    Scale.convert scale childPos

                size =
                    Scale.convert scale childSize - splitOffset
            in
            if splitX then
                drawTreeNode (not splitX) pos y size h childNode

            else
                drawTreeNode (not splitX) x pos w size childNode
    in
    rectSvg
        :: List.concat
            (List.map3 drawChild
                childrenCumSum
                childrenSizes
                (Tree.children t)
            )



-- ============================================================
-- BAUM ALS VERSCHACHTELTE LISTE (zur Kontrolle)
-- ============================================================


treeToListItem : Tree Label -> Html msg
treeToListItem t =
    let
        ( name, value ) =
            Tree.label t

        kids =
            Tree.children t

        label =
            Html.text (name ++ " " ++ String.fromInt value)
    in
    case kids of
        [] ->
            Html.li [] [ label ]

        _ ->
            Html.li []
                [ label
                , Html.ul [] (List.map treeToListItem kids)
                ]
