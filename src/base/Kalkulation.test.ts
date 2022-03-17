import { IKnoten, Knoten, GenerischerKnoten, SteuerWerte,  VermoegensWerte } from "./Kalkulation";

describe('Knoten', () => {

    test('constructor', () => {
        const name = "Name";
        let k = new Knoten(name);
        expect(k).toBeInstanceOf(Knoten);
        expect(k.name).toBe(name);
        expect(k.knoten).toBeInstanceOf(Set);
    })

    test('getVermoegenswerte ohne blatt', () => {
        let k = new Knoten("name");
        let vw = k.getVermoegensWerte(1);

        expect(vw.einnahmen).toBe(0);
        expect(vw.ausgaben).toBe(0);
    })

    test('getVermoegenswerte mit blatt', () => {
        let k = new Knoten("baum");
        let b = new TestBlatt();
        k.addKnoten(b);

        let vw = k.getVermoegensWerte(1);

        expect(vw.einnahmen).toBe(2);
        expect(vw.ausgaben).toBe(1);
    })

    test('addKnoten', () => {
        let k = new Knoten("Knoten");
        let k2 = new Knoten("Blatt");

        expect(k.knoten.size).toBe(0);
        k.addKnoten(k2);
        expect(k.knoten.size).toBe(1);
    })

    test('removeKnoten', () => {
        let k = new Knoten("name");
        let k2 = new Knoten("Blatt");

        k.addKnoten(k2);
        expect(k.knoten.size).toBe(1);
        k.removeKnoten(k2);
        expect(k.knoten.size).toBe(0);
    })

    test('removeKnoten mit leerem Set', () => {
        let k = new Knoten("name");
        let k2 = new Knoten("Blatt");

        expect(k.knoten.size).toBe(0);
        k.removeKnoten(k2);
        expect(k.knoten.size).toBe(0);
    })
})

export class TestBlatt extends GenerischerKnoten {
    getKnoten(): IKnoten[] {
        return new Array();
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        let sw = new SteuerWerte();
        sw.einnahmen = jahr;
        return sw;
    }
    getSpalten(): string[] {
        return ['Blatt'];
    }

    getZahlen(jahr: number): number[] {
        return [this.getVermoegensWerte(jahr).einnahmen];
    }

    getVermoegensWerte(jahr: number): VermoegensWerte {
        let vw = new VermoegensWerte();
        vw.einnahmen = jahr * 2;
        vw.ausgaben = jahr;
        return vw;
    }
}
