import { Knoten, SteuerWerte, VermoegensWerte, IJahresWert } from "../../../base/Kalkulation";

/**
 * Brutto-Gehalt
 */
export class BruttoGehalt extends Knoten implements IJahresWert {
    brutto: IJahresWert;
    werbungskosten: IJahresWert;

    /**
     * 
     * @param name @inheritdoc
     * @param brutto Jahresreihe des Brutto-Einkommens
     * @param werbungskosten Jahresreihe der Werbungskosten
     */
    constructor(name: string, brutto: IJahresWert, werbungskosten: IJahresWert) {
        super(name);
        this.brutto = brutto;
        this.werbungskosten = werbungskosten;
    }
    
    getWertFuerJahr(jahr: number): number {
        return this.brutto.getWertFuerJahr(jahr);
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let sw = new SteuerWerte();
        sw.einnahmen = this.brutto.getWertFuerJahr(jahr);
        sw.werbungskosten = this.werbungskosten.getWertFuerJahr(jahr);
        return sw;
    }

    getVermoegensWerte(jahr: number): VermoegensWerte {
        let vw = new VermoegensWerte();
        vw.einnahmen = this.brutto.getWertFuerJahr(jahr);
        return vw;
    }

    getSpalten() {
        return ["Gehalt"];
    }

    getZahlen(jahr: number){
        return [this.getWertFuerJahr(jahr)];
    }
}