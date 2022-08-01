define(["require", "exports", "../../../base/Kalkulation"], function (require, exports, Kalkulation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pension = void 0;
    class Pension extends Kalkulation_1.Knoten {
        constructor(name, dienstJahre, letzterSoldMitSteigerung, startJahr) {
            super(name);
            this.eigenerSatz = Math.min(dienstJahre * Pension.anteilProDienstjahr, Pension.hoechstSatz);
            this.letzterSoldMitSteigerung = letzterSoldMitSteigerung;
            this.startJahr = startJahr;
        }
        getWertFuerJahr(jahr) {
            return this.getPension(jahr);
        }
        getPension(jahr) {
            if (jahr < this.startJahr) {
                return 0;
            }
            else {
                return this.eigenerSatz * this.letzterSoldMitSteigerung.getWertFuerJahr(jahr);
            }
        }
        getSteuerWerte(jahr) {
            let sw = new Kalkulation_1.SteuerWerte();
            sw.einnahmen = this.getPension(jahr);
            return sw;
        }
        getVermoegensWerte(jahr) {
            let vw = new Kalkulation_1.VermoegensWerte();
            vw.einnahmen = this.getPension(jahr);
            return vw;
        }
        getSpalten() {
            return ["Pension"];
        }
        getZahlen(jahr) {
            return [this.getPension(jahr)];
        }
    }
    exports.Pension = Pension;
    Pension.anteilProDienstjahr = 0.0179375;
    Pension.hoechstSatz = 0.7175;
});
