define(["require", "exports", "../../../base/Kalkulation"], function (require, exports, Kalkulation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GesetzlicheRente = exports.rentenfreibetrag = exports.rentenWerteOst = exports.rentenWerteWest = void 0;
    exports.rentenWerteWest = [
        [2018, 32.02],
        [2019, 33.05],
        [2020, 34.19],
        [2021, 34.19],
    ];
    exports.rentenWerteOst = [
        [2018, 30.69],
        [2019, 31.89],
        [2020, 33.23],
        [2021, 33.46],
    ];
    exports.rentenfreibetrag = new Map([
        [2019, 0.22],
        [2020, 0.2],
        [2021, 0.19],
        [2022, 0.18],
        [2023, 0.17],
        [2024, 0.16],
        [2025, 0.15],
        [2026, 0.14],
        [2027, 0.13],
        [2028, 0.12],
        [2029, 0.11],
        [2030, 0.1],
        [2031, 0.09],
        [2032, 0.08],
        [2033, 0.07],
        [2034, 0.06],
        [2035, 0.05],
        [2036, 0.04],
        [2037, 0.03],
        [2038, 0.02],
        [2039, 0.01],
        [2040, 0],
    ]);
    /**
     * Gesetzliche Rente
     *
     * @extends Knoten
     */
    class GesetzlicheRente extends Kalkulation_1.Knoten {
        /**
         *
         * @param name @inheritdoc
         * @param rentenPunkte bereits gesammelte Summe der Rentenpunkte
         * @param rentenWerte Jahresreihe der zu erwartenden Rentenwerte (pro Rentenpunkt)
         * @param rentenBeginn Jahr des Rentenbeginns zur Berechnung des steuerlichen Freibetrags
         */
        constructor(name, rentenPunkte, rentenWerte, rentenBeginn) {
            super(name);
            this.rentenFreibetrag = 0;
            this.rentenPunkte = rentenPunkte;
            this.rentenWerte = rentenWerte;
            this.rentenFreibetrag = this.berechneRentenFreibetrag(rentenBeginn);
            this.rentenBeginn = rentenBeginn;
        }
        getWertFuerJahr(jahr) {
            return this.getRente(jahr);
        }
        getRente(jahr) {
            return jahr >= this.rentenBeginn ? this.rentenPunkte * this.rentenWerte.getWertFuerJahr(jahr) * 12 : 0;
        }
        getSteuerWerte(jahr) {
            let sw = new Kalkulation_1.SteuerWerte();
            sw.einnahmen = Math.max(0, this.getRente(jahr) - this.rentenFreibetrag);
            return sw;
        }
        getVermoegensWerte(jahr) {
            let vw = new Kalkulation_1.VermoegensWerte();
            vw.einnahmen = this.getRente(jahr);
            return vw;
        }
        berechneRentenFreibetrag(rentenBeginn) {
            return this.getRente(rentenBeginn) * (exports.rentenfreibetrag.get(rentenBeginn) || 0);
        }
        getSpalten() {
            return ["Rente"];
        }
        getZahlen(jahr) {
            return [this.getRente(jahr)];
        }
    }
    exports.GesetzlicheRente = GesetzlicheRente;
});
