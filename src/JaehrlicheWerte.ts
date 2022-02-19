import { IJahresWert } from "./Kalkulation";
import { JahresReihe } from "./Reihen"; 
import * as w from "./GesetzlJahresWerte.json";

export const rentenfreibetrag = {
    2018: 0.24,
    2019: 0.22,
    2020: 0.2,
    2021: 0.19,
    2022: 0.18,
    2023: 0.17,
    2024: 0.16,
    2025: 0.15,
    2026: 0.14,
    2027: 0.13,
    2028: 0.12,
    2029: 0.11,
    2030: 0.1,
    2031: 0.09,
    2032: 0.08,
    2033: 0.07,
    2034: 0.06,
    2035: 0.05,
    2036: 0.04,
    2037: 0.03,
    2038: 0.02,
    2039: 0.01,
    2040: 0
};

type SpaltenWerte = 'rentenWertWest' 
                  | 'rentenWertOst' 
                  | 'rentenFreibetrag' 
                  | 'werbungskostenPauschale'
                  | 'arbeitnehmerAnteilGKV'
                  | 'beitragsBemessungsGrenzeKV'
                  | 'arbeitnehmerAnteilPV'
                  | 'rentenVersichergungsBeitrag'
                  | 'beitragsBemessungsGrenzeRenteWest'
                  | 'beitragsBemessungsGrenzeRenteOst'
                  | 'durchschnittsEntgeltWest'
                  | 'durchschnittsEntgeltOst';

type JaehrlicheWerteZeile = {
    [spalte in SpaltenWerte]: number;
}

type ZeilenIndexJahre = {
    [jahr:number] : JaehrlicheWerteZeile;
}

export class JaehrlicheWerteZeilen {

    werteZeilen: ZeilenIndexJahre = w;

    getSpalte(wert: SpaltenWerte): IJahresWert {
        let that = this;
        return {
            getWertFuerJahr(jahr:number):number {
                return that.werteZeilen[jahr] && that.werteZeilen[jahr][wert];
            }
        }
    }

    getZeile(jahr: number): JaehrlicheWerteZeile {
        return this.werteZeilen[jahr];
    }
}

type SpaltenIndexJahresWerte = {
    [spalte in SpaltenWerte]: IJahresWert
}

export class JahresWerteSpalten {
    werteSpalten: SpaltenIndexJahresWerte ;

    constructor() {
        this.werteSpalten = {
            rentenWertOst: new JahresReihe(),
            rentenWertWest: new JahresReihe(),
            rentenFreibetrag: new JahresReihe(rentenfreibetrag),
        };
    }

    getSpalte(wert: SpaltenWerte): IJahresWert {
        return this.werteSpalten[wert];
    }

    getZeile(jahr: number): JaehrlicheWerteZeile {
        let that = this;
        let zeile = {};
        for (let spalte in this.werteSpalten) {
            zeile[spalte] = that.werteSpalten[spalte].getWertFuerJahr(jahr);
        }

        return zeile as JaehrlicheWerteZeile;
    }
}

export class JahresWerteKombiniert {

    zeilen: JaehrlicheWerteZeilen = new JaehrlicheWerteZeilen();
    spalten: JahresWerteSpalten = new JahresWerteSpalten();

    getSpalte(wert: SpaltenWerte): IJahresWert {
        let that = this;
        return {
            getWertFuerJahr(jahr: number):number {
                if (that.zeilen.getSpalte(wert).getWertFuerJahr(jahr) !== undefined) {
                    return that.zeilen.getSpalte(wert).getWertFuerJahr(jahr);
                } else if (that.spalten.getSpalte(wert).getWertFuerJahr(jahr) !== undefined) {
                    return that.spalten.getSpalte(wert).getWertFuerJahr(jahr);
                } 
                
                throw 'Wert nicht in Spalte oder Zeile gefunden';
            }
        }   
    }
}