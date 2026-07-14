# Changelog

Alle wesentlichen Aenderungen des tci Controlling Dashboards werden in dieser Datei dokumentiert.

## [0.9.0-rc1] - 2026-07-14

### Freigegeben

- Vertriebsdashboard mit echten Excel-Daten
- Auftragseingang in Summe
- Auftragseingang im Verlauf
- Detailauswertung
- Vertriebsanalyse
- Top-Kunden

### Hinzugefuegt

- Release-Branch `release/0.9.0-rc1`
- Abteilungsstatus `ready` und `planned`
- Periodenmanifest `data/history.json`
- sichtbare Status- und Fehlermeldungen
- definierte Anzeige fuer noch nicht angebundene Abteilungen
- automatisierte Tests fuer Vertriebsberechnung und Hilfsfunktionen
- Konfigurationsvalidierung
- GitHub Actions Quality-Workflow
- manueller Abnahmetestplan
- responsive und tci-orientierte Oberflaeche

### Geaendert

- JavaScript-Anwendung modularisiert
- Excel-, XML- und Historienladen gehaertet
- Tabellen- und Listenrendering auf sichere DOM-Ausgabe umgestellt
- Versionskennung auf `0.9.0-rc1` vereinheitlicht
- nicht angebundene Abteilungen zeigen keine Demo-Kennzahlen mehr

### Behoben

- Konflikt zwischen Historienkonfiguration und `window.history`
- inkonsistente `.xls`- und `.xlsx`-Datenpfade
- veraltete statische Periodenauswahl
- unklare Fehlermeldungen bei fehlenden oder leeren Dateien

### Bekannte Einschraenkungen

- Nur Vertrieb ist produktiv angebunden.
- Fuer Vertrieb steht im RC1 nur `Aktuell` zur Verfuegung.
- Zugriffsschutz und Datenschutz muessen vor der Freigabe bestaetigt werden.
