import { Knoten, SteuerWerte, VermoegensWerte, IJahresWert } from "./Kalkulation";
import { Periode } from "./Reihen";

const durchschnittsEntgelte = [
    [2017, 37077],
    [2018, 38212],
    [2019, 38901],
    [2020, 40551],
]

const beitragsbememessungsgrenze = [
    [2017, 76200],
    [2018, 78000],
    [2019, 80400],
    [2020, 82800],
    [2021, 85200],
]

export class GesetzlRentenVersicherung extends Knoten {
    brutto: IJahresWert;
    rentenVersProzent: IJahresWert;
    beitragsBemessungsGrenze: IJahresWert;
    durchschnittsEntgelte: IJahresWert;

    constructor(name: string, brutto: IJahresWert, arbeitnehmerAnteil: IJahresWert, beitragsBemessungsGrenze: IJahresWert,durchschnittsEntgelte: IJahresWert ) {
        super(name);
        this.brutto = brutto;
        this.rentenVersProzent = arbeitnehmerAnteil;
        this.beitragsBemessungsGrenze = beitragsBemessungsGrenze;
        this.durchschnittsEntgelte = durchschnittsEntgelte;
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let sw = new SteuerWerte();
        const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
        const rentenBeitrag = einkommen * this.rentenVersProzent.getWertFuerJahr(jahr);
        const reduzierterBeitrag = rentenBeitrag * 0.88;
        const arbeitgeberAnteil = rentenBeitrag / 2;
        sw.altersvorsorge = reduzierterBeitrag - arbeitgeberAnteil;
        return sw;
    }

    getVermoegensWerte(jahr: number): VermoegensWerte {
        let vw = new VermoegensWerte();
        const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
        vw.ausgaben = einkommen * this.rentenVersProzent.getWertFuerJahr(jahr) / 2;
        return vw;
    }

    getRentenPunkte(jahr: number): number {
        const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
        return einkommen / this.durchschnittsEntgelte.getWertFuerJahr(jahr);
    }

    getRentenPunkteGesamt(periode: Periode): number {
        let sum = 0;
        for (let j=periode.startJahr; j<=periode.endeJahr; j++) {
            sum += this.getRentenPunkte(j);
        }
        return sum;
    }

    getSpalten() {
        return ["RV"];
    }

    getZahlen(jahr: number){
        return [this.getVermoegensWerte(jahr).ausgaben];
    }
}