import { SteuerWerte, VermoegensWerte, Knoten, IJahresWert } from "./Kalkulation";

export class PflegeVersicherung extends Knoten {
    brutto: IJahresWert;
    arbeitnehmerAnteil: IJahresWert;
    beitragsBemessungsGrenze: IJahresWert;

    constructor(name: string, brutto: IJahresWert, arbeitnehmerAnteil: IJahresWert, beitragsBemessungsGrenze: IJahresWert) {
        super(name);
        this.brutto = brutto;
        this.arbeitnehmerAnteil = arbeitnehmerAnteil;
        this.beitragsBemessungsGrenze = beitragsBemessungsGrenze
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let sw = new SteuerWerte();
        const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
        sw.basisKrankenPflegeVersicherungen = einkommen * this.arbeitnehmerAnteil.getWertFuerJahr(jahr);
        return sw;
    }

    getVermoegensWerte(jahr: number) {
        let vw = new VermoegensWerte();
        const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
        vw.ausgaben = einkommen * this.arbeitnehmerAnteil.getWertFuerJahr(jahr);
        return vw;
    }

    getSpalten() {
        return ["PV"];
    }

    getZahlen(jahr: number){
        return [this.getVermoegensWerte(jahr).ausgaben];
    }
}
