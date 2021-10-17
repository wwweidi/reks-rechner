import { Periode } from "./Reihen";

export class LeibRente {
    zinsfaktor: number;
    kapital: number;
    periode: Periode;

    constructor(name:string, kapital: number, zinsfaktor:number, periode:Periode) {
        //super(name);
        this.kapital = kapital;
        this.zinsfaktor = zinsfaktor;
        this.periode = periode;
    }


    getJahresRente() {
        let n = this.periode.endeJahr - this.periode.startJahr + 1;
        let q = this.zinsfaktor;
        let K = this.kapital;
        let r :  number;
        if (q > 1) {
           r = K * Math.pow(q, n) * ( q - 1) /  (Math.pow(q, n)-1);
        } else {
            r = K / n;
        }
        return r;
    }
}