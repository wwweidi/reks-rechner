import { Knoten, SteuerWerte, VermoegensWerte } from "./Kalkulation";

export class EinkommenSteuer extends Knoten {
    splitting: boolean;

    /**
     * Knoten zur Berechnung der Einkommensteuer
     * 
     * @param name @see Knoten
     * @param splitting Ehegattensplitting / Zusammenveranlagung [true|false]
     */
    constructor(name: string, splitting: boolean = false) {
        super(name);
        this.splitting = splitting;
    }

    getSpalten() {
        return ["Einkommensteuer"];
    }

    getZahlen(jahr: number){
        return [this.berechneEinkommensteuer(this.getSteuerWerte(jahr))];
    }

    getVermoegensWerte(jahr: number): VermoegensWerte {
        let vermoegensWerte = new VermoegensWerte();

        for (let blatt of this.knoten) {
            vermoegensWerte.addiereWerte(blatt.getVermoegensWerte(jahr));
        }

        let ek = this.berechneEinkommensteuer(this.getSteuerWerte(jahr));
        vermoegensWerte.ausgaben += ek;

        return vermoegensWerte;
    }

    berechneEinkommensteuer(steuerWerte: SteuerWerte): number {

        const summeDerEinkuenfte = steuerWerte.einnahmen - steuerWerte.werbungskosten;
        const gesamtBetragDerEinkuenfte = summeDerEinkuenfte;
        //TODO Günstigerprüfung Riester
        const einkommen = gesamtBetragDerEinkuenfte - steuerWerte.altersvorsorge - steuerWerte.basisKrankenPflegeVersicherungen - steuerWerte.kinderbetreuungskosten - steuerWerte.riester;
        //TODO Günstigerprüfung Kindergeld
        const zuVersteuerndesEinkommen = einkommen - steuerWerte.kinderfreibetraege;

        let steuer: number;
        if (this.splitting) {
            steuer = this.splittingTarif(zuVersteuerndesEinkommen);
        } else {
            steuer = this.grundTarif(zuVersteuerndesEinkommen);
        }

        return steuer + steuerWerte.kindergeld;
    }

    grundTarif(zuVersteuerndesEinkommen: number): number {
        const grundfreibetrag = 9408;
        let steuer = 0;
        if (zuVersteuerndesEinkommen <= grundfreibetrag) {
            steuer = 0;
        } else if (zuVersteuerndesEinkommen <= 14532) {
            steuer = (927.87 * ((zuVersteuerndesEinkommen - grundfreibetrag) / 10000) + 1400) * ((zuVersteuerndesEinkommen - grundfreibetrag) / 10000);
        } else if (zuVersteuerndesEinkommen <= 57051) {
            steuer = (212.02 * ((zuVersteuerndesEinkommen - 14532) / 10000) + 2397) * ((zuVersteuerndesEinkommen - 14532) / 10000) + 972.79
        } else if (zuVersteuerndesEinkommen <= 270500) {
            steuer = 0.42 * zuVersteuerndesEinkommen - 8963.74;
        } else {
            steuer = 0.45 * zuVersteuerndesEinkommen - 17078.74
        }

        return steuer;
    }

    splittingTarif(zuVersteuerndesEinkommen: number): number {
        return this.grundTarif(zuVersteuerndesEinkommen / 2) * 2;
    }
}