# tci Controlling Dashboard

Ein einfaches, interaktives HTML5-Dashboard fuer Controlling-Kennzahlen und Auswertungen auf Basis von Excel-Quelldateien.

## Ziel

Das Dashboard bietet:

- eine Einstiegsseite mit Gesamtuebersicht
- Unterseiten je Abteilung
- woechentliche Excel-Daten als Datenquelle
- XML-Konfiguration je Excel-Datei fuer relevante Zeilen, Spalten und Kennzahlen
- zentrale XML-Konfiguration fuer Abteilungen
- interaktive Auswahl aktueller und historischer Datenstaende
- modernes, responsives Layout in einer tci-orientierten Corporate-Optik

## Struktur

```text
.
├── index.html
├── assets/
│   ├── css/styles.css
│   └── js/app.js
├── config/
│   ├── departments.xml
│   └── excel/
│       ├── finance.xml
│       ├── sales.xml
│       └── production.xml
└── data/
    ├── README.md
    └── samples/sample-data.csv
```

## Nutzung

1. Repository lokal klonen oder als statische Website bereitstellen.
2. Excel-Dateien wochenweise in `data/<abteilung>/<YYYY-WW>/` ablegen.
3. Pro Excel-Datei eine XML-Konfiguration in `config/excel/` pflegen.
4. Abteilungen und Dashboard-Seiten in `config/departments.xml` verwalten.
5. `index.html` im Browser oeffnen.

> Hinweis: Moderne Browser blockieren lokale `fetch()`-Zugriffe teilweise bei direktem Öffnen per `file://`. Fuer Tests empfiehlt sich ein kleiner lokaler Webserver, z. B. `python -m http.server 8080`.

## Excel-Konfiguration

Jede Excel-Datei bekommt eine eigene XML-Datei. Darin werden Blatt, Datenbereich, Spalten und KPI-Zellen beschrieben.

Beispiel:

```xml
<excelConfig id="finance-weekly" department="finance" filePattern="data/finance/{period}/finance.xlsx">
  <sheet name="Controlling" />
  <range headerRow="1" startRow="2" endRow="200" />
  <columns>
    <column key="costCenter" label="Kostenstelle" source="A" type="text" />
    <column key="revenue" label="Umsatz" source="B" type="currency" />
  </columns>
  <kpis>
    <kpi key="revenue" label="Umsatz" cell="B2" type="currency" />
  </kpis>
</excelConfig>
```

## Abteilungskonfiguration

`config/departments.xml` definiert die Einstiegsseite und alle Unterseiten:

```xml
<department id="finance" name="Finanzen" icon="€" config="config/excel/finance.xml" />
```

## Status

Dieses Repository enthält ein lauffaehiges Grundgeruest mit Demo-Fallbackdaten. Die konkrete Anbindung echter Excel-Dateien kann je Abteilung ueber die XML-Dateien erweitert werden.