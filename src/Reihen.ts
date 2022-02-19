
import { IJahresWert } from "./Kalkulation";

export class Periode {
    startJahr: number;
    endeJahr: number;

    constructor(startJahr: number, endeJahr: number) {
        this.startJahr = startJahr;
        this.endeJahr = endeJahr;
    }

    enthaelt(jahr: number): boolean {
        return this.startJahr <= jahr && this.endeJahr >= jahr;
    }
}

export class LineareDynamik implements IJahresWert {
    faktor: number;
    constructor(faktor: number) {
        this.faktor = faktor;
    }

    getWertFuerJahr(_jahr: number) {
        return this.faktor;
    }
}

interface JahresIndex {
    [jahr:number]: number;
}

export class JahresReihe implements IJahresWert {

    jahresWert: JahresIndex;

    constructor(reihe: JahresIndex = []) {
        this.jahresWert = reihe;
    }

    getWertFuerJahr(jahr: number): number {
        return this.jahresWert[jahr] || 0;
    }

    setWertFuerJahr(jahr: number, wert: number) {
        this.jahresWert[jahr] = wert;
    }

    static berechneDynamischeReihe(periode: Periode, startWert: number, dynamik: IJahresWert): JahresReihe {
        let jaehrlicheWerte = [];
        jaehrlicheWerte[periode.startJahr] = startWert;

        for (let i = periode.startJahr + 1; i <= periode.endeJahr; i++) {
            jaehrlicheWerte[i] = jaehrlicheWerte[i - 1] * (dynamik.getWertFuerJahr(i))
        }
        return new JahresReihe(jaehrlicheWerte);
    }

    static konstanteReihe(periode: Periode, wert: number): JahresReihe {
        let jaehrlicheWerte = [];

        for (let i = periode.startJahr; i <= periode.endeJahr; i++) {
            jaehrlicheWerte[i] = wert
        }
        return new JahresReihe(jaehrlicheWerte);
    }
}

export class KombinierteWerte implements IJahresWert {

    jahresWerte: Set<IJahresWert> = new Set();

    addWerte(jahresWert: IJahresWert): KombinierteWerte {
        this.jahresWerte.add(jahresWert);
        return this;
    }

    getWertFuerJahr(jahr: number): number {
        let summe = 0;
        for (let jahresWert of this.jahresWerte) {
            summe += jahresWert.getWertFuerJahr(jahr);
        }
        return summe;
    }
}
