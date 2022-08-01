export interface IKalkulationsSchema {
    getSteuerWerte(jahr: number): SteuerWerte;
    getVermoegensWerte(jahr: number): VermoegensWerte;
}

export interface IJahresWert {
    getWertFuerJahr(jahr: number): number;
}

export class SteuerWerte {
    einnahmen: number = 0;
    werbungskosten: number = 0;
    sonderausgaben: number = 0;
    basisKrankenPflegeVersicherungen: number = 0;
    altersvorsorge: number = 0;
    riester: number = 0;
    sonstigeVorsorge: number = 0;
    kinderbetreuungskosten: number = 0;
    kinderfreibetraege: number = 0;
    kindergeld: number = 0;

    addiereWerte(werte: SteuerWerte) {
        this.einnahmen += werte.einnahmen;
        this.werbungskosten += werte.werbungskosten;
        this.sonderausgaben += werte.sonderausgaben;
        /** kv 
         * unbegrenzt
         * basiskrankenversicherung
         * pflegeversicherung
         */
        this.basisKrankenPflegeVersicherungen += werte.basisKrankenPflegeVersicherungen;

        /**
         * Altersvorsorgeaufwendungen (Beiträge zur gesetzlichen Rentenversicherung, zu berufsständischen Versorgungseinrichtungen 
         * und zu Rürup-Rentenversicherungen) sind insgesamt absetzbar bis zu einem bestimmten Höchstbetrag. 
         * Sie wirken sich allerdings bis zum Jahre 2025 tatsächlich nur mit einem bestimmten Prozentsatz steuermindernd aus. 
         * Dieser Prozentsatz verändert sich jährlich, begann im Jahre 2005 mit 60 % und steigt bis zum Jahre 2025 auf 100 %.
         */
        this.altersvorsorge += werte.altersvorsorge;

        /** 
         *  riester (extra, da separater höchstbetrag bis 2.100,-)
         */
        this.riester += werte.riester;

        /**sonstige
         * bis 1.900 Euro abzugsfähig, wenn höchstbetrag durch andere nicht ausgeschöpft 
         * 
         * Zu den sonstigen Vorsorgeaufwendungen gehören vor allem Beiträge zur Arbeitslosenversicherung, 
         * zu Berufsunfähigkeits-, Unfall- und Haftpflichtversicherungen, zu Risikolebensversicherungen, 
         * zur privaten Krankenversicherungen (die über die Basisabsicherung hinausgehen) und zu privaten Pflegeversicherungen. 
         * Außerdem werden hier noch Kapitallebensversicherungen und Rentenversicherungen mit Kapitalwahlrecht (berücksichtigt zu 88 %) 
         * sowie Rentenversicherungen ohne Kapitalwahlrecht erfasst, die vor 2005 abgeschlossen worden sind.*/
        this.sonstigeVorsorge += werte.sonstigeVorsorge;

        this.kinderfreibetraege += werte.kinderfreibetraege;
        this.kinderbetreuungskosten += werte.kinderbetreuungskosten;
        this.kindergeld += werte.kindergeld;
    }
}

export class VermoegensWerte {
    einnahmen: number = 0;
    ausgaben: number = 0;
    vermoegen: number = 0;

    addiereWerte(werte: VermoegensWerte) {
        this.einnahmen += werte.einnahmen;
        this.ausgaben += werte.ausgaben;
        this.vermoegen += werte.vermoegen;
    }
}

export interface IAusgabe {
    getSpalten(): string[];
    getZahlen(jahr: number): number[];
    printSpalten(): string[];
    printZahlen(jahr: number): string[];
}

export interface IKnoten extends IKalkulationsSchema, IAusgabe {

    getKnoten(): IKnoten[];
}

export abstract class GenerischerKnoten implements IKnoten {
    knoten: Set<IKnoten> = new Set();
    name: string;
    
    /**
     * 
     * @param name Bezeichnung des Knoten
     */
    constructor(name: string = '') {
        this.name = name;
    }

    getKnoten(): IKnoten[] {
        return Array.from(this.knoten.values());
    }

    abstract getSteuerWerte(jahr: number): SteuerWerte ;
    abstract getVermoegensWerte(jahr: number): VermoegensWerte;
    abstract getSpalten(): string[];
    abstract getZahlen(jahr: number): number[];
    
    printSpalten(): string[] {

        let names: string[] = this.getSpalten();
        for (let k of this.getKnoten()) {
            names = names.concat(k.printSpalten())
        }
        return names;
    }
    
    printZahlen(jahr: number): string[] {
    
        let numbers: string[] = this.getZahlen(jahr).map(value => (value / 12).toFixed(0));
        for (let k of this.getKnoten()) {
            numbers = numbers.concat(k.printZahlen(jahr));
        }
        return numbers;
    }
}

export class Knoten extends GenerischerKnoten {

    getSpalten(): string[] {
        return ["Einnahmen " + this.name, "Ausgaben " + this.name, "Verfügbar " + this.name, "Abgezinst " + this.name]
    }

    getZahlen(jahr: number, startJahr: number = 2020): number[] {
        let z = this.getVermoegensWerte(jahr);
        let differenz = z.einnahmen - z.ausgaben;
        let anzJahre = jahr - startJahr;
        let divisor = Math.pow(1.02, anzJahre);
        return [z.einnahmen, z.ausgaben, differenz, differenz / divisor];
    }

    getVermoegensWerte(jahr: number): VermoegensWerte {
        let vermoegensWerte = new VermoegensWerte();

        for (let blatt of this.getKnoten()) {
            vermoegensWerte.addiereWerte(blatt.getVermoegensWerte(jahr));
        }
        return vermoegensWerte;
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let steuerWerte = new SteuerWerte();

        for (let blatt of this.getKnoten()) {
            steuerWerte.addiereWerte(blatt.getSteuerWerte(jahr));
        }
        return steuerWerte;
    }

    /**
     * Blatt zur Liste hinzufügen
     * 
     * @param blatt 
     * @returns this
     */
    addKnoten(blatt: IKnoten) {
        this.knoten.add(blatt);
        return this;
    }

    removeKnoten(blatt: IKnoten) {
        this.knoten.delete(blatt);
        return this;
    }
}

export class LeererKnoten extends GenerischerKnoten {

    getKnoten(): IKnoten[] {
        return new Array();
    }

    getSteuerWerte(_jahr: number): SteuerWerte {
        return new SteuerWerte();
    }
    getVermoegensWerte(_jahr: number): VermoegensWerte {
        return new VermoegensWerte();
    }
    getSpalten(): string[] {
        return ["Ohne"];
    }
    getZahlen(_jahr: number): number[] {
        return [0];
    }
}
