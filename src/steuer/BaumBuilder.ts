import { Knoten} from "../base/Kalkulation";
import { EinkommenSteuer, FuenfZonenTarif, IGrundTarif } from "./EinkommenSteuer";
import { Person  } from "./person/Personen";
import { Periode, JahresReihe, LineareDynamik  } from "../base/Reihen";
import { BruttoGehalt } from "./person/einkommen/Gehalt";
import { PflegeVersicherung } from "./person/einkommen/PflegeVersicherung";
import { GesetzlRentenVersicherung } from "./person/einkommen/GesetzlicheRentenVersicherung";
import { GKV } from "./person/einkommen/GesetzlicheKrankenVersicherung";
import { GesetzlicheRente } from "./person/einkommen/GesetzlicheRente";


export class BasisWerte {
    periode: Periode;
    grundfreibetrag: JahresReihe;
    stufe2: JahresReihe;
    stufe3: JahresReihe;
    stufe4: JahresReihe;
    eingangssatz: JahresReihe;
    linProgSatz2: JahresReihe;
    linProgSatz3: JahresReihe;
    linSatz4: JahresReihe;
    werbungskostenPauschale: JahresReihe;
    arbeitnehmerAnteilGKV: JahresReihe;
    beitragsBemessungsGrenzeKV: JahresReihe;
    arbeitnehmerAnteilPV: LineareDynamik;
    rentenVersicherung: LineareDynamik;
    beitragsBemessungsGrenzeRente: JahresReihe;
    durchschnittsEntgelte: JahresReihe;
    rentenWerte: JahresReihe;
    

    constructor(p:Periode) {
        this.periode = p;

        this.grundfreibetrag = JahresReihe.konstanteReihe(p, 9408);
        this.stufe2 = JahresReihe.konstanteReihe(p, 14532);
        this.stufe3 = JahresReihe.konstanteReihe(p, 57051);
        this.stufe4 = JahresReihe.konstanteReihe(p, 270500);
        this.eingangssatz = JahresReihe.konstanteReihe(p, 0.14);
        this.linProgSatz2 = JahresReihe.konstanteReihe(p, 0.2397);
        this.linProgSatz3 = JahresReihe.konstanteReihe(p, 0.42);
        this.linSatz4 = JahresReihe.konstanteReihe(p, 0.45);
        this.werbungskostenPauschale = JahresReihe.konstanteReihe(p, 1000);
        this.arbeitnehmerAnteilGKV = JahresReihe.konstanteReihe(p, 0.073);
        this.beitragsBemessungsGrenzeKV = JahresReihe.berechneDynamischeReihe(new Periode(2020, 2100), 56250, new LineareDynamik(1.015));
        this.arbeitnehmerAnteilPV = new LineareDynamik(0.0305 / 2.0); //TODO ab Renteneintritt vollen Beitrag
        this.rentenVersicherung =  new LineareDynamik(0.186);
        this.beitragsBemessungsGrenzeRente = JahresReihe.berechneDynamischeReihe(new Periode(2020, 2100), 6900 * 12, new LineareDynamik(1.015));
        this.durchschnittsEntgelte = JahresReihe.berechneDynamischeReihe(p, 40500, new LineareDynamik(1.03));
        this.rentenWerte = JahresReihe.berechneDynamischeReihe(new Periode(2020, 2100), 33.23, new LineareDynamik(1.025));
    }
}

export class SteuerBaum {
    basisWerte: BasisWerte;
    wurzel: Knoten;
    grundTarif: IGrundTarif;
    einkSteuer: EinkommenSteuer;
    p1: Person;
    p2: Person;

    constructor(basisWerte: BasisWerte) {
        this.basisWerte = basisWerte;
        this.wurzel = new Knoten();
    }

