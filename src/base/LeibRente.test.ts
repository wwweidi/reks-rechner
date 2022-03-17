import { LeibRente } from "./LeibRente";
import { JahresReihe, Periode } from "./Reihen";

describe('LeibRente', () => {

    test('constructor', () => { 

        let kapital = 100000;
        let zinsfaktor = 1.05;
        let periode = new Periode(2021, 2022);

        let lr = new LeibRente("LeibRente", kapital, zinsfaktor, periode);
        expect(lr).toBeInstanceOf(LeibRente);
    })

    test('getRente', () => { 
        let kapital = 100000;
        let zinsfaktor = 1.05;
        let periode = new Periode(2021, 2021);

        let lr = new LeibRente("LeibRente", kapital, zinsfaktor, periode);
        expect(lr.getJahresRente()).toBeCloseTo(105000);
    })

    test('getRente ', () => { 
        let kapital = 100000;
        let zinsfaktor = 1.05;
        let periode = new Periode(2021, 2022);

        let lr = new LeibRente("LeibRente", kapital, zinsfaktor, periode);
        expect(lr.getJahresRente()).toBeCloseTo(53780.4878);
    })

    test('getRente ohne Verzinsung', () => { 
        let kapital = 100000;
        let zinsfaktor = 1.0;
        let periode = new Periode(2021, 2030);

        let lr = new LeibRente("LeibRente", kapital, zinsfaktor, periode);
        expect(lr.getJahresRente()).toBeCloseTo(kapital/10);
    })

    test('getRente ein Jahr', () => { 
        let kapital = 100000;
        let zinsfaktor = 1.1;
        let periode = new Periode(2021, 2021);

        let lr = new LeibRente("LeibRente", kapital, zinsfaktor, periode);
        expect(lr.getJahresRente()).toBeCloseTo(110000);
    })
})