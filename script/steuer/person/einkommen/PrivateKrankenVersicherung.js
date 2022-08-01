define(["require", "exports", "../../../base/Kalkulation", "../../../base/Reihen"], function (require, exports, Kalkulation_1, Reihen_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PKVBeamte = exports.PKV = void 0;
    /**
     * Private Krankenversicherung
     *
     * bis zum 60. 10% Zuschlag, reduziert Erhöhungen ab Renteneintritt
     * ab Renteneintritt
     * - entfällt Krankentagegeld
     * - Rentenversicherung gibt steuerfreien Zuschuß von 7,3% der gesetzlichen Rente, höchstens aber die Hälfte de KV-Beitrags
     *
     * - kein Zuschuss zur Pflegeversicherung!
     */
    class PKV extends Kalkulation_1.Knoten {
        constructor(name, beitrag, arbeitnehmerAnteil, basisAnteil, geburtsJahr, rentenEintrittsJahr, gesetzlicheRente) {
            super(name);
            this.zuschußFaktor = new Reihen_1.LineareDynamik(0.073); //TODO
            this.beitrag = beitrag;
            this.arbeitnehmerAnteil = arbeitnehmerAnteil;
            this.basisAnteil = basisAnteil;
            this.geburtsJahr = geburtsJahr;
            this.rentenEintrittsJahr = rentenEintrittsJahr;
            this.gesetzlicheRente = gesetzlicheRente;
        }
        getKvBeitrag(jahr) {
            return this.beitrag.getWertFuerJahr(jahr) * this.getBeitragsEntlastungsZuschlag(jahr);
        }
        getBeitragsEntlastungsZuschlag(jahr) {
            if (jahr < this.geburtsJahr + 60) {
                return 1.1;
            }
            else {
                return 1;
            }
        }
        getRentenversicherungsZuschuß(jahr) {
            if (jahr >= this.rentenEintrittsJahr) {
                let zuschuß = this.gesetzlicheRente.getWertFuerJahr(jahr) * this.zuschußFaktor.getWertFuerJahr(jahr);
                return (Math.min(this.getKvBeitrag(jahr) / 2), zuschuß);
            }
            else {
                return 0;
            }
        }
        getSteuerWerte(jahr) {
            let sw = new Kalkulation_1.SteuerWerte();
            sw.basisKrankenPflegeVersicherungen = this.getKvBeitrag(jahr) * this.arbeitnehmerAnteil.getWertFuerJahr(jahr) * this.basisAnteil.getWertFuerJahr(jahr) - this.getRentenversicherungsZuschuß(jahr);
            return sw;
        }
        getVermoegensWerte(jahr) {
            let vw = new Kalkulation_1.VermoegensWerte();
            vw.ausgaben = this.getKvBeitrag(jahr) * this.arbeitnehmerAnteil.getWertFuerJahr(jahr) - this.getRentenversicherungsZuschuß(jahr);
            return vw;
        }
        getSpalten() {
            return ["PKV"];
        }
        getZahlen(jahr) {
            return [this.getVermoegensWerte(jahr).ausgaben];
        }
    }
    exports.PKV = PKV;
    /**
    Private Krankenversicherung für Beamte
    **/
    class PKVBeamte extends PKV {
    }
    exports.PKVBeamte = PKVBeamte;
});
