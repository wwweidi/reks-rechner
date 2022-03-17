import { SteuerWerte, VermoegensWerte, Knoten, IJahresWert } from "../../../base/Kalkulation";

/** 
* Gesetzliche Krankenversicherung für Angestellte
**/
export class GKV extends Knoten {
    brutto: IJahresWert;
    arbeitnehmerAnteil: IJahresWert;
    beitragsBemessungsGrenze: IJahresWert;
    static pauschalerAbzug: number = 0.04; // 4% 

    /**
     * 
     * @param name @inheritdoc
     * @param brutto Jahresreihe des Brutto-Einkommens
     * @param arbeitnehmerAnteil Jahresreihe des AN-Anteils an der GKV in %
     * @param beitragsBemessungsGrenze Jahresreihe der Beitragsbemessungsgrenze für die GKV 
     */
    constructor(name: string, brutto: IJahresWert, arbeitnehmerAnteil: IJahresWert, beitragsBemessungsGrenze: IJahresWert) {
        super(name);
        this.brutto = brutto;
        this.arbeitnehmerAnteil = arbeitnehmerAnteil;
        this.beitragsBemessungsGrenze = beitragsBemessungsGrenze;
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let sw = new SteuerWerte();
        const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
        sw.basisKrankenPflegeVersicherungen = einkommen * this.arbeitnehmerAnteil.getWertFuerJahr(jahr) * (1 - GKV.pauschalerAbzug);
        return sw;
    }

    getVermoegensWerte(jahr: number) {
        let vw = new VermoegensWerte();
        const einkommen = Math.min(this.brutto.getWertFuerJahr(jahr), this.beitragsBemessungsGrenze.getWertFuerJahr(jahr));
        vw.ausgaben = einkommen * this.arbeitnehmerAnteil.getWertFuerJahr(jahr);
        return vw;
    }

    getSpalten() {
        return ["GKV"];
    }

    getZahlen(jahr: number){
        return [this.getVermoegensWerte(jahr).ausgaben];
    }
}

/** 
* Freiwillige Gesetzliche Krankenversicherung für Beamte
**/
export class GKVBeamte extends GKV {
    static pauschalerAbzug: number = 0.5; // nur hälftige Abziehbarkeit?

    getSpalten() {
        return ["GKV Beamte"];
    }
}