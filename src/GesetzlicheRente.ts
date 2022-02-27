import { Knoten, SteuerWerte, VermoegensWerte, IJahresWert } from "./Kalkulation";

export const rentenWerteWest = [
    [2018, 32.02],
    [2019, 33.05],
    [2020, 34.19],
    [2021, 34.19],
];

export const rentenWerteOst = [
    [2018, 30.69],
    [2019, 31.89],
    [2020, 33.23],
    [2021, 33.46],
];

export const rentenfreibetrag = new Map([
    [2019, 0.22],
    [2020, 0.2],
    [2021, 0.19],
    [2022, 0.18],
    [2023, 0.17],
    [2024, 0.16],
    [2025, 0.15],
    [2026, 0.14],
    [2027, 0.13],
    [2028, 0.12],
    [2029, 0.11],
    [2030, 0.1],
    [2031, 0.09],
    [2032, 0.08],
    [2033, 0.07],
    [2034, 0.06],
    [2035, 0.05],
    [2036, 0.04],
    [2037, 0.03],
    [2038, 0.02],
    [2039, 0.01],
    [2040, 0],
]);

/**
 * Gesetzliche Rente
 * 
 * @extends Knoten
 */
export class GesetzlicheRente extends Knoten implements IJahresWert {
    rentenPunkte: number;
    rentenWerte: IJahresWert;
    rentenFreibetrag: number = 0;

    /**
     * 
     * @param name @inheritdoc
     * @param rentenPunkte bereits gesammelte Summe der Rentenpunkte
     * @param rentenWerte Jahresreihe der zu erwartenden Rentenwerte (pro Rentenpunkt)
     * @param rentenBeginn Jahr des Rentenbeginns zur Berechnung des steuerlichen Freibetrags
     */
    constructor(name: string, rentenPunkte: number, rentenWerte: IJahresWert, rentenBeginn: number) {
        super(name);
        this.rentenPunkte = rentenPunkte;
        this.rentenWerte = rentenWerte;
        this.rentenFreibetrag = this.berechneRentenFreibetrag(rentenBeginn);
    }
    getWertFuerJahr(jahr: number): number {
        return this.getRente(jahr);
    }

    getRente(jahr: number): number {
        return this.rentenPunkte * this.rentenWerte.getWertFuerJahr(jahr) * 12;
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let sw = new SteuerWerte();
        sw.einnahmen = Math.max(0, this.getRente(jahr) - this.rentenFreibetrag);
        return sw;
    }

    getVermoegensWerte(jahr: number): VermoegensWerte {
        let vw = new VermoegensWerte();
        vw.einnahmen = this.getRente(jahr);
        return vw;
    }

    berechneRentenFreibetrag(rentenBeginn: number): number {
        return this.getRente(rentenBeginn) * (rentenfreibetrag.get(rentenBeginn) || 0);
    }

    getSpalten() {
        return ["Rente"];
    }

    getZahlen(jahr: number){
        return [this.getRente(jahr)];
    }
}