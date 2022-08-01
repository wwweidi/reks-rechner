import { Knoten, SteuerWerte, VermoegensWerte, IJahresWert } from "../../base/Kalkulation";
import { Periode } from "../../base/Reihen";

export class Person extends Knoten {

    geburtsjahr: number;

    constructor(name: string, geburtsjahr: number) {
        super(name);
        this.geburtsjahr = geburtsjahr;
    }

    static getRegulaeresRenteneintrittsalter(geburtsjahr: number): number {

        if ( geburtsjahr < 1947) {
            return 65;
        } else if (geburtsjahr < 1961) { //gerundet, da hier nur auf Jahresebene gerechnet wird
            return 66;
        } else {
            return 67;
        }
    }

    private getAktuellesJahr(): number {
        return new Date().getFullYear();
    }

    getAlter(): number {
        return this.getAktuellesJahr() - this.geburtsjahr;
    }

    private getRestLebensErwartung(): number {
        return Math.round(this.getAlter()/20 + Math.max(85, this.getAlter()) - this.getAlter());
    }

    getRestArbeitsPeriode(): Periode {
        return new Periode(this.getAktuellesJahr(), this.getRentenBeginn()-1);
    }

    getRestLebensPeriode(): Periode{
        const aktuellesJahr = new Date().getFullYear();
        return new Periode(aktuellesJahr, aktuellesJahr + this.getRestLebensErwartung() )
    }

    getRentenBeginn(): number {
        const rentenAlter = Person.getRegulaeresRenteneintrittsalter(this.geburtsjahr);
        return this.geburtsjahr + rentenAlter;
    }
}

export class Kind extends Person {
    kindergeldSatz: number;
    kindergeldEndeJahr: number;
    kinderFreibetrag: IJahresWert;
    kinderbetreuungskosten: IJahresWert;

    constructor(name: string, geburtsjahr: number, kindergeldSatz: number, kinderFreibetrag: IJahresWert, 
                kinderbetreuungskosten: IJahresWert, kindergeldEndeAlter: number = 25) {

        super(name, geburtsjahr);
        this.kindergeldSatz = kindergeldSatz;
        this.kinderFreibetrag = kinderFreibetrag;
        this.kinderbetreuungskosten = kinderbetreuungskosten;
        this.kindergeldEndeJahr = geburtsjahr + kindergeldEndeAlter;
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let sw = new SteuerWerte();
        if (jahr <=  this.kindergeldEndeJahr) {
            sw.kinderfreibetraege = this.kinderFreibetrag.getWertFuerJahr(jahr);
            sw.kinderbetreuungskosten = this.kinderbetreuungskosten.getWertFuerJahr(jahr);
            sw.kindergeld = 12 * this.kindergeldSatz;
        }
        return sw;
    }

    getVermoegensWerte(jahr: number): VermoegensWerte {
        let vw = new VermoegensWerte();
        if (jahr <= this.kindergeldEndeJahr) {
            vw.einnahmen = 12 * this.kindergeldSatz;
        }
        vw.ausgaben = this.kinderbetreuungskosten.getWertFuerJahr(jahr);
        return vw;
    }

    getSpalten() {
        return ["Kindergeld " + this.name];
    }

    getZahlen(jahr: number){
        return [this.getVermoegensWerte(jahr).einnahmen];
    }
}