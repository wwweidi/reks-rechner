define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KombinierteWerte = exports.JahresReihe = exports.LineareDynamik = exports.Periode = void 0;
    class Periode {
        constructor(startJahr, endeJahr) {
            this.startJahr = startJahr;
            this.endeJahr = endeJahr;
        }
        static maximum(p1, p2) {
            return new Periode(Math.min(p1.startJahr, p2.startJahr), Math.max(p1.endeJahr, p2.endeJahr));
        }
        enthaelt(jahr) {
            return this.startJahr <= jahr && this.endeJahr >= jahr;
        }
    }
    exports.Periode = Periode;
    class LineareDynamik {
        constructor(faktor) {
            this.faktor = faktor;
        }
        getWertFuerJahr(_jahr) {
            return this.faktor;
        }
    }
    exports.LineareDynamik = LineareDynamik;
    class JahresReihe {
        constructor(reihe = []) {
            this.jahresWert = reihe;
        }
        getWertFuerJahr(jahr) {
            return this.jahresWert[jahr] || 0;
        }
        setWertFuerJahr(jahr, wert) {
            this.jahresWert[jahr] = wert;
        }
        static berechneDynamischeReihe(periode, startWert, dynamik) {
            let jaehrlicheWerte = [];
            jaehrlicheWerte[periode.startJahr] = startWert;
            for (let i = periode.startJahr + 1; i <= periode.endeJahr; i++) {
                jaehrlicheWerte[i] = jaehrlicheWerte[i - 1] * (dynamik.getWertFuerJahr(i));
            }
            return new JahresReihe(jaehrlicheWerte);
        }
        static konstanteReihe(periode, wert) {
            let jaehrlicheWerte = [];
            for (let i = periode.startJahr; i <= periode.endeJahr; i++) {
                jaehrlicheWerte[i] = wert;
            }
            return new JahresReihe(jaehrlicheWerte);
        }
    }
    exports.JahresReihe = JahresReihe;
    class KombinierteWerte {
        constructor() {
            this.jahresWerte = new Set();
        }
        addWerte(jahresWert) {
            this.jahresWerte.add(jahresWert);
            return this;
        }
        getWertFuerJahr(jahr) {
            let summe = 0;
            for (let jahresWert of this.jahresWerte) {
                summe += jahresWert.getWertFuerJahr(jahr);
            }
            return summe;
        }
    }
    exports.KombinierteWerte = KombinierteWerte;
});
