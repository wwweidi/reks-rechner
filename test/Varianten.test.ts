import { LeererKnoten } from "../dist/Kalkulation";
import { VariantenWeiche, VariantenVergleich } from "../dist/Varianten";
import { TestBlatt } from "./Kalkulation.test";

describe('VariantenWeiche', () => {

    test('constructor mit 1 Knoten', () => {
        let b = new TestBlatt();
        let v = new VariantenWeiche("variante", b);

        expect(v.getAktiverKnoten()).toBe(b);
        expect(v.getSpalten()).toEqual(b.getSpalten());
        expect(v.getZahlen(1)).toEqual(b.getZahlen(1));
        expect(v.getSteuerWerte(2).einnahmen).toBe(2);
        expect(v.getVermoegensWerte(3).einnahmen).toBe(6);
    });

    test('constructor mit Blatt und LeerKnoten', () => {
        let b = new TestBlatt();
        let l = new LeererKnoten();
        let v = new VariantenWeiche("variante", b, l);

        expect(v.getAktiverKnoten()).toBe(b);
        expect(v.getSpalten()).toEqual(b.getSpalten().concat(l.getSpalten()));
        expect(v.getZahlen(1)).toEqual(b.getZahlen(1).concat(l.getZahlen(1)));
        expect(v.getSteuerWerte(2).einnahmen).toBe(2);
        expect(v.getVermoegensWerte(3).einnahmen).toBe(6);
    });

    test('constructor mit Blatt und LeerKnoten umgeschaltet', () => {
        let b = new TestBlatt();
        let l = new LeererKnoten();
        let v = new VariantenWeiche("variante", b, l);

        v.setAktiverKnoten(l);
        expect(v.getAktiverKnoten()).toBe(l);
        expect(v.getSteuerWerte(1).einnahmen).toBe(0);
        expect(v.getVermoegensWerte(2).einnahmen).toBe(0);
    });
});
describe('VariantenVergleich', () => {

    test('', () => {
        let b = new TestBlatt();
        let l = new LeererKnoten();
        let v = new VariantenWeiche("variante", b, l);

        let vergleich = new VariantenVergleich("Vergleich", v, v);

        expect(vergleich.getSpalten()).toEqual(['v1', 'v2']);
        expect(vergleich.getZahlen(1)).toEqual([1, -1]);
    });
});
