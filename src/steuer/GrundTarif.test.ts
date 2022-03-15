import {FuenfZonenTarif} from './EinkommenSteuer';
import {JahresReihe, Periode} from '../base/Reihen';

describe('GrundTarif', ()=>{

    test('grundTarif', ()=> {
        const p = new Periode(2020, 2030)
        const grundfreibetrag = JahresReihe.konstanteReihe(p, 9408);
        const stufe2 = JahresReihe.konstanteReihe(p, 14532);
        const stufe3 = JahresReihe.konstanteReihe(p, 57051);
        const stufe4 = JahresReihe.konstanteReihe(p, 270500);
        const eingangssatz = JahresReihe.konstanteReihe(p, 0.14);
        const linProgSatz2 = JahresReihe.konstanteReihe(p, 0.2397);
        const linProgSatz3 = JahresReihe.konstanteReihe(p, 0.42);
        const linSatz4 = JahresReihe.konstanteReihe(p, 0.45);

        let gt = new FuenfZonenTarif(grundfreibetrag, stufe2, stufe3, stufe4, eingangssatz, linProgSatz2, linProgSatz3, linSatz4 );
        
        expect(gt.grundTarif(9408, 2020)).toBe(0);
        expect(gt.grundTarif(9409, 2020)).toBeCloseTo(0.14);
        expect(gt.grundTarif(14532, 2020)).toBeCloseTo(972.79);
        expect(gt.grundTarif(14533, 2020)).toBeCloseTo(973.03);
        expect(gt.grundTarif(57051, 2020)).toBeCloseTo(14997.68);
        expect(gt.grundTarif(57052, 2020)).toBeCloseTo(57052*0.42 - 8963.74);
        expect(gt.grundTarif(270501, 2020)).toBeCloseTo(270501*0.45 - 17078.74);
    })

})