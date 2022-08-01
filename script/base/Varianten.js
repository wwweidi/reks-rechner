define(["require", "exports", "./Kalkulation"], function (require, exports, Kalkulation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VariantenVergleich = exports.VariantenWeiche = void 0;
    class VariantenWeiche extends Kalkulation_1.Knoten {
        constructor(name, aktiv, ...inaktiv) {
            super(name);
            this.setAktiverKnoten(aktiv);
            for (let i of inaktiv) {
                this.knoten.add(i);
            }
        }
        setAktiverKnoten(aktiverKnoten) {
            if (!this.knoten.has(aktiverKnoten)) {
                this.knoten.add(aktiverKnoten);
            }
            this.aktiverKnoten = aktiverKnoten;
            return this;
        }
        getAktiverKnoten() {
            return this.aktiverKnoten;
        }
        getSpalten() {
            let spalten = [];
            for (let k of this.knoten) {
                spalten = spalten.concat(k.getSpalten());
            }
            return spalten;
        }
        getZahlen(jahr) {
            let zahlen = [];
            for (let k of this.knoten) {
                zahlen = zahlen.concat(k.getZahlen(jahr));
            }
            return zahlen;
        }
        getVermoegensWerte(jahr) {
            return this.getAktiverKnoten().getVermoegensWerte(jahr);
        }
        getSteuerWerte(jahr) {
            return this.getAktiverKnoten().getSteuerWerte(jahr);
        }
    }
    exports.VariantenWeiche = VariantenWeiche;
    class VariantenVergleich extends Kalkulation_1.Knoten {
        constructor(name, einstiegsKnoten, weiche) {
            super(name);
            this.variante = weiche;
            this.addKnoten(einstiegsKnoten);
        }
        setVariantenWeiche(weiche) {
            this.variante = weiche;
        }
        getSpalten() {
            let spalten = [];
            let i = 1;
            for (let i = 1; i <= this.variante.knoten.size; i++) {
                spalten.push('v' + i);
            }
            return spalten;
        }
        getZahlen(jahr) {
            let zahlen = [];
            for (let v of this.variante.knoten) {
                this.variante.setAktiverKnoten(v);
                let vw = this.getVermoegensWerte(jahr);
                let diff = vw.einnahmen - vw.ausgaben;
                if (zahlen[0]) {
                    diff = diff - zahlen[0];
                }
                zahlen.push(diff);
            }
            return zahlen;
        }
    }
    exports.VariantenVergleich = VariantenVergleich;
});
