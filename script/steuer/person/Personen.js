define(["require", "exports", "../../base/Kalkulation", "../../base/Reihen"], function (require, exports, Kalkulation_1, Reihen_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Kind = exports.Person = void 0;
    class Person extends Kalkulation_1.Knoten {
        constructor(name, geburtsjahr) {
            super(name);
            this.geburtsjahr = geburtsjahr;
        }
        static getRegulaeresRenteneintrittsalter(geburtsjahr) {
            if (geburtsjahr < 1947) {
                return 65;
            }
            else if (geburtsjahr < 1961) { //gerundet, da hier nur auf Jahresebene gerechnet wird
                return 66;
            }
            else {
                return 67;
            }
        }
        getAktuellesJahr() {
            return new Date().getFullYear();
        }
        getAlter() {
            return this.getAktuellesJahr() - this.geburtsjahr;
        }
        getRestLebensErwartung() {
            return Math.round(this.getAlter() / 20 + Math.max(85, this.getAlter()) - this.getAlter());
        }
        getRestArbeitsPeriode() {
            return new Reihen_1.Periode(this.getAktuellesJahr(), this.getRentenBeginn() - 1);
        }
        getRestLebensPeriode() {
            const aktuellesJahr = new Date().getFullYear();
            return new Reihen_1.Periode(aktuellesJahr, aktuellesJahr + this.getRestLebensErwartung());
        }
        getRentenBeginn() {
            const rentenAlter = Person.getRegulaeresRenteneintrittsalter(this.geburtsjahr);
            return this.geburtsjahr + rentenAlter;
        }
    }
    exports.Person = Person;
    class Kind extends Person {
        constructor(name, geburtsjahr, kindergeldSatz, kinderFreibetrag, kinderbetreuungskosten, kindergeldEndeAlter = 25) {
            super(name, geburtsjahr);
            this.kindergeldSatz = kindergeldSatz;
            this.kinderFreibetrag = kinderFreibetrag;
            this.kinderbetreuungskosten = kinderbetreuungskosten;
            this.kindergeldEndeJahr = geburtsjahr + kindergeldEndeAlter;
        }
        getSteuerWerte(jahr) {
            let sw = new Kalkulation_1.SteuerWerte();
            if (jahr <= this.kindergeldEndeJahr) {
                sw.kinderfreibetraege = this.kinderFreibetrag.getWertFuerJahr(jahr);
                sw.kinderbetreuungskosten = this.kinderbetreuungskosten.getWertFuerJahr(jahr);
                sw.kindergeld = 12 * this.kindergeldSatz;
            }
            return sw;
        }
        getVermoegensWerte(jahr) {
            let vw = new Kalkulation_1.VermoegensWerte();
            if (jahr <= this.kindergeldEndeJahr) {
                vw.einnahmen = 12 * this.kindergeldSatz;
            }
            vw.ausgaben = this.kinderbetreuungskosten.getWertFuerJahr(jahr);
            return vw;
        }
        getSpalten() {
            return ["Kindergeld " + this.name];
        }
        getZahlen(jahr) {
            return [this.getVermoegensWerte(jahr).einnahmen];
        }
    }
    exports.Kind = Kind;
});
