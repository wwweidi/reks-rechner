define(["require", "exports", "../../../base/Kalkulation", "../../../base/LeibRente", "../../../base/Reihen", "../../../base/SparKonto"], function (require, exports, Kalkulation_1, LeibRente_1, Reihen_1, SparKonto_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Riester = void 0;
    /***
     *
     * 4% vom Vorjahreseinkommen für volle Förderung
     * mind. 60,-€ pro Jahr
     *
     * Maximalbetrag steuerlich berücksichtigt:
     * 2100,-€ abzgl. Zulagen
     *
     * Zulagen
     * - Eigenzulage (175,-)
     * - Kinder (185,- bis 300,-)
     * - ...
     */
    class Riester extends Kalkulation_1.Knoten {
        constructor(name, beitrag, brutto, kinder, einzahlPeriode, auszahlPeriode, rentenzins, verzinsung = new Reihen_1.LineareDynamik(1.01)) {
            super(name);
            this.beitrag = beitrag;
            this.brutto = brutto;
            this.kinder = kinder;
            this.einzahlPeriode = einzahlPeriode;
            this.auszahlPeriode = auszahlPeriode;
            this.verzinsung = verzinsung;
            this.rentenzins = rentenzins;
            this.leibRente = new LeibRente_1.LeibRente("Riester-Leibrente", this.getAngespartesVermoegen(), this.rentenzins, this.auszahlPeriode);
        }
        getSpalten() {
            return ["Kosten", "RRente"];
        }
        getZahlen(jahr, startJahr = 2020) {
            return [this.getVermoegensWerte(jahr).ausgaben, this.getRiesterRentenbetrag(jahr)];
        }
        getVermoegensWerte(jahr) {
            let vermoegensWerte = new Kalkulation_1.VermoegensWerte();
            vermoegensWerte.ausgaben = this.beitrag.getWertFuerJahr(jahr);
            //vermoegensWerte.vermoegen = this.getVermoegensStand(jahr);
            vermoegensWerte.einnahmen = this.getRiesterRentenbetrag(jahr);
            return vermoegensWerte;
        }
        getVermoegensStand(jahr, startJahr = 2020) {
            let p = new Reihen_1.Periode(startJahr, jahr);
            let spar = new SparKonto_1.SparKonto("Riester", this.getAngespartesProJahr(p), this.verzinsung, startJahr);
            return spar.getStand(jahr);
        }
        getSteuerWerte(jahr) {
            let steuerWerte = new Kalkulation_1.SteuerWerte();
            steuerWerte.riester = Math.min(2100, this.beitrag.getWertFuerJahr(jahr) + this.getAnteiligeZulagen(jahr));
            steuerWerte.einnahmen = this.getRiesterRentenbetrag(jahr);
            return steuerWerte;
        }
        getVolleZulagen(jahr) {
            let zulagen = 175;
            for (let k of Array.from(this.kinder.values())) {
                if (jahr <= k.kindergeldEndeJahr) {
                    if (k.geburtsjahr >= 2008) {
                        zulagen += 300;
                    }
                    else {
                        zulagen += 185;
                    }
                }
            }
            return zulagen;
        }
        getAnteiligeZulagen(jahr) {
            return Math.min(1, this.beitrag.getWertFuerJahr(jahr) / this.getMindestEigenbeitrag(jahr)) * this.getVolleZulagen(jahr);
        }
        getMindestEigenbeitrag(jahr) {
            return Math.max(60, Math.min(2100, this.brutto.getWertFuerJahr(jahr - 1) * 0.04) - this.getVolleZulagen(jahr));
        }
        getAngespartesProJahr(periode) {
            let gespartes = new Reihen_1.JahresReihe();
            for (let j = periode.startJahr; j <= periode.endeJahr; j++) {
                gespartes.setWertFuerJahr(j, this.getAnteiligeZulagen(j) + this.beitrag.getWertFuerJahr(j));
            }
            return gespartes;
        }
        getAngespartesVermoegen() {
            let jahresBeitraege = this.getAngespartesProJahr(this.einzahlPeriode);
            let vermoegen = 0;
            for (let j = this.einzahlPeriode.startJahr; j <= this.einzahlPeriode.endeJahr; j++) {
                vermoegen = vermoegen * this.verzinsung.getWertFuerJahr(j) + jahresBeitraege.getWertFuerJahr(j) + jahresBeitraege.getWertFuerJahr(j) / 2 * (this.verzinsung.getWertFuerJahr(j) - 1);
            }
            return vermoegen;
        }
        getRiesterRentenbetrag(jahr) {
            if (this.auszahlPeriode.enthaelt(jahr)) {
                return this.leibRente.getJahresRente();
            }
            else {
                return 0;
            }
        }
    }
    exports.Riester = Riester;
});
