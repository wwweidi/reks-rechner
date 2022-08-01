define(["require", "exports", "../../../base/Kalkulation"], function (require, exports, Kalkulation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GesetzlRentenVersicherung = void 0;
    const durchschnittsEntgelte = [
        [2017, 37077],
        [2018, 38212],
        [2019, 38901],
        [2020, 40551],
    ];
    const beitragsbememessungsgrenze = [
        [2017, 76200],
        [2018, 78000],
        [2019, 80400],
        [2020, 82800],
        [2021, 85200],
    ];
    /**
     * Gesetzliche Rentenversicherung
     */
    class GesetzlRentenVersicherung extends Kalkulation_1.Knoten {
        /**
         *
         * @param name @inheritdoc
         * @param brutto Jahresreihe des Brutto-Einkommens
         * @param arbeitnehmerAnteil Jahresreihe des Arbeitnehmeranteils an der GRV in %
         * @param beitragsBemessungsGrenze Jahresreihe der Beitragsbemessungsgrenze
         * @param durchschnittsEntgelte Jahresreihe der Durchschnittsentgelte zur Berechnung der erzielten Rentenpunkte
         */
        constructor(name, brutto, arbeitnehmerAnteil, beitragsBemessungsGrenze, durchschnittsEntgelte) {
            super(name);
            this.brutto = brutto;
            this.rentenVersProzent = arbeitnehmerAnteil;
            this.beitragsBemessungsGrenze = beitragsBemessungsGrenze;
            this.durchschnittsEntgelte = durchschnittsEntgelte;
        }
        getSteuerWerte(jahr) {
            let sw = new Kalkulation_1.SteuerWerte();
            const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
            const rentenBeitrag = einkommen * this.rentenVersProzent.getWertFuerJahr(jahr);
            const reduzierterBeitrag = rentenBeitrag * 0.88;
            const arbeitgeberAnteil = rentenBeitrag / 2;
            sw.altersvorsorge = reduzierterBeitrag - arbeitgeberAnteil;
            return sw;
        }
        getVermoegensWerte(jahr) {
            let vw = new Kalkulation_1.VermoegensWerte();
            const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
            vw.ausgaben = einkommen * this.rentenVersProzent.getWertFuerJahr(jahr) / 2;
            return vw;
        }
        getRentenPunkte(jahr) {
            const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
            return einkommen / this.durchschnittsEntgelte.getWertFuerJahr(jahr);
        }
        getRentenPunkteGesamt(periode) {
            let sum = 0;
            for (let j = periode.startJahr; j <= periode.endeJahr; j++) {
                sum += this.getRentenPunkte(j);
            }
            return sum;
        }
        getSpalten() {
            return ["RV"];
        }
        getZahlen(jahr) {
            return [this.getVermoegensWerte(jahr).ausgaben];
        }
    }
    exports.GesetzlRentenVersicherung = GesetzlRentenVersicherung;
});
