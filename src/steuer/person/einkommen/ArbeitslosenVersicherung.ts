import { SteuerWerte, VermoegensWerte, Knoten, IJahresWert } from "../../../base/Kalkulation";

/**
 * Arbeitslosenversicherung
 */
export class ArbeitslosenVersicherung extends Knoten {
    brutto: IJahresWert;
    arbeitnehmerAnteil: IJahresWert;
    beitragsBemessungsGrenze: IJahresWert;

    /**
     * 
     * @param name Name des Knotens
     * @param brutto Jahresreihe des Bruttoeinkommens
     * @param arbeitnehmerAnteil Jahresreihe des Arbeitnehmeranteils an der ALV als Faktor
     * @param beitragsBemessungsGrenze Jahresreihe der Beitragsbemessungsgrenze, bis zu deren Höhe die ALV berechnet wird
     */
    constructor(name: string, brutto: IJahresWert, arbeitnehmerAnteil: IJahresWert, beitragsBemessungsGrenze: IJahresWert) {
        super(name);
        this.brutto = brutto;
        this.arbeitnehmerAnteil = arbeitnehmerAnteil;
        this.beitragsBemessungsGrenze = beitragsBemessungsGrenze
    }

    getEinkommenBisBBG(jahr: number): number {
        return Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let sw = new SteuerWerte();
        sw.basisKrankenPflegeVersicherungen = this.getEinkommenBisBBG(jahr) * this.arbeitnehmerAnteil.getWertFuerJahr(jahr);
        return sw;
    }

    getVermoegensWerte(jahr: number) {
        let vw = new VermoegensWerte();
        vw.ausgaben = this.getEinkommenBisBBG(jahr) * this.arbeitnehmerAnteil.getWertFuerJahr(jahr);
        return vw;
    }

    getSpalten() {
        return ["ALV"];
    }

    getZahlen(jahr: number){
        return [this.getVermoegensWerte(jahr).ausgaben];
    }
}
