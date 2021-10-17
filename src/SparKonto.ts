import { SteuerWerte, VermoegensWerte, Knoten, IJahresWert } from "./Kalkulation";
import { JahresReihe } from "./Reihen";

export class SparKonto {

    zins: IJahresWert;
    name: string;
    jahresReihe: JahresReihe;
    startWert: number;
    startJahr: number;
    betrag: IJahresWert;
    
    constructor(name: string, betrag: IJahresWert, zins: IJahresWert, startJahr: number, startwert: number = 0) {
        this.name = name;
        this.zins = zins;
        this.startWert = startwert;
        this.startJahr = startJahr;
        this.jahresReihe = new JahresReihe();
        this.betrag = betrag;
    }

    getStand(jahr: number): number {

        let gespart = this.startWert;
        for (let j= this.startJahr; j<=jahr; j++) {
            gespart = gespart* this.zins.getWertFuerJahr(j) + this.betrag.getWertFuerJahr(j);
        }
        return gespart;
    }
}