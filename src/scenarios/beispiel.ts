import { IKnoten, Knoten, SteuerWerte,  VermoegensWerte } from "../base/Kalkulation";
import { EinkommenSteuer, FuenfZonenTarif } from "../steuer/EinkommenSteuer";
import { Person  } from "../steuer/person/Personen";
import { Periode, JahresReihe, LineareDynamik, KombinierteWerte  } from "../base/Reihen";
import { BruttoGehalt } from "../steuer/person/einkommen/Gehalt";
import { PflegeVersicherung } from "../steuer/person/einkommen/PflegeVersicherung";
import { GesetzlRentenVersicherung } from "../steuer/person/einkommen/GesetzlicheRentenVersicherung";
import { GKV } from "../steuer/person/einkommen/GesetzlicheKrankenVersicherung";
import { GesetzlicheRente, rentenWerteOst } from "../steuer/person/einkommen/GesetzlicheRente";

// Generischer Knoten als Wurzel des Baumes
const familie = new Knoten('Mustermann');

// diesem folgt die Berechnung der Einkommensteuer, da dies fast alle Werte benötigt  
const p = new Periode(2020, 2060)
const grundfreibetrag = JahresReihe.konstanteReihe(p, 9408);
const stufe2 = JahresReihe.konstanteReihe(p, 14532);
const stufe3 = JahresReihe.konstanteReihe(p, 57051);
const stufe4 = JahresReihe.konstanteReihe(p, 270500);
const eingangssatz = JahresReihe.konstanteReihe(p, 0.14);
const linProgSatz2 = JahresReihe.konstanteReihe(p, 0.2397);
const linProgSatz3 = JahresReihe.konstanteReihe(p, 0.42);
const linSatz4 = JahresReihe.konstanteReihe(p, 0.45);

const grundTarif = new FuenfZonenTarif(grundfreibetrag, stufe2, stufe3, stufe4, eingangssatz, linProgSatz2, linProgSatz3, linSatz4 );
// Zusammenveranlagung auf 'true' gesetzt
const einkommensteuer = new EinkommenSteuer('Zusammenveranlagung', grundTarif, true);
familie.addKnoten(einkommensteuer);

//   Väterliches Elternteil als Person, mit Geburtsjahr
const vater = new Person('Papa', 1971);
einkommensteuer.addKnoten(vater);

//   Periode, von jetzt bis zum regulären Renteneintritt 
const arbeitsPeriodeVater = vater.getRestArbeitsPeriode();

//   Jahresreihe, die das zu erwartende Einkommen abbildet,
//   mit dem Durchschnittsbrutto von 2020 und jährlicher Gehaltserhöhung von 1%
const einkommenVater = JahresReihe.berechneDynamischeReihe(arbeitsPeriodeVater, 3975*12, new LineareDynamik(1.01));

//   Werbungskosten entsprechend der Pauschale
const werbungskostenVater = JahresReihe.konstanteReihe(arbeitsPeriodeVater, 1000);
const bruttoVater = new BruttoGehalt('Brutto Vater', einkommenVater, werbungskostenVater);
vater.addKnoten(bruttoVater);

//   Periode, von jetzt bis zum erwarteten Lebensende 
const restLebensPeriodeVater = vater.getRestLebensPeriode();

//   Arbeitnehmeranteil am gesetzlichen Krankenkassenbeitrag
const arbeitnehmerAnteilGKV = new LineareDynamik(0.073); // 7,3%

//   Beitragsbemessungsgrenze zur GKV, jährliche angenommene Steigerung von 1,5%
const beitragsBemessungsGrenzeKV = JahresReihe.berechneDynamischeReihe(restLebensPeriodeVater, 56250, new LineareDynamik(1.015));
vater.addKnoten(new GKV("GKV Vater", bruttoVater, arbeitnehmerAnteilGKV, beitragsBemessungsGrenzeKV));

//   Arbeitnehmeranteil Pflegeversicherung
const arbeitnehmerAnteilPV = new LineareDynamik(0.0305 / 2.0); //TODO ab Renteneintritt vollen Beitrag
vater.addKnoten(new PflegeVersicherung("PV Vater", bruttoVater, arbeitnehmerAnteilPV, beitragsBemessungsGrenzeKV));

//   Gesetzliche Rentenversicherung - Anteil
const rentenVers = new LineareDynamik(0.186);
//   Beitragsbemessungsgrenze, inkl. Steigerung von jährlich 1,5%
const beitragsBemessungsGrenzeRente = JahresReihe.berechneDynamischeReihe(new Periode(2020, 2100), 6900 * 12, new LineareDynamik(1.015));
//   Durchschnittsentgelte zur Berechnung der Rentenpunkte
const durchschnittsEntgelte = JahresReihe.berechneDynamischeReihe(restLebensPeriodeVater, 40500, new LineareDynamik(1.03));
vater.addKnoten(new GesetzlRentenVersicherung("gesetzl. RentenVers Vater", bruttoVater, rentenVers, beitragsBemessungsGrenzeRente, durchschnittsEntgelte));

let mutter = new Person("Mutter", 1972);
einkommensteuer.addKnoten(mutter);
let arbeitsPeriodeMutter = mutter.getRestArbeitsPeriode();
let bruttoMutter = new BruttoGehalt("Brutto Mutter", JahresReihe.berechneDynamischeReihe(arbeitsPeriodeMutter, 1750*12, new LineareDynamik(1.0)), JahresReihe.konstanteReihe(arbeitsPeriodeMutter, 1000));
mutter.addKnoten(bruttoMutter);

mutter.addKnoten(new GKV("GKV Mutter", bruttoMutter, arbeitnehmerAnteilGKV, beitragsBemessungsGrenzeKV));
mutter.addKnoten(new PflegeVersicherung("PV Mutter", bruttoMutter, arbeitnehmerAnteilPV, beitragsBemessungsGrenzeKV));

let rentenWerte = new JahresReihe();
rentenWerte.setWertFuerJahr(2020, 33.23);
rentenWerte.setWertFuerJahr(2021, 33.46);
let renteMutter = new GesetzlicheRente("Rente Mutter", 32.4, rentenWerte, 2021);

mutter.addKnoten(renteMutter);

let spalten = familie.printSpalten();
console.log(spalten);

for (let j = 2021; j <= 2021; j++) {
    let zahlen = familie.printZahlen(j);
    console.log(zahlen)
}