import { SteuerWerte, VermoegensWerte, Knoten, IJahresWert } from "./Kalkulation";
import { LineareDynamik } from "./Reihen";

/** 
 * Private Krankenversicherung 
 *
 * bis zum 60. 10% Zuschlag, reduziert Erhöhungen ab Renteneintritt
 * ab Renteneintritt 
 * - entfällt Krankentagegeld 
 * - Rentenversicherung gibt steuerfreien Zuschuß von 7,3% der gesetzlichen Rente, höchstens aber die Hälfte de KV-Beitrags
 * 
 * - kein Zuschuss zur Pflegeversicherung! 
 */
export class PKV extends Knoten {
    beitrag: IJahresWert;
    arbeitnehmerAnteil: IJahresWert;
    basisAnteil: IJahresWert;
    geburtsJahr: number;
    rentenEintrittsJahr: number;
    gesetzlicheRente: IJahresWert;
    zuschußFaktor: IJahresWert = new LineareDynamik(0.073); //TODO

    constructor(name: string, beitrag: IJahresWert, arbeitnehmerAnteil: IJahresWert, basisAnteil: IJahresWert, geburtsJahr: number, rentenEintrittsJahr: number, gesetzlicheRente: IJahresWert) {
        super(name);
        this.beitrag = beitrag;
        this.arbeitnehmerAnteil = arbeitnehmerAnteil;
        this.basisAnteil = basisAnteil;
        this.geburtsJahr = geburtsJahr;
        this.rentenEintrittsJahr = rentenEintrittsJahr;
        this.gesetzlicheRente = gesetzlicheRente;
    }

    getKvBeitrag(jahr: number): number {
        return this.beitrag.getWertFuerJahr(jahr) * this.getBeitragsEntlastungsZuschlag(jahr)
    }
    
    getBeitragsEntlastungsZuschlag(jahr: number): number {
        if (jahr < this.geburtsJahr + 60) {
            return 1.1;
        } else {
            return 1;
        }
    }

    getRentenversicherungsZuschuß(jahr: number){
        if (jahr >= this.rentenEintrittsJahr) {
            let zuschuß = this.gesetzlicheRente.getWertFuerJahr(jahr) * this.zuschußFaktor.getWertFuerJahr(jahr);
            return (Math.min(this.getKvBeitrag(jahr)/2), zuschuß);
        } else {
            return 0;
        }
    }
    
    getSteuerWerte(jahr: number): SteuerWerte {
        let sw = new SteuerWerte();
        sw.basisKrankenPflegeVersicherungen = this.getKvBeitrag(jahr) * this.arbeitnehmerAnteil.getWertFuerJahr(jahr) * this.basisAnteil.getWertFuerJahr(jahr) - this.getRentenversicherungsZuschuß(jahr);
        return sw;
    }

    getVermoegensWerte(jahr: number) {
        let vw = new VermoegensWerte();
        vw.ausgaben = this.getKvBeitrag(jahr) * this.arbeitnehmerAnteil.getWertFuerJahr(jahr) - this.getRentenversicherungsZuschuß(jahr);
        return vw;
    }

    getSpalten() {
        return ["PKV"];
    }

    getZahlen(jahr: number){
        return [this.getVermoegensWerte(jahr).ausgaben];
    }
}

/** 
Private Krankenversicherung für Beamte
**/
export class PKVBeamte extends PKV {
}