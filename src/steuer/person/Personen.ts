import { Knoten, SteuerWerte, VermoegensWerte, IJahresWert } from "../../base/Kalkulation";

export class Person extends Knoten {
    geburtsjahr: number;

    constructor(name: string, geburtsjahr: number) {
        super(name);
        this.geburtsjahr = geburtsjahr;
    }
}

export class Kind extends Person {
    kindergeldSatz: number;
    kindergeldEndeJahr: number;
    kinderFreibetrag: IJahresWert;
    kinderbetreuungskosten: IJahresWert;

    constructor(name: string, geburtsjahr: number, kindergeldSatz: number, kinderFreibetrag: IJahresWert, kinderbetreuungskosten: IJahresWert, kindergeldEndeAlter: number = 25) {
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
        return ["Kindergeld"];
    }

    getZahlen(jahr: number){
        return [this.getVermoegensWerte(jahr).einnahmen];
    }
}