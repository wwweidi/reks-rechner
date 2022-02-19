import { IKnoten, Knoten, LeererKnoten, SteuerWerte,  VermoegensWerte } from "../dist/Kalkulation";
import { EinkommenSteuer } from "../dist/EinkommenSteuer";
import { Person  } from "../dist/Personen";
import { Periode, JahresReihe, LineareDynamik, KombinierteWerte  } from "../dist/Reihen";
import { BruttoGehalt } from "../dist/Gehalt";
import { PflegeVersicherung } from "../dist/PflegeVersicherung";
import { GesetzlRentenVersicherung } from "../dist/GesetzlicheRentenVersicherung";
import { GKV } from "../dist/GesetzlicheKrankenVersicherung";
import { GesetzlicheRente, rentenWerteOst } from "../dist/GesetzlicheRente";

// Generischer Knoten als Wurzel des Baumes
const familie = new Knoten('Mustermann');

// diesem folgt die Berechnung der Einkommensteuer, da dies fast alle Werte benötigt  
// Zusammenveranlagung auf 'true' gesetzt
const einkommensteuer = new EinkommenSteuer('Zusammenveranlagung', true);
familie.addKnoten(einkommensteuer);

// Väterliches Elternteil als Person, mit Geburtsjahr
const vater = new Person('Papa', 1971);
einkommensteuer.addKnoten(vater);

// Periode, von jetzt bis zum regulären Renteneintritt 
const arbeitsPeriodeVater = new Periode(2021, 2038);

// Jahresreihe, die das zu erwartende Einkommen abbildet,
// mit dem Durchschnittsbrutto von 2020 und jährlicher Gehaltserhöhung von 1%
const einkommenVater = JahresReihe.berechneDynamischeReihe(arbeitsPeriodeVater, 3975*12, new LineareDynamik(1.01));
// Werbungskosten entsprechend der Pauschale
const werbungskostenVater = JahresReihe.konstanteReihe(arbeitsPeriodeVater, 1000);
const bruttoVater = new BruttoGehalt('Brutto Vater', einkommenVater, werbungskostenVater);
vater.addKnoten(bruttoVater);

// Periode, von jetzt bis zum erwarteten Lebensende 
const restLebensPeriodeVater = new Periode(2021, 2052);
// Arbeitnehmeranteil am gesetzlichen Krankenkassenbeitrag
const arbeitnehmerAnteilGKV = new LineareDynamik(0.073); // 7,3%
// Beitragsbemessungsgrenze zur GKV, jährliche angenommene Steigerung von 1,5%
const beitragsBemessungsGrenzeKV = JahresReihe.berechneDynamischeReihe(restLebensPeriodeVater, 56250, new LineareDynamik(1.015));
vater.addKnoten(new GKV("GKV Vater", bruttoVater, arbeitnehmerAnteilGKV, beitragsBemessungsGrenzeKV));


