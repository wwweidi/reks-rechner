# Willkommen bei REKS, einem Renten-, Einkommen- , Krankenversicherung- und Steuerrechner

## Zweck
Das Tool soll als persönliche Entscheidungshilfe dienen, z.B. in folgenden Szenarien:
- Entscheidung zwischen freiwillig gesetzlicher und privater Krankenversicherung
- Lohnt sich Riester?
- Lohnt sich MAV (Mitarbeiterfinanzierte, betriebliche Altersvorsorge)?
- Wie hoch wird die Rente / die Pension sein?
- Wie wirken sich Altersvorsorgeausgaben steuerlich aus?
- Vergleich der Auswirkung von Einzel-/Zusammenveranlagung
- und mehr...

## Aufbau
Das Tool besteht aus zwei Komponenten, einer darstellungsunabhängigen Berechnung, welche direkt in einem NodeJS Script genutzt werden kann, und einem Darstellungsteil, die eine Website rendern soll mit Bedienelementen zum Aufbau des persönlichen Szenarios und einer tabellarischen Darstellung der Jahreswerte und idealerweise Vergleichsmöglichkeiten verschiedener Szenarien. 

### Berechnung
Die Grundlage ist eine Baumstruktur, um die Abhängigkeiten modellieren zu können. Der Baum macht es einfach, die Berechnung um weitere Bausteine - Knoten - zu erweitern.
Die Werte, getrennt in 
- einkommensteuerrelevante Zahlen ("Steuerwerte") 
und in 
- Einnahmen/Ausgaben ("Vermögenswerte")
der Blätter und Knoten des Baumes werden jahresweise aufsummiert und bilden somit z.B. die Grundlage für die Berechung der Einkommensteuer.

Die einzelnen Bausteine gliedern sich in 
- Personen (Verdiener  und Kinder),
- Einnahmequellen (Gehälter, Beamtenbesoldung, Rente, Pension),
- Sozialversicherungsabgaben (gesetzl. Rentenversicherung, Pflegeversicherung, Arbeitslosenversicherung, Krankenversicherung)
- Steuern

## Kompilieren & Testen

### Für NodeJS kompilieren
Um alles für NodeJS zu kompilieren, führt man 
> `$ tsc`

oder 
> `$ npm run build`

im root-Verzeichnis aus.

### Für Browser kompilieren
Um alles für die Browser-Umgebung zu kompilieren, führt man 
> `$ tsc -p tsconfig-ui.json`

oder 
> `$ npm run build:ui`

aus.

Dann wird `AMD` als Module-System genutzt und die js-Files werden in `./ui/script/` abgelegt.

### Tests
Tests werden per
> `$ jest`

oder 
> `$ npm run test`

bzw.
> `$ npm run test:coverage ` //mit Code Coverage

ausgeführt.

### Beispiel-Szenario
Im `scenarios` Verzeichnis liegt ein Beispiel-Skript.
Es kann mit 

>`$ ts-node scenarios\beispiel.ts`

oder 

>`$ npm run exec:beispiel`

 ausgeführt werden. Die Ergebnisse werden auf der console ausgegeben.