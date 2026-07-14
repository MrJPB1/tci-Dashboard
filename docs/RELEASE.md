# Release Notes 0.9.0-rc1

## Status

Erster Release Candidate fuer den internen Testbetrieb.

## Freigegeben: Vertrieb

Der Vertriebsbereich ist die Referenzimplementierung. Folgende Funktionen wurden durch den Anwender getestet und fuer den Release Candidate bestaetigt:

- Auftragseingang in Summe
- Auftragseingang im Verlauf
- Detailauswertung
- Vertriebsanalyse
- Top-Kunden

Die bestehende fachliche Berechnung dieser Bereiche wurde beim RC-Umbau beibehalten.

## Technische Verbesserungen

- JavaScript in klar getrennte Module aufgeteilt
- zentrale XML-Konfiguration validiert
- produktive und geplante Abteilungen eindeutig gekennzeichnet
- Perioden aus `data/history.json` geladen
- geplante Abteilungen zeigen einen definierten Status statt Demo-Werte
- Fehler beim Laden oder Verarbeiten von Daten werden sichtbar dargestellt
- HTML-Ausgabe gegen unbeabsichtigte Markup-Injektion gehaertet
- responsives Layout und Statusdarstellung verbessert
- automatisierte Tests und Konfigurationspruefung hinzugefuegt
- Quality-Workflow fuer Release-Branches und Pull Requests hinzugefuegt

## Abteilungsstatus

| Abteilung | RC1-Status |
|---|---|
| Vertrieb | bereit und mit echten Daten angebunden |
| Produktion | geplant |
| Support | geplant |
| Logistik und IT | geplant |
| Buchhaltung | geplant |
| QM | geplant |
| Marketing | geplant |

## Bekannte Einschraenkungen

- Nur Vertrieb ist fachlich und technisch produktiv angebunden.
- Aktuell steht fuer Vertrieb nur die Periode `Aktuell` zur Verfuegung.
- Automatische Verzeichnis- oder Dateierkennung ist noch nicht enthalten.
- Excel-Dateien werden clientseitig im Browser verarbeitet.
- Ein Rollen- und Rechtekonzept ist nicht Teil dieses Release Candidates.
- Vor Nutzung echter Daten muss der Zugriff auf die Pages-Site nachweislich eingeschraenkt sein.

## Abnahmekriterien

Der RC kann nach `main` uebernommen werden, wenn:

1. der Quality-Workflow erfolgreich ist,
2. der manuelle Testplan ohne kritische Fehler abgeschlossen wurde,
3. der Zugriffsschutz fuer reale Kunden- und Auftragsdaten bestaetigt ist,
4. die getesteten Vertriebskennzahlen mit der Excel-Datei uebereinstimmen,
5. das GitHub-Pages-Deployment nach dem Merge erfolgreich ist.

## Naechster Schritt

Nach der Abnahme von `0.9.0-rc1` beginnt die strukturierte Anbindung der naechsten Abteilung. Die Vertriebsimplementierung dient dabei als technisches und fachliches Muster.
