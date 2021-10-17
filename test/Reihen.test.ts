import { JahresReihe, KombinierteWerte, LineareDynamik, Periode } from "../dist/Reihen";

describe('Reihen', () => {

    test('Periode - constructor', () => {
        let p = new Periode(1, 2);

        expect(p.startJahr).toBe(1);
        expect(p.endeJahr).toBe(2);
    })

    test('LineareDynamik', () => {
        const f = 0.5;
        let d = new LineareDynamik(f);

        expect(d.getWertFuerJahr(0)).toBe(f);
        expect(d.getWertFuerJahr(1000)).toBe(f);
        expect(d.getWertFuerJahr(2000)).toBe(f);
    })

    describe('JahresReihe', () => {

        test('constructor mit default', () => {
            let jr = new JahresReihe();

            expect(jr.getWertFuerJahr(1)).toBe(0);
            expect(jr.getWertFuerJahr(2000)).toBe(0);
        })

        test('constructor mit uebergabe', () => {
            let a = [0, 1];
            a[2000] = 2000;
            let jr = new JahresReihe(a);

            expect(jr.getWertFuerJahr(1)).toBe(1);
            expect(jr.getWertFuerJahr(2000)).toBe(2000);
        })

        test('setWertFuerJahr', () => {
            let jr = new JahresReihe();

            jr.setWertFuerJahr(1, 0.01);
            jr.setWertFuerJahr(2001, 0.02);

            expect(jr.getWertFuerJahr(1)).toBe(0.01);
            expect(jr.getWertFuerJahr(2001)).toBe(0.02);
        })

        test('berechneDynamischeReihe', () => {
            let p = new Periode(2000, 2020);
            const f = 1.01;
            let d = new LineareDynamik(f);
            let jr = JahresReihe.berechneDynamischeReihe(p, 1000, d);

            expect(jr.getWertFuerJahr(1999)).toBe(0);
            expect(jr.getWertFuerJahr(2000)).toBe(1000);
            expect(jr.getWertFuerJahr(2001)).toBe(1000 * f);
            expect(jr.getWertFuerJahr(2020)).toBeCloseTo(1000 * Math.pow(f, 20));
            expect(jr.getWertFuerJahr(2021)).toBe(0);
        })

        test('konstanteReihe', () => {
            let p = new Periode(2000, 2020);
            let jr = JahresReihe.konstanteReihe(p, 50000);

            expect(jr.getWertFuerJahr(1999)).toBe(0);
            expect(jr.getWertFuerJahr(2000)).toBe(50000);
            expect(jr.getWertFuerJahr(2001)).toBe(50000);
            expect(jr.getWertFuerJahr(2020)).toBe(50000);
            expect(jr.getWertFuerJahr(2021)).toBe(0);
        })
    })

    describe('KombinierteWerte', () => {

        test('leer', () => {
            let kw = new KombinierteWerte();

            expect(kw.getWertFuerJahr(0)).toBe(0);
            expect(kw.getWertFuerJahr(2137)).toBe(0);
        })

        test('einzeln', () => {
            let kw = new KombinierteWerte();
            kw.addWerte(new LineareDynamik(1));
            expect(kw.getWertFuerJahr(0)).toBe(1);
            expect(kw.getWertFuerJahr(2137)).toBe(1);
        })

        test('summieren', () => {
            let kw = new KombinierteWerte();
            kw.addWerte(new LineareDynamik(1));
            kw.addWerte(new LineareDynamik(2));
            expect(kw.getWertFuerJahr(0)).toBe(3);
            expect(kw.getWertFuerJahr(2137)).toBe(3);
        })
    })
})
