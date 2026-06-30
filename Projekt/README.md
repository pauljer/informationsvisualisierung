# Projekt: EnergyCharts – Visual Analytics (Elm)

Interaktive Elm-Anwendung mit **drei Visualisierungstechniken aus drei
verschiedenen Bereichen**, anwendungsgetrieben aus den EnergyCharts-Daten
(Tabelle `energycharts_publicpower`) abgeleitet. Alle drei Sichten stammen aus
**einer** Abfrage (ein Land/Region, ein Zeitfenster) und sind interaktiv
**verbunden** (Visual Analytics).

## Die drei Sichten (und warum genau diese)

Ausgangspunkt war die Anwendung – das Verstehen eines Stromsystems –, nicht die
Technik. Daraus ergeben sich drei Fragen, die je eine Technik aus einem anderen
Bereich nahelegen:

| # | Frage an die Anwendung | Technik | Bereich |
|---|---|---|---|
| 1 | Wie setzt sich die Erzeugung über die Zeit zusammen, und wann deckt sie die Last? | **Gestapeltes Flächendiagramm** mit überlagerter Last-Linie | *Zeitreihen* |
| 2 | Welche **täglichen/saisonalen Rhythmen** hat die (Solar-)Erzeugung? | **Stunde×Tag-Heatmap** (jede Zelle = ein Pixel, Farbe = Wert) | *Pixel-orientiert* |
| 3 | Welchen **Energieanteil** hat jede Quelle (Erneuerbar vs. Konventionell)? | **Treemap** der Erzeugungs­struktur | *Bäume* |

Bewusst **nicht** die „einfache" Standard­kombination (Scatterplot + parallele
Koordinaten + Baum): Stapelung zeigt Zusammensetzung *und* Summe gleichzeitig;
pixel-orientierte Heatmaps sind das Mittel der Wahl für dichte, **periodische**
Zeitdaten (Solar folgt Tag-/Jahreszyklen); die Treemap nutzt die natürliche
Hierarchie Quelle → Gruppe → Gesamt.

## Verbundene Interaktion

- **Land / Zeitfenster** (7/14/30 Tage) → eine Abfrage aktualisiert alle drei Sichten.
- **Hover** auf Legende, Flächen-Band oder Treemap-Kachel hebt dieselbe Quelle
  überall hervor (gemeinsamer Zustand).
- **Klick auf einen Tag** in der Heatmap fokussiert Flächendiagramm (Markierung)
  und Treemap (nur dieser Tag). Erneuter Klick hebt den Fokus auf.
- **Heatmap-Metrik** umschaltbar: Solar-Anteil / Erneuerbaren-Anteil / Last.

## Setup & Start

### 1. Proxy starten (CORS-Umgehung + Token)

```bash
cd Projekt
node proxy.js     # läuft auf http://localhost:3001
```

Der Proxy holt das Bearer-Token selbst (`POST /token`, Basic-Auth `demo_user:hallo`)
und leitet die Tabellen­abfragen weiter (`POST /proxy`). So ist **kein manuelles
Token-Einfügen** nötig.

### 2. Kompilieren

```bash
elm make src/Main.elm --output=elm.js
```

### 3. Im Browser öffnen

```bash
open index.html
```

Dann auf **„🔗 Verbinden"** klicken (oder optional ein Token aus dem Terminal
ins Feld einfügen). Daten werden geladen, die drei Diagramme erscheinen.

## Datenquelle & API-Eigenheiten

- Tabelle `energycharts_publicpower`: pro Zeile `unix_seconds`, `country_id`,
  `load_in_gw` und ~18 Quellen-Spalten in GW. ~32 Länder + Aggregat `all`/`eu`,
  stündlich bzw. 15-minütig.
- **Zwei API-Eigenheiten** bestimmen das Laden (selbst gemessen):
  1. Filter auf `country_id` (String) funktionieren serverseitig **nicht**.
  2. Abfragen mit **leerem** `where_` materialisieren die ganze Tabelle (~15 s);
     mit numerischem Filter sind sie schnell (<1 s).
- **Schneller Lade-Trick:** Die Zeilen liegen pro Land in **zusammenhängenden
  `id`-Blöcken** (zeitlich aufsteigend). Eine gefilterte Abfrage der jüngsten
  Daten (`unix_seconds > jetzt−90 Tage`) liefert zugleich `tmax` und je Land die
  größte `id` (Block-Obergrenze). Danach wird ein Land per **numerischem
  `id`-Bereich** `(lo, hi]` + `unix_seconds >= tmin` in **einer** kleinen Abfrage
  geladen (≈170–2900 Zeilen). Ergebnis: erste Diagramme in ~2–3 s,
  Land-/Fenster-Wechsel in <1 s (statt zehntausender Zeilen über viele Seiten).
- **Hinweis zur Entwicklungs-DB:** In der bereitgestellten Demo-DB sind mehrere
  Länder (u. a. **DE**, AT, NL, ES) nur **Null-Platzhalter**. Befüllt sind das
  Europa-Aggregat **`all`** (Voreinstellung) sowie z. B. **FR, IT, PL, CZ, CH,
  BE, SE, NO, DK**. Null-/Platzhalter-Zeilen werden ausgeblendet; ein leeres Land
  zeigt einen Hinweis. In der vollständigen DB funktioniert auch DE.

## Projektstruktur

```
Projekt/
├── proxy.js                 Node-Proxy: /token (mint) + /proxy (weiterleiten)
├── index.html               Lädt elm.js, startet Elm.Main
├── elm.json                 Abhängigkeiten (elm-visualization, typed-svg, rosetree …)
└── src/
    ├── Main.elm             TEA: Steuerung, Laden/Pagination, Linked-View-Zustand, Layout
    ├── Api.elm              Token, schnelles id-Block-Laden, null-toleranter Decoder
    ├── Energy.elm           Domäne: Bänder/Palette, Metriken, Stunden-Binning, Treemap-Summen
    └── Chart/
        ├── StackedArea.elm  Sicht 1 – Zeitreihen (Shape.stack/area, Path, Scale, Axis)
        ├── Heatmap.elm      Sicht 2 – Pixel (Raster, Scale.Color)
        └── Treemap.elm      Sicht 3 – Bäume (Hierarchy.treemap squarify)
```

## Verwendete Bibliotheken (aus den Übungen)

`gampleman/elm-visualization` (Scale, Axis, Shape, Hierarchy, Scale.Color),
`elm-community/typed-svg`, `gampleman/elm-rosetree` (Tree),
`folkertdev/one-true-path-experiment` (Path), `avh4/elm-color`,
`NoRedInk/elm-json-decode-pipeline`, `elm-community/list-extra`.
