# tci Controlling Dashboard

Konfigurierbares HTML5-Dashboard fuer Controlling-Kennzahlen auf Basis von Excel-Dateien.

**Aktueller Stand:** `0.9.0-rc1`

## Freigegebener Funktionsumfang

Die Abteilung **Vertrieb** ist die Referenzimplementierung und wurde fachlich getestet. Folgende Auswertungen bleiben unveraendert Bestandteil des Release Candidates:

- Auftragseingang in Summe
- Auftragseingang im zeitlichen Verlauf
- Detailauswertung der Auftraege
- Vertriebsanalyse
- Top-Kunden

Weitere Abteilungen sind bereits konfiguriert, werden im RC1 aber eindeutig als **geplant** angezeigt:

- Produktion
- Support
- Logistik und IT
- Buchhaltung
- QM
- Marketing

## Datenquelle Vertrieb

Die produktive Vertriebsdatei liegt unter:

```text
data/AUFListen.xlsx
```

Erwartete Spalten:

| Spalte | Inhalt | Dashboard-Feld |
|---|---|---|
| A | Kunde | `customer` |
| B | Bestelldatum | `orderDate` |
| C | Belegnummer | `documentNumber` |
| D | AE-Nummer | `aeNumber` |
| E | Bezeichnung | `description` |
| F | Netto-Warenwert | `netValue` |

Das Mapping befindet sich in `config/excel-sales.xml`.

## Konfiguration

- `config/departments.xml`: Abteilungen, Status, Mapping und Datenpfad
- `config/excel-*.xml`: Excel-Zuordnung je Abteilung
- `data/history.json`: verfuegbare Perioden je Abteilung

Neue oder noch nicht angebundene Abteilungen werden mit `status="planned"` gekennzeichnet. Nur Abteilungen mit `status="ready"` laden produktive Daten.

## Lokaler Start

Die Anwendung verwendet `fetch()` und ES-Module. Sie muss deshalb ueber einen lokalen Webserver gestartet werden:

```bash
python -m http.server 8080
```

Danach im Browser oeffnen:

```text
http://localhost:8080/
```

## Automatisierte Tests

Voraussetzung: Node.js 20 oder neuer.

```bash
npm test
```

Der Testlauf prueft:

- Berechnung der freigegebenen Vertriebs-KPIs
- Tages-, Wochen- und Monatsgruppierung
- Top-Kunden
- Zahlen- und Datumsverarbeitung
- Vollstaendigkeit der benoetigten Dateien
- Abteilungs- und Excel-Konfiguration
- Vorhandensein einer gueltigen Excel-Arbeitsmappe

## Deployment

`main` wird ueber `.github/workflows/pages.yml` nach GitHub Pages veroeffentlicht. Der Release-Branch wird vor dem Merge durch `.github/workflows/quality.yml` geprueft.

## Datenschutz und Zugriff

Die Excel-Datei enthaelt reale Kunden- und Auftragsdaten. Vor einem Merge oder produktiven Deployment muss sichergestellt sein, dass die veroeffentlichte Pages-Website ausschliesslich fuer berechtigte Personen erreichbar ist. Ein privates Repository allein ist kein ausreichender Nachweis fuer einen geschuetzten Pages-Zugriff.

## Release-Ablauf

1. Aenderungen auf `release/0.9.0-rc1` pruefen.
2. Automatisierte Quality Checks muessen erfolgreich sein.
3. Manuellen Abnahmetest gemaess `docs/TESTPLAN.md` durchfuehren.
4. Zugriffsschutz der Pages-Site bestaetigen.
5. Pull Request nach `main` freigeben.
6. Nach erfolgreichem Pages-Deployment den RC erneut testen.
