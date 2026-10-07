# Der Weg zum Jahresende – Meilenstein-Kalender

Eine anpassbare, interaktive Timeline-Webanwendung zur Visualisierung wichtiger Meilensteine und Termine – ideal für die strategische Planung der Weihnachts- und Jahresendsaison.

---

## 📌 Übersicht

Diese Anwendung ermöglicht Unternehmen und Teams, wichtige Schlüsseldaten (z. B. Herbstanfang, Black Friday, Adventssonntage, Heiligabend, Silvester) auf einer übersichtlichen und modernen Zeitachse darzustellen.

Die Zeitachse lädt ihre Meilensteine dynamisch aus einer JSON-Datei und unterstützt verschiedene Farbschemata (Themes), automatische Datumsformatierung sowie die visuelle Hervorhebung vergangener, aktueller und zukünftiger Einträge.

---

## ✨ Features

- **Interaktive Zeitachse (Timeline):** Dynamisches Rendern der Meilensteine basierend auf JSON-Daten.
- **Integraphischer Theme-Switcher:** Auswahl aus 8 vorgefertigten Farbthemen (*Graphite, Paper, Cool Elegance, Autumn, Classic Xmas, Forest, Dusk, Midnight*) mit automatischer Speicherung im `localStorage`.
- **Automatische Status-Erkennung:** Visuelle Unterscheidung von vergangenen Terminen, dem heutigen Tag („Heute“-Badge) und zukünftigen Ereignissen.
- **Verwaltungs-Tool (Milestones List Manager):** Standalone-Web-Oberfläche unter `tools/milestones-list-manager.html` zum Verwalten, Hinzufügen, Bearbeiten und Löschen von Einträgen inklusive Export nach JSON, YAML und CSV.
- **SEO & Metadaten:** Enthält strukturierte Daten (Schema.org / JSON-LD) und Meta-Informationen für Suchmaschinen in `data/metadata.json`.
- **Anpassbare Konfiguration:** Einfache Konfiguration von Seitentitel, Datenquellen, Countdown-Optionen und Referenzdatum über ein JavaScript-Konfigurationsobjekt.

---

## 📁 Projektstruktur

```
.
├── assets/
│   ├── css/
│   │   └── milestones.css            # CSS-Styling, Themes & Responsive Layout
│   └── js/
│       └── milestones.js             # Logik für Themes, Datumsverarbeitung & Timeline-Rendering
├── data/
│   ├── metadata.json                 # SEO-Metadaten & Schema.org JSON-LD
│   ├── milestones.csv                # Meilensteine im CSV-Format
│   ├── milestones.json               # Haupt-Datenquelle für die Meilensteine (JSON)
│   └── milestones.yaml               # Meilensteine im YAML-Format
├── tools/
│   └── milestones-list-manager.html  # Web-Verwaltungstool für die Meilenstein-Liste
├── index.html                        # Hauptseite / Timeline-Anzeige
└── README.md                         # Dokumentation
```

---

## 🚀 Schnellstart & Nutzung

### 1. Lokal ausführen

Da die Anwendung Meilensteine dynamisch per `fetch()` aus `data/milestones.json` lädt, sollte sie über einen lokalen Webserver aufgerufen werden (z. B. VS Code Live Server oder Python `http.server`):

```bash
# Beispiel mit Python 3
python -m http.server 8000
```

Anschließend im Browser `http://localhost:8000` aufrufen.

### 2. Meilensteine verwalten

Öffne `tools/milestones-list-manager.html` im Browser, um:
- Neue Meilensteine hinzuzufügen.
- Bestehende Einträge einzusehen oder zu löschen.
- Die Liste als `milestones.json`, `milestones.yaml` oder `milestones.csv` zu exportieren.

Nach dem Export kann die heruntergeladene Datei `milestones.json` im Ordner `data/` ersetzt werden.

---

## ⚙️ Konfiguration

In `assets/js/milestones.js` befindet sich das globale `SETTINGS`-Objekt zur Anpassung der Anwendung:

```javascript
const SETTINGS = {
  pageTitle: "Der Weg zum Jahreswechsel 2026/27",
  countdownEnd: "2026-12-31",
  milestonesUrl: "./data/milestones.json",
  showDaysLeft: false,        // Zeigt verbleibende Tage bis countdownEnd an
  theme: "graphite",          // Standard-Theme (z. B. "graphite", "classicXmas", "paper", etc.)
  showThemeSwitcher: true,     // Aktiviert/Deaktiviert die Theme-Auswahlleiste
  distinguishPast: true,      // Unterscheidet vergangene, heutige und zukünftige Termine
  referenceDate: "today",     // "today" oder spezifisches ISO-Datum (z. B. "2026-11-15")
};
```

---

## 📊 Datenformat

Die Datei `data/milestones.json` erwartet ein JSON-Array von Objekten im folgenden Format:

```json
[
  {
    "date": "2026-09-23",
    "title": "Herbstanfang",
    "text": "Wer noch nicht mit der Vorbereitung auf die Weihnachtssaison begonnen hat, muss es spätestens jetzt tun."
  },
  {
    "date": "2026-11-27",
    "title": "Black Friday",
    "text": "Der grosse Shopping-Tag mit Aktionen und Sonderangeboten."
  }
]
```

---

## 🎨 Themes

Folgende Farbthemen stehen in `assets/js/milestones.js` zur Verfügung:
- **Graphite** (Dunkel / Neutral)
- **Paper** (Hell / Elegantes Papier)
- **Cool Elegance** (Dunkelblau)
- **Autumn** (Herbstlich / Warmes Braun)
- **Classic Xmas** (Klassisches Festtagsgrün & Rot)
- **Forest** (Dunkelgrün)
- **Dusk** (Dunkelviolett)
- **Midnight** (Mitternachtsblau)
