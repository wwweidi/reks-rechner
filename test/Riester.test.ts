import { Riester } from "../dist/Riester";
import { JahresReihe, Periode, LineareDynamik } from "../dist/Reihen";
import { Kind } from "../dist/Personen";

describe('Riester', () => {

    let einzahlPeriode = new Periode(2020, 2035);
    let auszahlPeriode = new Periode(2036, 2037);
    let beitrag = JahresReihe.konstanteReihe(einzahlPeriode, 2100 - 175);
    let brutto = JahresReihe.konstanteReihe(einzahlPeriode, (2100 - 175) / 0.04);
    const rentenVerzinsung = 1.02;
    
    let r = new Riester("reichster", beitrag, brutto, new Set(), einzahlPeriode, auszahlPeriode, rentenVerzinsung );

    test('constructor', () => {
        expect(r).toBeInstanceOf(Riester);
    })

    describe('Steuerbetrag', () => {
        test('Maximalbetrag', () => {
            expect(r.getSteuerWerte(2025).riester).toEqual(2100);
        })
    })

    describe('Zulagen', () => {

        let brutto = JahresReihe.konstanteReihe(einzahlPeriode, 0);

        test('volle Eigenzulage', () => {

            let r = new Riester("reichster", beitrag, brutto, new Set(), einzahlPeriode, auszahlPeriode, rentenVerzinsung);
            let z = r.getVolleZulagen(2021);
            expect(z).toEqual(175);
        })

        test('volle Eigenzulage mit Kind vor 2008', () => {
           
            let k = new Kind("kind", 2007, 100, JahresReihe.konstanteReihe(new Periode(2007, 2032), 0), JahresReihe.konstanteReihe(new Periode(2007, 2032), 0), 25)
            let kinder = new Set<Kind>();
            kinder.add(k);
            let r = new Riester("reichster", beitrag, brutto, kinder, einzahlPeriode, auszahlPeriode, rentenVerzinsung);

            let z = r.getVolleZulagen(2021);
            expect(z).toEqual(175 + 185);
        })

        test('volle Eigenzulage mit Kind ab 2008', () => {

            let k = new Kind("kind", 2008, 100, JahresReihe.konstanteReihe(new Periode(2008, 2033), 0), JahresReihe.konstanteReihe(new Periode(2008, 2033), 0), 25)
            let kinder = new Set<Kind>();
            kinder.add(k);
            let r = new Riester("reichster", beitrag, brutto, kinder, einzahlPeriode, auszahlPeriode, rentenVerzinsung);

            let z = r.getVolleZulagen(2021);
            expect(z).toEqual(175 + 300);
        })

        test('volle Eigenzulage mit Kind ab 2008, nach Kindergeldbezug', () => {

            let k = new Kind("kind", 2008, 100, JahresReihe.konstanteReihe(new Periode(2008, 2033), 0), JahresReihe.konstanteReihe(new Periode(2008, 2033), 0), 25)
            let kinder = new Set<Kind>();
            kinder.add(k);
            let r = new Riester("reichster", beitrag, brutto, kinder, einzahlPeriode, auszahlPeriode, rentenVerzinsung);

            let z = r.getVolleZulagen(2034);
            expect(z).toEqual(175);
        })

        test('anteilige Eigenzulage', () => {

            let beitrag = JahresReihe.konstanteReihe(einzahlPeriode, (2100 - 175)/2);
            let brutto = JahresReihe.konstanteReihe(einzahlPeriode, 70000);

            let kinder = new Set<Kind>();
            let r = new Riester("reichster", beitrag, brutto, kinder, einzahlPeriode, auszahlPeriode, rentenVerzinsung);

            let z = r.getAnteiligeZulagen(2034);
            expect(z).toEqual(175/2);
        })

        test('anteilige Eigenzulage - kein Einkommen', () => {

            let beitrag = JahresReihe.konstanteReihe(einzahlPeriode, 60);
            let brutto = JahresReihe.konstanteReihe(einzahlPeriode, 0);

            let kinder = new Set<Kind>();
            let r = new Riester("reichster", beitrag, brutto, kinder, einzahlPeriode, auszahlPeriode, rentenVerzinsung);

            let z = r.getAnteiligeZulagen(2034);
            expect(z).toEqual(175);
        })

        test('anteilige Eigenzulage - wenig Einkommen', () => {

            let beitrag = JahresReihe.konstanteReihe(einzahlPeriode, 165);
            let brutto = JahresReihe.konstanteReihe(einzahlPeriode, 25000);

            let kinder = new Set<Kind>();
            let r = new Riester("reichster", beitrag, brutto, kinder, einzahlPeriode, auszahlPeriode, rentenVerzinsung);

            let z = r.getAnteiligeZulagen(2034);
            expect(z).toEqual(35);
        })

        test('volle Zulage, nicht mehr', () => {

            let beitrag = JahresReihe.konstanteReihe(einzahlPeriode, (2100 - 175)*2);
            let brutto = JahresReihe.konstanteReihe(einzahlPeriode, 100000);

            let kinder = new Set<Kind>();
            let r = new Riester("reichster", beitrag, brutto, kinder, einzahlPeriode, auszahlPeriode, rentenVerzinsung);

            let z = r.getAnteiligeZulagen(2034);
            expect(z).toEqual(175);
        })
    })

    describe('Mindesteigenbeitrag', () => {
        test('Mindesteigenbeitrag ohne Einkommen', () => {

            let beitrag = JahresReihe.konstanteReihe(einzahlPeriode, 2100 - 175);
            let brutto = JahresReihe.konstanteReihe(einzahlPeriode, 0);

            let r = new Riester("reichster", beitrag, brutto, new Set(), einzahlPeriode, auszahlPeriode, rentenVerzinsung);

            let eigenbeitrag = r.getMindestEigenbeitrag(2020);
            expect(eigenbeitrag).toEqual(60);
        })

        test('Mindesteigenbeitrag maximal gefördert - Grenzeinkommen', () => {
            let beitrag = JahresReihe.konstanteReihe(new Periode(2020, 2030), 2100 - 175);
            let brutto = JahresReihe.konstanteReihe(new Periode(2020, 2030), 2100 / 0.04);

            let r = new Riester("reichster", beitrag, brutto, new Set(), einzahlPeriode, auszahlPeriode, rentenVerzinsung);

            let eigenbeitrag = r.getMindestEigenbeitrag(2021);
            expect(eigenbeitrag).toEqual(2100 - 175);
        })

        test('Mindesteigenbeitrag maximal gefördert - höreres Einkommen', () => {
            let beitrag = JahresReihe.konstanteReihe(new Periode(2020, 2030), 2100 - 175);
            let brutto = JahresReihe.konstanteReihe(new Periode(2020, 2030), 2100 / 0.04 + 20000);

            let r = new Riester("reichster", beitrag, brutto, new Set(), einzahlPeriode, auszahlPeriode, rentenVerzinsung);

            let eigenbeitrag = r.getMindestEigenbeitrag(2021);
            expect(eigenbeitrag).toEqual(2100 - 175);
        })
    })

    describe('Ausgabe', ()=> {

        test('Kosten', ()=> {
            let beitrag = JahresReihe.konstanteReihe(einzahlPeriode, 2100);
            let brutto = JahresReihe.konstanteReihe(einzahlPeriode, 100000);

            let r = new Riester("reichster", beitrag, brutto, new Set(), einzahlPeriode, auszahlPeriode, rentenVerzinsung);
            expect(r.getSpalten()).toEqual(['Kosten', 'RRente']);
            expect(r.getZahlen(2030)).toEqual([2100, 0]);
        })
    })

    describe('Rente', ()=> {

        test('getAngespartesVermögen', ()=> {

            let r = new Riester("reichster", beitrag, brutto, new Set(), einzahlPeriode, auszahlPeriode, 1.0, new LineareDynamik(1.0));

            expect(r.getAngespartesProJahr(einzahlPeriode).getWertFuerJahr(einzahlPeriode.startJahr)).toEqual( 2100);
            expect(r.getAngespartesProJahr(einzahlPeriode).getWertFuerJahr(einzahlPeriode.endeJahr)).toEqual( 2100);

            expect(r.getAngespartesVermoegen()).toBe( 2100*16);
        })

        test('RRente', ()=> {

            let r = new Riester("reichster", beitrag, brutto, new Set(), einzahlPeriode, auszahlPeriode, 1.0, new LineareDynamik(1.0));
            expect(r.getSpalten()).toEqual(['Kosten', 'RRente']);
            expect(r.getZahlen(2036)[1]).toBe( 16*2100 /2);


        })
    })
})
