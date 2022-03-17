import {EinkommenSteuer, FuenfZonenTarif} from './EinkommenSteuer';
import { JahresReihe, Periode } from '../base/Reihen';

describe('EinkommenSteuer', ()=>{

    const name = 'es';
    const p = new Periode(2020, 2030)
    const grundfreibetrag = JahresReihe.konstanteReihe(p, 9408);
    const stufe2 = JahresReihe.konstanteReihe(p, 14532);
    const stufe3 = JahresReihe.konstanteReihe(p, 57051);
    const stufe4 = JahresReihe.konstanteReihe(p, 270500);
    const eingangssatz = JahresReihe.konstanteReihe(p, 0.14);
    const linProgSatz2 = JahresReihe.konstanteReihe(p, 0.2397);
    const linProgSatz3 = JahresReihe.konstanteReihe(p, 0.42);
    const linSatz4 = JahresReihe.konstanteReihe(p, 0.45);

    let grundTarif = new FuenfZonenTarif(grundfreibetrag, stufe2, stufe3, stufe4, eingangssatz, linProgSatz2, linProgSatz3, linSatz4 );
    test('constructor', ()=>{
        let es = new EinkommenSteuer(name, grundTarif, false );
        expect(es).toBeInstanceOf(EinkommenSteuer);
    })
})