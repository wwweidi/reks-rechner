define(["require", "exports", "../base/Kalkulation"], function (require, exports, Kalkulation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FuenfZonenTarif = exports.EinkommenSteuer = void 0;
    /**
     * Knoten zur Berechnung der Einkommensteuer
     */
    class EinkommenSteuer extends Kalkulation_1.Knoten {
        /**
         * Berechnung der Einkommensteuer
         *
         * @param name @see Knoten
         * @param splitting Ehegattensplitting / Zusammenveranlagung [true|false]
         */
        constructor(name, grundTarif, splitting = false) {
            super(name);
            this.grundTarif = grundTarif;
            this.splitting = splitting;
        }
        getSpalten() {
            return ["Einkommensteuer"];
        }
        getZahlen(jahr) {
            return [this.berechneEinkommensteuer(this.getSteuerWerte(jahr), jahr)];
        }
        getVermoegensWerte(jahr) {
            let vermoegensWerte = new Kalkulation_1.VermoegensWerte();
            for (let blatt of this.getKnoten()) {
                vermoegensWerte.addiereWerte(blatt.getVermoegensWerte(jahr));
            }
            let ek = this.berechneEinkommensteuer(this.getSteuerWerte(jahr), jahr);
            vermoegensWerte.ausgaben += ek;
            return vermoegensWerte;
        }
        berechneEinkommensteuer(steuerWerte, jahr) {
            const summeDerEinkuenfte = steuerWerte.einnahmen - steuerWerte.werbungskosten;
            const gesamtBetragDerEinkuenfte = summeDerEinkuenfte;
            //TODO Günstigerprüfung Riester
            const einkommen = gesamtBetragDerEinkuenfte - steuerWerte.altersvorsorge - steuerWerte.basisKrankenPflegeVersicherungen - steuerWerte.kinderbetreuungskosten - steuerWerte.riester;
            //TODO Günstigerprüfung Kindergeld
            const zuVersteuerndesEinkommen = einkommen - steuerWerte.kinderfreibetraege;
            let steuer;
            if (this.splitting) {
                steuer = this.splittingTarif(zuVersteuerndesEinkommen, jahr);
            }
            else {
                steuer = this.berechneGrundTarif(zuVersteuerndesEinkommen, jahr);
            }
            return steuer + steuerWerte.kindergeld;
        }
        berechneGrundTarif(zuVersteuerndesEinkommen, jahr) {
            return this.grundTarif.grundTarif(zuVersteuerndesEinkommen, jahr);
        }
        splittingTarif(zuVersteuerndesEinkommen, jahr) {
            return this.berechneGrundTarif(zuVersteuerndesEinkommen / 2, jahr) * 2;
        }
    }
    exports.EinkommenSteuer = EinkommenSteuer;
    class FuenfZonenTarif {
        constructor(grundfreibetrag, stufe2, stufe3, stufe4, eingangssatz, linProgSatz2, linProgSatz3, linSatz4) {
            this.grundfreibetrag = grundfreibetrag;
            this.stufe2 = stufe2;
            this.stufe3 = stufe3;
            this.stufe4 = stufe4;
            this.eingangssatz = eingangssatz;
            this.linProgSatz2 = linProgSatz2;
            this.linProgSatz3 = linProgSatz3;
            this.linSatz4 = linSatz4;
            this.zone2 = this.linQuad(grundfreibetrag, stufe2, eingangssatz, linProgSatz2);
            this.zone3 = this.linQuad(stufe2, stufe3, linProgSatz2, linProgSatz3);
        }
        linQuad(gr_u, gr_o, st_u, st_o) {
            return (einkommen, jahr) => {
                let a = (st_o.getWertFuerJahr(jahr) - st_u.getWertFuerJahr(jahr)) / (gr_o.getWertFuerJahr(jahr) - gr_u.getWertFuerJahr(jahr)) / 2;
                let e = einkommen;
                return a * e * e + st_u.getWertFuerJahr(jahr) * e;
            };
        }
        grundTarif(zuVersteuerndesEinkommen, jahr) {
            let steuer = 0;
            let restEink = zuVersteuerndesEinkommen;
            let zuVerstTeil = 0;
            //zone 5 - linear
            if (zuVersteuerndesEinkommen > this.stufe4.getWertFuerJahr(jahr)) {
                zuVerstTeil = zuVersteuerndesEinkommen - this.stufe4.getWertFuerJahr(jahr);
                steuer += zuVerstTeil * this.linSatz4.getWertFuerJahr(jahr);
                restEink -= zuVerstTeil;
            }
            //zone 4 - linear
            if (restEink > this.stufe3.getWertFuerJahr(jahr)) {
                zuVerstTeil = restEink - this.stufe3.getWertFuerJahr(jahr);
                steuer += (zuVerstTeil) * this.linProgSatz3.getWertFuerJahr(jahr);
                restEink -= zuVerstTeil;
            }
            //zone 3 - linear-progressiv
            if (restEink > this.stufe2.getWertFuerJahr(jahr)) {
                zuVerstTeil = restEink - this.stufe2.getWertFuerJahr(jahr);
                steuer += this.zone3(zuVerstTeil, jahr);
                restEink -= zuVerstTeil;
            }
            //zone 2 - linear-progressiv
            if (restEink > this.grundfreibetrag.getWertFuerJahr(jahr)) {
                zuVerstTeil = restEink - this.grundfreibetrag.getWertFuerJahr(jahr);
                steuer += this.zone2(zuVerstTeil, jahr);
                restEink -= zuVerstTeil;
            }
            //zone 1 - unterhalb des freibetrags ist steuerfrei
            return steuer;
        }
    }
    exports.FuenfZonenTarif = FuenfZonenTarif;
});
