define(["require", "exports", "../../../base/Kalkulation"], function (require, exports, Kalkulation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GKVBeamte = exports.GKV = void 0;
    /**
    * Gesetzliche Krankenversicherung für Angestellte
    **/
    class GKV extends Kalkulation_1.Knoten {
        /**
         *
         * @param name @inheritdoc
         * @param brutto Jahresreihe des Brutto-Einkommens
         * @param arbeitnehmerAnteil Jahresreihe des AN-Anteils an der GKV in %
         * @param beitragsBemessungsGrenze Jahresreihe der Beitragsbemessungsgrenze für die GKV
         */
        constructor(name, brutto, arbeitnehmerAnteil, beitragsBemessungsGrenze) {
            super(name);
            this.brutto = brutto;
            this.arbeitnehmerAnteil = arbeitnehmerAnteil;
            this.beitragsBemessungsGrenze = beitragsBemessungsGrenze;
        }
        getSteuerWerte(jahr) {
            let sw = new Kalkulation_1.SteuerWerte();
            const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
            sw.basisKrankenPflegeVersicherungen = einkommen * this.arbeitnehmerAnteil.getWertFuerJahr(jahr) * (1 - GKV.pauschalerAbzug);
            return sw;
        }
        getVermoegensWerte(jahr) {
            let vw = new Kalkulation_1.VermoegensWerte();
            const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
            vw.ausgaben = einkommen * this.arbeitnehmerAnteil.getWertFuerJahr(jahr);
            return vw;
        }
        getSpalten() {
            return ["GKV"];
        }
        getZahlen(jahr) {
            return [this.getVermoegensWerte(jahr).ausgaben];
        }
    }
    exports.GKV = GKV;
    GKV.pauschalerAbzug = 0.04; // 4% 
    /**
    * Freiwillige Gesetzliche Krankenversicherung für Beamte
    **/
    class GKVBeamte extends GKV {
        getSpalten() {
            return ["GKV Beamte"];
        }
    }
    exports.GKVBeamte = GKVBeamte;
    GKVBeamte.pauschalerAbzug = 0.5; // nur hälftige Abziehbarkeit?
});
