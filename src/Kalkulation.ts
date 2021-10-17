export interface IKalkulationsSchema {
    getSteuerWerte(jahr: number): SteuerWerte;
    getVermoegensWerte(jahr: number): VermoegensWerte;
}

export interface IJahresWert {
    getWertFuerJahr(jahr: number): number;
}

export class SteuerWerte {
    einnahmen: number = 0;
    grundfreibetraege = 0;
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
        this.grundfreibetraege += werte.grundfreibetraege;
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

export interface IDruck {
    getSpalten(): string[];
    getZahlen(jahr: number): number[];
}

export interface IKnoten extends IKalkulationsSchema, IDruck {

    getKnoten(): Set<IKnoten>;
}

export class LeererKnoten implements IKnoten {
    getKnoten(): Set<IKnoten> {
        return new Set();
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

export class Knoten implements IKnoten {
    name: string;
    knoten: Set<IKnoten> = new Set();

    constructor(name: string) {
        this.name = name;
    }

    getKnoten() {
        return this.knoten;
    }

    getSpalten(): string[] {
        return ["Einnahmen", "Ausgaben", "Verfügbar", "Abgezinst"]
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

        for (let blatt of this.knoten) {
            vermoegensWerte.addiereWerte(blatt.getVermoegensWerte(jahr));
        }
        return vermoegensWerte;
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let steuerWerte = new SteuerWerte();

        for (let blatt of this.knoten) {
            steuerWerte.addiereWerte(blatt.getSteuerWerte(jahr));
        }
        return steuerWerte;
    }

    addKnoten(blatt: IKnoten) {
        this.knoten.add(blatt);
        return this;
    }

    removeKnoten(blatt: IKnoten) {
        this.knoten.delete(blatt);
        return this;
    }
}


