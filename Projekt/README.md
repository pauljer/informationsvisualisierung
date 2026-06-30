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
- **Filter auf `country_id` funktioniert serverseitig nicht** (String-Gleichheit
  liefert leer). Daher wird per numerischem `unix_seconds`-Fenster geladen
  (`limit_val` ≤ 5000, Pagination über `offset_val`) und das Land
  **client-seitig** gefiltert. Sortierung `unix_seconds, id` → echte Daten zuerst,
  stabile Pagination.
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
    ├── Api.elm              Token, paginiertes Laden, null-toleranter Row-Decoder
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
