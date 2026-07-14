# Testplan 0.9.0-rc1

## Ziel

Dieser Testplan prueft den ersten Release Candidate mit Schwerpunkt auf der freigegebenen Vertriebsansicht.

## Voraussetzungen

- Quality-Workflow ist erfolgreich.
- GitHub-Pages-Deployment ist erfolgreich.
- Die Datei `data/AUFListen.xlsx` ist vorhanden.
- Der Zugriff auf die Pages-Site ist fuer reale Kunden- und Auftragsdaten angemessen geschuetzt.
- Browser-Cache wurde vor dem Test aktualisiert.

## A. Technischer Smoke-Test

| Nr. | Test | Erwartetes Ergebnis | Status |
|---|---|---|---|
| A1 | Pages-URL oeffnen | Dashboard wird ohne leere Seite geladen | Offen |
| A2 | Browser-Konsole pruefen | Keine unbehandelten JavaScript-Fehler | Offen |
| A3 | Netzwerkaufrufe pruefen | XML, JavaScript-Module und Excel-Datei liefern HTTP 200 | Offen |
| A4 | Desktop-Ansicht | Karten, Diagramm und Tabelle sind vollstaendig sichtbar | Offen |
| A5 | Mobile bzw. schmale Ansicht | Layout wechselt auf eine Spalte, Tabelle bleibt scrollbar | Offen |

## B. Vertrieb – fachliche Abnahme

| Nr. | Test | Erwartetes Ergebnis | Status |
|---|---|---|---|
| B1 | Auftragseingang Summe | Wert entspricht der Summe von `Netto Warenwert` in Excel | Bestaetigt / erneut pruefen |
| B2 | Anzahl Auftraege | Wert entspricht den auswertbaren Datenzeilen | Bestaetigt / erneut pruefen |
| B3 | Anzahl Kunden | Wert entspricht der Zahl eindeutiger Kunden | Bestaetigt / erneut pruefen |
| B4 | Durchschnittlicher Auftrag | Summe geteilt durch Anzahl Auftraege | Bestaetigt / erneut pruefen |
| B5 | Auftragseingang Verlauf | Tageswerte entsprechen Datum und Netto-Warenwert | Bestaetigt / erneut pruefen |
| B6 | Detailauswertung | Kunde, Wert, Datum, Beleg, AE-Nr. und Bezeichnung stimmen | Bestaetigt / erneut pruefen |
| B7 | Vertriebsanalyse | Gesamt, letzter Tag, letzte Woche, letzter Monat und groesster Auftrag sind plausibel | Bestaetigt / erneut pruefen |
| B8 | Top-Kunden | Reihenfolge und Summen stimmen mit Excel ueberein | Bestaetigt / erneut pruefen |
| B9 | Tabellenfilter | Suche blendet nicht passende Auftraege aus | Offen |

## C. Abteilungen ohne Datenanbindung

| Nr. | Test | Erwartetes Ergebnis | Status |
|---|---|---|---|
| C1 | Produktion auswaehlen | Status `geplant`, keine erfundenen Kennzahlen | Offen |
| C2 | Support auswaehlen | Status `geplant`, keine erfundenen Kennzahlen | Offen |
| C3 | Logistik und IT auswaehlen | Status `geplant`, keine erfundenen Kennzahlen | Offen |
| C4 | Buchhaltung auswaehlen | Status `geplant`, keine erfundenen Kennzahlen | Offen |
| C5 | QM auswaehlen | Status `geplant`, keine erfundenen Kennzahlen | Offen |
| C6 | Marketing auswaehlen | Status `geplant`, keine erfundenen Kennzahlen | Offen |

## D. Fehlerfaelle

| Nr. | Test | Erwartetes Ergebnis | Status |
|---|---|---|---|
| D1 | Excel-Datei testweise umbenennen | Sichtbare Datenfehlermeldung statt falscher KPIs | Offen |
| D2 | Pflichtspalte im Mapping entfernen | Quality-Check oder sichtbare Datenfehlermeldung | Offen |
| D3 | Ungueltiges XML verwenden | Fallback bzw. eindeutige Fehlermeldung | Offen |
| D4 | Leere Excel-Datei laden | Meldung `keine auswertbaren Datenzeilen` | Offen |

## E. Release-Freigabe

Der RC ist freigabefaehig, wenn:

- alle A-Tests erfolgreich sind,
- die B-Tests mit realen Excel-Werten uebereinstimmen,
- alle C-Tests keine Demo- oder Fallback-Kennzahlen anzeigen,
- keine kritischen Fehler aus D offen sind,
- der Zugriffsschutz dokumentiert und bestaetigt ist.

## Testergebnis

- Tester:
- Datum:
- Commit / Build:
- Browser:
- Ergebnis: Bestanden / Nicht bestanden
- Offene Fehler:
