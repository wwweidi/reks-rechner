define(["require", "exports", "../../../base/Kalkulation"], function (require, exports, Kalkulation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArbeitslosenVersicherung = void 0;
    /**
     * Arbeitslosenversicherung
     */
    class ArbeitslosenVersicherung extends Kalkulation_1.Knoten {
        /**
         *
         * @param name Name des Knotens
         * @param brutto Jahresreihe des Bruttoeinkommens
         * @param arbeitnehmerAnteil Jahresreihe des Arbeitnehmeranteils an der ALV als Faktor
         * @param beitragsBemessungsGrenze Jahresreihe der Beitragsbemessungsgrenze, bis zu deren Höhe die ALV berechnet wird
         */
        constructor(name, brutto, arbeitnehmerAnteil, beitragsBemessungsGrenze) {
            super(name);
            this.brutto = brutto;
            this.arbeitnehmerAnteil = arbeitnehmerAnteil;
            this.beitragsBemessungsGrenze = beitragsBemessungsGrenze;
        }
        getEinkommenBisBBG(jahr) {
            return Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
        }
        getSteuerWerte(jahr) {
            let sw = new Kalkulation_1.SteuerWerte();
            sw.basisKrankenPflegeVersicherungen = this.getEinkommenBisBBG(jahr) * this.arbeitnehmerAnteil.getWertFuerJahr(jahr);
            return sw;
        }
        getVermoegensWerte(jahr) {
            let vw = new Kalkulation_1.VermoegensWerte();
            vw.ausgaben = this.getEinkommenBisBBG(jahr) * this.arbeitnehmerAnteil.getWertFuerJahr(jahr);
            return vw;
        }
        getSpalten() {
            return ["ALV"];
        }
        getZahlen(jahr) {
            return [this.getVermoegensWerte(jahr).ausgaben];
        }
    }
    exports.ArbeitslosenVersicherung = ArbeitslosenVersicherung;
});
