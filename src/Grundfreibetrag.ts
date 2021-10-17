import { SteuerWerte, Knoten, IJahresWert } from "./Kalkulation";

export class Grundfreibetrag extends Knoten {
    freibetrag: IJahresWert;

    constructor(name: string, freibetrag: IJahresWert) {
        super(name);
        this.freibetrag = freibetrag;
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let sw = new SteuerWerte();
        sw.grundfreibetraege += this.freibetrag.getWertFuerJahr(jahr);

        return sw;
    }
}