    protected tarif(): SteuerBaum {
        this.grundTarif = new FuenfZonenTarif(this.basisWerte.grundfreibetrag, this.basisWerte.stufe2, this.basisWerte.stufe3, this.basisWerte.stufe4, 
            this.basisWerte.eingangssatz, this.basisWerte.linProgSatz2, this.basisWerte.linProgSatz3, this.basisWerte.linSatz4 );

        return this;
    }

    protected steuer(): SteuerBaum {

        if (!this.grundTarif) {
            this.tarif();
        }
        this.einkSteuer = new EinkommenSteuer('Steuer', this.grundTarif);
        this.wurzel.addKnoten(this.einkSteuer);

        return this;
    }

    zusammenveranlagt(): SteuerBaum {
        this.einkSteuer.splitting = true;
        return this;
    }

    person(p: Person): SteuerBaum {
        
        if (!this.p1) {
            this.p1 = p;
        } else if (!this.p2) {
            this.p2 = p;
        }

        if (!this.einkSteuer) {
            this.steuer();
        }

        this.einkSteuer.addKnoten(p);
        return this;
    }
}

export class PersonenAst {
    basisWerte: BasisWerte;
    person: Person;
    brutto: BruttoGehalt;
    rente: GesetzlicheRente;

    constructor(basisWerte: BasisWerte, name, gebJahr) {
        this.basisWerte = basisWerte;
        this.person = new Person(name, gebJahr);
    }

    gehalt(brutto:number, rentenPunkte: number):PersonenAst {
        //   Jahresreihe, die das zu erwartende Einkommen abbildet,
        //   sowie jährlicher Gehaltserhöhung von 1%
        const einkommen = JahresReihe.berechneDynamischeReihe(this.person.getRestArbeitsPeriode(), brutto, new LineareDynamik(1.01));
        //   Werbungskosten entsprechend der Pauschale
        this.brutto = new BruttoGehalt('Brutto', einkommen, this.basisWerte.werbungskostenPauschale);
        this.person.addKnoten(this.brutto);
        
        //   Arbeitnehmeranteil am gesetzlichen Krankenkassenbeitrag
        const arbeitnehmerAnteilGKV = this.basisWerte.arbeitnehmerAnteilGKV;

        //   Beitragsbemessungsgrenze zur GKV, jährliche angenommene Steigerung von 1,5%
        const beitragsBemessungsGrenzeKV = this.basisWerte.beitragsBemessungsGrenzeKV; 
        this.person.addKnoten(new GKV("GKV", einkommen, arbeitnehmerAnteilGKV, beitragsBemessungsGrenzeKV));

        //   Arbeitnehmeranteil Pflegeversicherung
        const arbeitnehmerAnteilPV = this.basisWerte.arbeitnehmerAnteilPV; 
        this.person.addKnoten(new PflegeVersicherung("PV", einkommen, arbeitnehmerAnteilPV, beitragsBemessungsGrenzeKV));

        //   Gesetzliche Rentenversicherung - Anteil
        const rentenVers = this.basisWerte.rentenVersicherung;
        //   Beitragsbemessungsgrenze, inkl. Steigerung von jährlich 1,5%
        const beitragsBemessungsGrenzeRente = this.basisWerte.beitragsBemessungsGrenzeRente;
        //   Durchschnittsentgelte zur Berechnung der Rentenpunkte
        const durchschnittsEntgelte = this.basisWerte.durchschnittsEntgelte;
        const rentenVersKnoten = new GesetzlRentenVersicherung("gesetzl. RentenVers", einkommen, rentenVers, beitragsBemessungsGrenzeRente, durchschnittsEntgelte)
        this.person.addKnoten(rentenVersKnoten);

        this.rente = new GesetzlicheRente("Rente", rentenPunkte + rentenVersKnoten.getRentenPunkteGesamt(this.person.getRestArbeitsPeriode()), this.basisWerte.rentenWerte, this.person.getRentenBeginn());
        this.person.addKnoten(this.rente);
        return this;
    }
}