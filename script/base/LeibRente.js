define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LeibRente = void 0;
    class LeibRente {
        constructor(name, kapital, zinsfaktor, periode) {
            //super(name);
            this.kapital = kapital;
            this.zinsfaktor = zinsfaktor;
            this.periode = periode;
        }
        getJahresRente() {
            let n = this.periode.endeJahr - this.periode.startJahr + 1;
            let q = this.zinsfaktor;
            let K = this.kapital;
            let r;
            if (q > 1) {
                r = K * Math.pow(q, n) * (q - 1) / (Math.pow(q, n) - 1);
            }
            else {
                r = K / n;
            }
            return r;
        }
    }
    exports.LeibRente = LeibRente;
});
