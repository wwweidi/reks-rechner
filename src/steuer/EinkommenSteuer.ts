import { IJahresWert, Knoten, SteuerWerte, VermoegensWerte } from "../base/Kalkulation";

/**
 * Knoten zur Berechnung der Einkommensteuer
 */
export class EinkommenSteuer extends Knoten {
    splitting: boolean;
    grundTarif: IGrundTarif;

    /**
     * Berechnung der Einkommensteuer
     * 
     * @param name @see Knoten
     * @param splitting Ehegattensplitting / Zusammenveranlagung [true|false]
     */
    constructor(name: string, grundTarif: IGrundTarif, splitting: boolean = false ) {
        super(name);
        this.grundTarif = grundTarif;
        this.splitting = splitting;
    }

    getSpalten() {
        return ["Einkommensteuer"];
    }

    getZahlen(jahr: number){
        return [this.berechneEinkommensteuer(this.getSteuerWerte(jahr), jahr)];
    }

    getVermoegensWerte(jahr: number): VermoegensWerte {
        let vermoegensWerte = new VermoegensWerte();

        for (let blatt of this.getKnoten()) {
            vermoegensWerte.addiereWerte(blatt.getVermoegensWerte(jahr));
        }

        let ek = this.berechneEinkommensteuer(this.getSteuerWerte(jahr), jahr);
        vermoegensWerte.ausgaben += ek;

        return vermoegensWerte;
    }

    berechneEinkommensteuer(steuerWerte: SteuerWerte, jahr: number): number {

        const summeDerEinkuenfte = steuerWerte.einnahmen - steuerWerte.werbungskosten;
        const gesamtBetragDerEinkuenfte = summeDerEinkuenfte;
        //TODO Günstigerprüfung Riester
        const einkommen = gesamtBetragDerEinkuenfte - steuerWerte.altersvorsorge - steuerWerte.basisKrankenPflegeVersicherungen - steuerWerte.kinderbetreuungskosten - steuerWerte.riester;
        //TODO Günstigerprüfung Kindergeld
        const zuVersteuerndesEinkommen = einkommen - steuerWerte.kinderfreibetraege;

        let steuer: number;
        if (this.splitting) {
            steuer = this.splittingTarif(zuVersteuerndesEinkommen, jahr);
        } else {
            steuer = this.berechneGrundTarif(zuVersteuerndesEinkommen, jahr);
        }

        return steuer + steuerWerte.kindergeld;
    }

    berechneGrundTarif(zuVersteuerndesEinkommen: number, jahr: number): number {        
        return this.grundTarif.grundTarif(zuVersteuerndesEinkommen, jahr);
    }

    splittingTarif(zuVersteuerndesEinkommen: number, jahr: number): number {
        return this.berechneGrundTarif(zuVersteuerndesEinkommen / 2, jahr) * 2;
    }
}

export interface IGrundTarif {
    grundTarif(zuVersteuerndesEinkommen: number, jahr: number): number;
}

export class FuenfZonenTarif implements IGrundTarif {
    grundfreibetrag: IJahresWert;
    stufe2: IJahresWert;
    stufe3: IJahresWert;
    stufe4: IJahresWert;
    stufe5: IJahresWert;
    eingangssatz: IJahresWert;
    linProgSatz2: IJahresWert;
    linProgSatz3: IJahresWert;
    linSatz4: IJahresWert;
    zone3: Function;
    zone2: Function;

    constructor(grundfreibetrag:IJahresWert, stufe2:IJahresWert, stufe3:IJahresWert, stufe4: IJahresWert, eingangssatz: IJahresWert, linProgSatz2: IJahresWert, linProgSatz3: IJahresWert, linSatz4: IJahresWert) {
        this.grundfreibetrag = grundfreibetrag;  
        this.stufe2 = stufe2; 
        this.stufe3 = stufe3; 
        this.stufe4 = stufe4; 

        this.eingangssatz = eingangssatz;
        this.linProgSatz2 = linProgSatz2;
        this.linProgSatz3 = linProgSatz3;
        this.linSatz4 = linSatz4;

        this.zone2 = this.linQuad(grundfreibetrag, stufe2, eingangssatz, linProgSatz2)
        this.zone3 = this.linQuad(stufe2, stufe3, linProgSatz2, linProgSatz3)
    }

    linQuad(gr_u:IJahresWert, gr_o: IJahresWert, st_u: IJahresWert, st_o:IJahresWert): Function {
        
        return (einkommen: number, jahr: number):number =>{
            let a = (st_o.getWertFuerJahr(jahr) -st_u.getWertFuerJahr(jahr))/(gr_o.getWertFuerJahr(jahr) - gr_u.getWertFuerJahr(jahr))/2;
            let e = einkommen;
            return a*e*e + st_u.getWertFuerJahr(jahr)*e ;
        }
    }

    grundTarif(zuVersteuerndesEinkommen: number, jahr: number): number {
        let steuer: number = 0;
        let restEink = zuVersteuerndesEinkommen;
        let zuVerstTeil: number = 0;

        //zone 5 - linear
        if (zuVersteuerndesEinkommen > this.stufe4.getWertFuerJahr(jahr)) {
            zuVerstTeil = zuVersteuerndesEinkommen - this.stufe4.getWertFuerJahr(jahr);
            steuer += zuVerstTeil*this.linSatz4.getWertFuerJahr(jahr);
            restEink -= zuVerstTeil;
        }
        //zone 4 - linear
        if (restEink > this.stufe3.getWertFuerJahr(jahr)) {
            zuVerstTeil = restEink - this.stufe3.getWertFuerJahr(jahr);
            steuer += (zuVerstTeil)*this.linProgSatz3.getWertFuerJahr(jahr);
            restEink -= zuVerstTeil;
        }
        //zone 3 - linear-progressiv
        if (restEink > this.stufe2.getWertFuerJahr(jahr)) {
            zuVerstTeil = restEink - this.stufe2.getWertFuerJahr(jahr);
            steuer += this.zone3(zuVerstTeil, jahr);
            restEink -= zuVerstTeil;
        }
        //zone 2 - linear-progressiv
        if (restEink > this.grundfreibetrag.getWertFuerJahr(jahr)) {
            zuVerstTeil = restEink - this.grundfreibetrag.getWertFuerJahr(jahr);
            steuer += this.zone2(zuVerstTeil, jahr);
            restEink -= zuVerstTeil;
        }
        //zone 1 - unterhalb des freibetrags ist steuerfrei

        return steuer;
    }
} 