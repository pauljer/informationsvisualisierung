#!/usr/bin/env bash
# Überträgt Änderungen aus diesem Workspace ins Team-Repo (Root-Layout).
# Committen & Pushen macht ihr danach selbst im Zielordner.
set -euo pipefail

SRC="$HOME/Desktop/informationsvisualisierung/Projekt"
DEST="$HOME/Desktop/informationsvisualisierung_projekt"

echo "→ Kopiere geänderte Dateien nach $DEST"
rsync -a \
  --exclude 'elm-stuff' \
  --exclude 'node_modules' \
  --exclude '.DS_Store' \
  --exclude '.git' \
  "$SRC/" "$DEST/"

# Bericht liegt eine Ebene höher – mitnehmen, falls vorhanden
cp -f "$HOME/Desktop/informationsvisualisierung/Projektbericht.docx" "$DEST/" 2>/dev/null || true

echo "→ Baue im Zielordner neu (stellt sicher, dass es läuft)"
( cd "$DEST" && elm make src/Main.elm --output=elm.js >/dev/null && echo "  ✅ Build OK" )

echo "── Änderungen im Team-Repo (git status) ──"
( cd "$DEST" && git status --short )
echo
echo "Nächster Schritt (manuell im Zielordner):"
echo "  cd $DEST"
echo "  git add <datei(en)>   &&   git commit -m \"...\"   &&   git push"
