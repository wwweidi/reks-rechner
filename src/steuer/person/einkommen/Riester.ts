import { SteuerWerte, VermoegensWerte, Knoten, IJahresWert } from "../../../base/Kalkulation";
import { LeibRente } from "../../../base/LeibRente";
import { Kind } from "../Personen";
import { JahresReihe, LineareDynamik, Periode } from "../../../base/Reihen";
import { SparKonto } from "../../../base/SparKonto";

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

export class Riester extends Knoten {

    beitrag: IJahresWert;
    brutto: IJahresWert;
    kinder: Set<Kind>;
    verzinsung: IJahresWert;
    einzahlPeriode: any;
    auszahlPeriode: Periode;
    rentenzins: number;
    leibRente: LeibRente;

    constructor(name: string, beitrag: IJahresWert, brutto: IJahresWert, kinder: Set<Kind>, einzahlPeriode: Periode, auszahlPeriode: Periode, rentenzins: number, verzinsung: IJahresWert = new LineareDynamik(1.01)) {
        super(name);
        this.beitrag = beitrag;
        this.brutto = brutto;
        this.kinder = kinder;
        this.einzahlPeriode = einzahlPeriode;
        this.auszahlPeriode = auszahlPeriode;
        this.verzinsung = verzinsung;
        this.rentenzins = rentenzins;
        this.leibRente = new LeibRente("Riester-Leibrente", this.getAngespartesVermoegen(), this.rentenzins, this.auszahlPeriode);
    }

    getSpalten(): string[] {
        return ["Kosten", "RRente"];
    }

    getZahlen(jahr: number, startJahr: number = 2020): number[] {
        return [this.getVermoegensWerte(jahr).ausgaben, this.getRiesterRentenbetrag(jahr)];
    }

    getVermoegensWerte(jahr: number): VermoegensWerte {
        let vermoegensWerte = new VermoegensWerte();

        vermoegensWerte.ausgaben = this.beitrag.getWertFuerJahr(jahr);
        //vermoegensWerte.vermoegen = this.getVermoegensStand(jahr);
        vermoegensWerte.einnahmen = this.getRiesterRentenbetrag(jahr);

        return vermoegensWerte;
    }

    getVermoegensStand(jahr: number, startJahr: number = 2020): number {
        let p = new Periode(startJahr, jahr);
        let spar = new SparKonto("Riester", this.getAngespartesProJahr(p), this.verzinsung, startJahr);
        return spar.getStand(jahr);
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let steuerWerte = new SteuerWerte();

        steuerWerte.riester = Math.min(2100, this.beitrag.getWertFuerJahr(jahr) + this.getAnteiligeZulagen(jahr));
        steuerWerte.einnahmen = this.getRiesterRentenbetrag(jahr);

        return steuerWerte;
    }

    getVolleZulagen(jahr: number): number {

        let zulagen = 175;

        for (let k of Array.from(this.kinder.values())) {
            if (jahr <= k.kindergeldEndeJahr) {
                if (k.geburtsjahr >= 2008) {
                    zulagen += 300;
                } else {
                    zulagen += 185;
                }
            }
        }

        return zulagen;
    }

    getAnteiligeZulagen(jahr: number): number {
        return Math.min(1, this.beitrag.getWertFuerJahr(jahr) / this.getMindestEigenbeitrag(jahr)) * this.getVolleZulagen(jahr);
    }

    getMindestEigenbeitrag(jahr: number): number {
        return Math.max(60, Math.min(2100, this.brutto.getWertFuerJahr(jahr - 1) * 0.04) - this.getVolleZulagen(jahr));
    }

    getAngespartesProJahr(periode: Periode): JahresReihe {
        let gespartes = new JahresReihe();
        for (let j = periode.startJahr; j <= periode.endeJahr; j++) {
            gespartes.setWertFuerJahr(j, this.getAnteiligeZulagen(j) + this.beitrag.getWertFuerJahr(j));
        }
        return gespartes;
    }

    getAngespartesVermoegen(): number {
        let jahresBeitraege = this.getAngespartesProJahr(this.einzahlPeriode);
        let vermoegen = 0;
        for (let j = this.einzahlPeriode.startJahr; j <= this.einzahlPeriode.endeJahr; j++) {
            vermoegen = vermoegen * this.verzinsung.getWertFuerJahr(j) + jahresBeitraege.getWertFuerJahr(j) + jahresBeitraege.getWertFuerJahr(j)/2*(this.verzinsung.getWertFuerJahr(j)-1);  
        }
        return vermoegen;
    }

    getRiesterRentenbetrag(jahr: number): number {
        if (this.auszahlPeriode.enthaelt(jahr)) {
            return this.leibRente.getJahresRente();
        } else {
            return 0;
        }
    }
}
