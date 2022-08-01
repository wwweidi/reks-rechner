define(["require", "exports", "../../../base/Kalkulation"], function (require, exports, Kalkulation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BruttoGehalt = void 0;
    /**
     * Brutto-Gehalt
     */
    class BruttoGehalt extends Kalkulation_1.Knoten {
        /**
         *
         * @param name @inheritdoc
         * @param brutto Jahresreihe des Brutto-Einkommens
         * @param werbungskosten Jahresreihe der Werbungskosten
         */
        constructor(name, brutto, werbungskosten) {
            super(name);
            this.brutto = brutto;
            this.werbungskosten = werbungskosten;
        }
        getWertFuerJahr(jahr) {
            return this.brutto.getWertFuerJahr(jahr);
        }
        getSteuerWerte(jahr) {
            let sw = new Kalkulation_1.SteuerWerte();
            sw.einnahmen = this.brutto.getWertFuerJahr(jahr);
            sw.werbungskosten = this.werbungskosten.getWertFuerJahr(jahr);
            return sw;
        }
        getVermoegensWerte(jahr) {
            let vw = new Kalkulation_1.VermoegensWerte();
            vw.einnahmen = this.brutto.getWertFuerJahr(jahr);
            return vw;
        }
        getSpalten() {
            return ["Gehalt"];
        }
        getZahlen(jahr) {
            return [this.getWertFuerJahr(jahr)];
        }
    }
    exports.BruttoGehalt = BruttoGehalt;
});
