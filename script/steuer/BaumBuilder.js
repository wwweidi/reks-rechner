define(["require", "exports", "../base/Kalkulation", "./EinkommenSteuer", "./person/Personen", "../base/Reihen", "./person/einkommen/Gehalt", "./person/einkommen/PflegeVersicherung", "./person/einkommen/GesetzlicheRentenVersicherung", "./person/einkommen/GesetzlicheKrankenVersicherung", "./person/einkommen/GesetzlicheRente"], function (require, exports, Kalkulation_1, EinkommenSteuer_1, Personen_1, Reihen_1, Gehalt_1, PflegeVersicherung_1, GesetzlicheRentenVersicherung_1, GesetzlicheKrankenVersicherung_1, GesetzlicheRente_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PersonenAst = exports.SteuerBaum = exports.BasisWerte = void 0;
    class BasisWerte {
        constructor(p) {
            this.periode = p;
            this.grundfreibetrag = Reihen_1.JahresReihe.konstanteReihe(p, 9408);
            this.stufe2 = Reihen_1.JahresReihe.konstanteReihe(p, 14532);
            this.stufe3 = Reihen_1.JahresReihe.konstanteReihe(p, 57051);
            this.stufe4 = Reihen_1.JahresReihe.konstanteReihe(p, 270500);
            this.eingangssatz = Reihen_1.JahresReihe.konstanteReihe(p, 0.14);
            this.linProgSatz2 = Reihen_1.JahresReihe.konstanteReihe(p, 0.2397);
            this.linProgSatz3 = Reihen_1.JahresReihe.konstanteReihe(p, 0.42);
            this.linSatz4 = Reihen_1.JahresReihe.konstanteReihe(p, 0.45);
            this.werbungskostenPauschale = Reihen_1.JahresReihe.konstanteReihe(p, 1000);
            this.arbeitnehmerAnteilGKV = Reihen_1.JahresReihe.konstanteReihe(p, 0.073);
            this.beitragsBemessungsGrenzeKV = Reihen_1.JahresReihe.berechneDynamischeReihe(new Reihen_1.Periode(2020, 2100), 56250, new Reihen_1.LineareDynamik(1.015));
            this.arbeitnehmerAnteilPV = new Reihen_1.LineareDynamik(0.0305 / 2.0); //TODO ab Renteneintritt vollen Beitrag
            this.rentenVersicherung = new Reihen_1.LineareDynamik(0.186);
            this.beitragsBemessungsGrenzeRente = Reihen_1.JahresReihe.berechneDynamischeReihe(new Reihen_1.Periode(2020, 2100), 6900 * 12, new Reihen_1.LineareDynamik(1.015));
            this.durchschnittsEntgelte = Reihen_1.JahresReihe.berechneDynamischeReihe(p, 40500, new Reihen_1.LineareDynamik(1.03));
            this.rentenWerte = Reihen_1.JahresReihe.berechneDynamischeReihe(new Reihen_1.Periode(2020, 2100), 33.23, new Reihen_1.LineareDynamik(1.025));
        }
    }
    exports.BasisWerte = BasisWerte;
    class SteuerBaum {
        constructor(basisWerte) {
            this.basisWerte = basisWerte;
            this.wurzel = new Kalkulation_1.Knoten();
        }
        tarif() {
            this.grundTarif = new EinkommenSteuer_1.FuenfZonenTarif(this.basisWerte.grundfreibetrag, this.basisWerte.stufe2, this.basisWerte.stufe3, this.basisWerte.stufe4, this.basisWerte.eingangssatz, this.basisWerte.linProgSatz2, this.basisWerte.linProgSatz3, this.basisWerte.linSatz4);
            return this;
        }
        steuer() {
            if (!this.grundTarif) {
                this.tarif();
            }
            this.einkSteuer = new EinkommenSteuer_1.EinkommenSteuer('Steuer', this.grundTarif);
            this.wurzel.addKnoten(this.einkSteuer);
            return this;
        }
        zusammenveranlagt() {
            this.einkSteuer.splitting = true;
            return this;
        }
        person(p) {
            if (!this.p1) {
                this.p1 = p;
            }
            else if (!this.p2) {
                this.p2 = p;
            }
            if (!this.einkSteuer) {
                this.steuer();
            }
            this.einkSteuer.addKnoten(p);
            return this;
        }
    }
    exports.SteuerBaum = SteuerBaum;
    class PersonenAst {
        constructor(basisWerte, name, gebJahr) {
            this.basisWerte = basisWerte;
            this.person = new Personen_1.Person(name, gebJahr);
        }
        gehalt(brutto, rentenPunkte) {
            //   Jahresreihe, die das zu erwartende Einkommen abbildet,
            //   sowie jährlicher Gehaltserhöhung von 1%
            const einkommen = Reihen_1.JahresReihe.berechneDynamischeReihe(this.person.getRestArbeitsPeriode(), brutto, new Reihen_1.LineareDynamik(1.01));
            //   Werbungskosten entsprechend der Pauschale
            this.brutto = new Gehalt_1.BruttoGehalt('Brutto', einkommen, this.basisWerte.werbungskostenPauschale);
            this.person.addKnoten(this.brutto);
            //   Arbeitnehmeranteil am gesetzlichen Krankenkassenbeitrag
            const arbeitnehmerAnteilGKV = this.basisWerte.arbeitnehmerAnteilGKV;
            //   Beitragsbemessungsgrenze zur GKV, jährliche angenommene Steigerung von 1,5%
            const beitragsBemessungsGrenzeKV = this.basisWerte.beitragsBemessungsGrenzeKV;
            this.person.addKnoten(new GesetzlicheKrankenVersicherung_1.GKV("GKV", einkommen, arbeitnehmerAnteilGKV, beitragsBemessungsGrenzeKV));
            //   Arbeitnehmeranteil Pflegeversicherung
            const arbeitnehmerAnteilPV = this.basisWerte.arbeitnehmerAnteilPV;
            this.person.addKnoten(new PflegeVersicherung_1.PflegeVersicherung("PV", einkommen, arbeitnehmerAnteilPV, beitragsBemessungsGrenzeKV));
            //   Gesetzliche Rentenversicherung - Anteil
            const rentenVers = this.basisWerte.rentenVersicherung;
            //   Beitragsbemessungsgrenze, inkl. Steigerung von jährlich 1,5%
            const beitragsBemessungsGrenzeRente = this.basisWerte.beitragsBemessungsGrenzeRente;
            //   Durchschnittsentgelte zur Berechnung der Rentenpunkte
            const durchschnittsEntgelte = this.basisWerte.durchschnittsEntgelte;
            const rentenVersKnoten = new GesetzlicheRentenVersicherung_1.GesetzlRentenVersicherung("gesetzl. RentenVers", einkommen, rentenVers, beitragsBemessungsGrenzeRente, durchschnittsEntgelte);
            this.person.addKnoten(rentenVersKnoten);
            this.rente = new GesetzlicheRente_1.GesetzlicheRente("Rente", rentenPunkte + rentenVersKnoten.getRentenPunkteGesamt(this.person.getRestArbeitsPeriode()), this.basisWerte.rentenWerte, this.person.getRentenBeginn());
            this.person.addKnoten(this.rente);
            return this;
        }
    }
    exports.PersonenAst = PersonenAst;
});
