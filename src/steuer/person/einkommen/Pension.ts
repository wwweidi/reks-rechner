import { SteuerWerte, VermoegensWerte, Knoten, IJahresWert } from "../../../base/Kalkulation";

export class Pension extends Knoten implements IJahresWert {

    static anteilProDienstjahr: number = 0.0179375;
    static hoechstSatz: number = 0.7175;
    letzterSoldMitSteigerung: IJahresWert;
    eigenerSatz: number;
    startJahr: number;

    constructor(name: string, dienstJahre: number, letzterSoldMitSteigerung: IJahresWert, startJahr: number) {
        super(name);
        this.eigenerSatz = Math.min(dienstJahre * Pension.anteilProDienstjahr, Pension.hoechstSatz);
        this.letzterSoldMitSteigerung = letzterSoldMitSteigerung;
        this.startJahr = startJahr;
    }
    getWertFuerJahr(jahr: number): number {
        return this.getPension(jahr);
    }

    getPension(jahr: number): number {
        if (jahr < this.startJahr) {
            return 0;
        } else {
            return this.eigenerSatz * this.letzterSoldMitSteigerung.getWertFuerJahr(jahr);
        }
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let sw = new SteuerWerte();
        sw.einnahmen = this.getPension(jahr);
        return sw;
    }

    getVermoegensWerte(jahr: number): VermoegensWerte {
        let vw = new VermoegensWerte();
        vw.einnahmen = this.getPension(jahr);
        return vw;
    }

    getSpalten() {
        return ["Pension"];
    }

    getZahlen(jahr: number) {
        return [this.getPension(jahr)];
    }

}