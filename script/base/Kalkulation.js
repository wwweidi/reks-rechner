define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LeererKnoten = exports.Knoten = exports.GenerischerKnoten = exports.VermoegensWerte = exports.SteuerWerte = void 0;
    class SteuerWerte {
        constructor() {
            this.einnahmen = 0;
            this.werbungskosten = 0;
            this.sonderausgaben = 0;
            this.basisKrankenPflegeVersicherungen = 0;
            this.altersvorsorge = 0;
            this.riester = 0;
            this.sonstigeVorsorge = 0;
            this.kinderbetreuungskosten = 0;
            this.kinderfreibetraege = 0;
            this.kindergeld = 0;
        }
        addiereWerte(werte) {
            this.einnahmen += werte.einnahmen;
            this.werbungskosten += werte.werbungskosten;
            this.sonderausgaben += werte.sonderausgaben;
            /** kv
             * unbegrenzt
             * basiskrankenversicherung
             * pflegeversicherung
             */
            this.basisKrankenPflegeVersicherungen += werte.basisKrankenPflegeVersicherungen;
            /**
             * Altersvorsorgeaufwendungen (Beiträge zur gesetzlichen Rentenversicherung, zu berufsständischen Versorgungseinrichtungen
             * und zu Rürup-Rentenversicherungen) sind insgesamt absetzbar bis zu einem bestimmten Höchstbetrag.
             * Sie wirken sich allerdings bis zum Jahre 2025 tatsächlich nur mit einem bestimmten Prozentsatz steuermindernd aus.
             * Dieser Prozentsatz verändert sich jährlich, begann im Jahre 2005 mit 60 % und steigt bis zum Jahre 2025 auf 100 %.
             */
            this.altersvorsorge += werte.altersvorsorge;
            /**
             *  riester (extra, da separater höchstbetrag bis 2.100,-)
             */
            this.riester += werte.riester;
            /**sonstige
             * bis 1.900 Euro abzugsfähig, wenn höchstbetrag durch andere nicht ausgeschöpft
             *
             * Zu den sonstigen Vorsorgeaufwendungen gehören vor allem Beiträge zur Arbeitslosenversicherung,
             * zu Berufsunfähigkeits-, Unfall- und Haftpflichtversicherungen, zu Risikolebensversicherungen,
             * zur privaten Krankenversicherungen (die über die Basisabsicherung hinausgehen) und zu privaten Pflegeversicherungen.
             * Außerdem werden hier noch Kapitallebensversicherungen und Rentenversicherungen mit Kapitalwahlrecht (berücksichtigt zu 88 %)
             * sowie Rentenversicherungen ohne Kapitalwahlrecht erfasst, die vor 2005 abgeschlossen worden sind.*/
            this.sonstigeVorsorge += werte.sonstigeVorsorge;
            this.kinderfreibetraege += werte.kinderfreibetraege;
            this.kinderbetreuungskosten += werte.kinderbetreuungskosten;
            this.kindergeld += werte.kindergeld;
        }
    }
    exports.SteuerWerte = SteuerWerte;
    class VermoegensWerte {
        constructor() {
            this.einnahmen = 0;
            this.ausgaben = 0;
            this.vermoegen = 0;
        }
        addiereWerte(werte) {
            this.einnahmen += werte.einnahmen;
            this.ausgaben += werte.ausgaben;
            this.vermoegen += werte.vermoegen;
        }
    }
    exports.VermoegensWerte = VermoegensWerte;
    class GenerischerKnoten {
        /**
         *
         * @param name Bezeichnung des Knoten
         */
        constructor(name = '') {
            this.knoten = new Set();
            this.name = name;
        }
        getKnoten() {
            return Array.from(this.knoten.values());
        }
        printSpalten() {
            let names = this.getSpalten();
            for (let k of this.getKnoten()) {
                names = names.concat(k.printSpalten());
            }
            return names;
        }
        printZahlen(jahr) {
            let numbers = this.getZahlen(jahr).map(value => (value / 12).toFixed(0));
            for (let k of this.getKnoten()) {
                numbers = numbers.concat(k.printZahlen(jahr));
            }
            return numbers;
        }
    }
    exports.GenerischerKnoten = GenerischerKnoten;
    class Knoten extends GenerischerKnoten {
        getSpalten() {
            return ["Einnahmen " + this.name, "Ausgaben " + this.name, "Verfügbar " + this.name, "Abgezinst " + this.name];
        }
        getZahlen(jahr, startJahr = 2020) {
            let z = this.getVermoegensWerte(jahr);
            let differenz = z.einnahmen - z.ausgaben;
            let anzJahre = jahr - startJahr;
            let divisor = Math.pow(1.02, anzJahre);
            return [z.einnahmen, z.ausgaben, differenz, differenz / divisor];
        }
        getVermoegensWerte(jahr) {
            let vermoegensWerte = new VermoegensWerte();
            for (let blatt of this.getKnoten()) {
                vermoegensWerte.addiereWerte(blatt.getVermoegensWerte(jahr));
            }
            return vermoegensWerte;
        }
        getSteuerWerte(jahr) {
            let steuerWerte = new SteuerWerte();
            for (let blatt of this.getKnoten()) {
                steuerWerte.addiereWerte(blatt.getSteuerWerte(jahr));
            }
            return steuerWerte;
        }
        /**
         * Blatt zur Liste hinzufügen
         *
         * @param blatt
         * @returns this
         */
        addKnoten(blatt) {
            this.knoten.add(blatt);
            return this;
        }
        removeKnoten(blatt) {
            this.knoten.delete(blatt);
            return this;
        }
    }
    exports.Knoten = Knoten;
    class LeererKnoten extends GenerischerKnoten {
        getKnoten() {
            return new Array();
        }
        getSteuerWerte(_jahr) {
            return new SteuerWerte();
        }
        getVermoegensWerte(_jahr) {
            return new VermoegensWerte();
        }
        getSpalten() {
            return ["Ohne"];
        }
        getZahlen(_jahr) {
            return [0];
        }
    }
    exports.LeererKnoten = LeererKnoten;
});
