define(["require", "exports", "./Reihen"], function (require, exports, Reihen_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SparKonto = void 0;
    class SparKonto {
        constructor(name, betrag, zins, startJahr, startwert = 0) {
            this.name = name;
            this.zins = zins;
            this.startWert = startwert;
            this.startJahr = startJahr;
            this.jahresReihe = new Reihen_1.JahresReihe();
            this.betrag = betrag;
        }
        getStand(jahr) {
            let gespart = this.startWert;
            for (let j = this.startJahr; j <= jahr; j++) {
                gespart = gespart * this.zins.getWertFuerJahr(j) + this.betrag.getWertFuerJahr(j);
            }
            return gespart;
        }
    }
    exports.SparKonto = SparKonto;
});
