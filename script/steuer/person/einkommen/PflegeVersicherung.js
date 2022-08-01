define(["require", "exports", "../../../base/Kalkulation"], function (require, exports, Kalkulation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PflegeVersicherung = void 0;
    class PflegeVersicherung extends Kalkulation_1.Knoten {
        constructor(name, brutto, arbeitnehmerAnteil, beitragsBemessungsGrenze) {
            super(name);
            this.brutto = brutto;
            this.arbeitnehmerAnteil = arbeitnehmerAnteil;
            this.beitragsBemessungsGrenze = beitragsBemessungsGrenze;
        }
        getSteuerWerte(jahr) {
            let sw = new Kalkulation_1.SteuerWerte();
            const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
            sw.basisKrankenPflegeVersicherungen = einkommen * this.arbeitnehmerAnteil.getWertFuerJahr(jahr);
            return sw;
        }
        getVermoegensWerte(jahr) {
            let vw = new Kalkulation_1.VermoegensWerte();
            const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
            vw.ausgaben = einkommen * this.arbeitnehmerAnteil.getWertFuerJahr(jahr);
            return vw;
        }
        getSpalten() {
            return ["PV"];
        }
        getZahlen(jahr) {
            return [this.getVermoegensWerte(jahr).ausgaben];
        }
    }
    exports.PflegeVersicherung = PflegeVersicherung;
});
