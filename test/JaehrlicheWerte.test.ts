import { JaehrlicheWerteZeilen, JahresWerteKombiniert, JahresWerteSpalten } from "../dist/JaehrlicheWerte";

describe('JaehrlicheWerteZeilen', () => {

    test('getZeile gefuellt', () => {

        const jwt = new JaehrlicheWerteZeilen();
        expect(jwt.getZeile(2018).rentenFreibetrag).toEqual(0.24);
    })

    test('getSpalte gefuellt', () => {

        const jwt = new JaehrlicheWerteZeilen();
        expect(jwt.getSpalte('rentenFreibetrag').getWertFuerJahr(2018)).toEqual(0.24);
    })

    test('getSpalte leer', () => {

        const jwt = new JaehrlicheWerteZeilen();
        expect(jwt.getSpalte('rentenFreibetrag').getWertFuerJahr(2017)).toBeUndefined();
    })
});

describe('JahresWerteSpalten', () => {

    test('getZeile', () => {

        const jwt = new JahresWerteSpalten();
        expect(jwt.getZeile(2018).rentenFreibetrag).toEqual(0.24);
    })

    test('getSpalte', () => {

        const jwt = new JahresWerteSpalten();
        expect(jwt.getSpalte('rentenFreibetrag').getWertFuerJahr(2018)).toEqual(0.24);
        expect(jwt.getSpalte('rentenFreibetrag').getWertFuerJahr(2020)).toEqual(0.2);
    })
});

describe('JahresWerteKombiniert', () => {

    test('getSpalte', () => {

        const jwt = new JahresWerteKombiniert();
        expect(jwt.getSpalte('rentenFreibetrag').getWertFuerJahr(2018)).toEqual(0.24);
        expect(jwt.getSpalte('rentenFreibetrag').getWertFuerJahr(2020)).toEqual(0.2);
        expect(jwt.getSpalte('rentenFreibetrag').getWertFuerJahr(2040)).toEqual(0);
        expect(jwt.getSpalte('rentenFreibetrag').getWertFuerJahr(2041)).toEqual(0);
    })
});