import { SparKonto } from "./SparKonto";
import { JahresReihe } from "./Reihen";

describe('SparKonto', () => {

    test('constructor', () => { 
        let betrag = new JahresReihe();
        let zins = new JahresReihe();
        
        let sk = new SparKonto("Sparbuch", betrag, zins, 2021, 0);
       expect(sk).toBeInstanceOf(SparKonto);
    })

    test('getStand', () => { 
        let betrag = new JahresReihe();
        betrag.setWertFuerJahr(2021, 1);
        betrag.setWertFuerJahr(2023, 1);

        let zins = new JahresReihe();
        zins.setWertFuerJahr(2021, 1.01);
        zins.setWertFuerJahr(2022, 1.01);
        zins.setWertFuerJahr(2023, 1.01);
        let sk = new SparKonto("Sparbuch", betrag, zins, 2021, 0);

        expect(sk.getStand(2022)).toBeCloseTo(1.01)
        expect(sk.getStand(2023)).toBeCloseTo(2.0201)
    })

})