import { Periode } from "../base/Reihen";
import { BasisWerte, SteuerBaum, PersonenAst } from "../steuer/BaumBuilder";

  
const p = new Periode(2020, 2060)

const basisWerte = new BasisWerte(p);
const steuerbaum = new SteuerBaum(basisWerte);

steuerbaum
    .person(new PersonenAst(basisWerte, 'Papa', 1971)
            .gehalt(3975*12, 15).person)
    .person(new PersonenAst(basisWerte, 'Mama', 1972)
            .gehalt(1750*12, 10).person)
    .zusammenveranlagt();

// Generischer Knoten als Wurzel des Baumes
const familie = steuerbaum.wurzel;
let spalten = familie.printSpalten();
console.log(spalten);

for (let j = 2021; j <= 2021; j++) {
    let zahlen = familie.printZahlen(j);
    console.log(zahlen)
}