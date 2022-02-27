import {EinkommenSteuer} from '../src/EinkommenSteuer';

describe('EinkommenSteuer', ()=>{

    const name = 'es';

    test('constructor', ()=>{
        let es = new EinkommenSteuer(name, false);
        expect(es).toBeInstanceOf(EinkommenSteuer);
    })

    describe('grundTarif', ()=>{
        
    })

})