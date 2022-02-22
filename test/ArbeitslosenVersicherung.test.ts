import { ArbeitslosenVersicherung} from "../dist/ArbeitslosenVersicherung";
import { JahresReihe, Periode } from "../dist/Reihen";

describe('ALV', ()=>{

    const name = 'Name';
    let brutto;
    let anAnteil;
    let bbg;
    let alv : ArbeitslosenVersicherung;

    beforeEach(()=>{
        brutto = new JahresReihe();
        brutto.setWertFuerJahr(2020, 10000);
        brutto.setWertFuerJahr(2021, 11000);
        brutto.setWertFuerJahr(2022, 12000);

        let p = new Periode(2020, 2022);
        anAnteil = JahresReihe.konstanteReihe(p, 0.015);
        bbg = JahresReihe.konstanteReihe(p, 11000);
        
        alv = new ArbeitslosenVersicherung(name, brutto, anAnteil, bbg);
    })

    test('constructor', ()=>{
        expect(alv).toBeInstanceOf(ArbeitslosenVersicherung);
    })

    test('getSteuerWerte', ()=>{
        let sw = alv.getSteuerWerte(2020);
        expect(sw.basisKrankenPflegeVersicherungen).toEqual(10000*0.015)

        sw = alv.getSteuerWerte(2022);
        expect(sw.basisKrankenPflegeVersicherungen).toEqual(11000*0.015)
    })

    test('getVermoegensWerte', ()=>{
        let vw = alv.getVermoegensWerte(2020);
        expect(vw.ausgaben).toEqual(10000*0.015)

        vw = alv.getVermoegensWerte(2022);
        expect(vw.ausgaben).toEqual(11000*0.015)
    })

})