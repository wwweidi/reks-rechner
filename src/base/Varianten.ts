import { Knoten, IKnoten, VermoegensWerte, SteuerWerte } from "./Kalkulation";


export class VariantenWeiche extends Knoten {

    aktiverKnoten: IKnoten;

    constructor(name: string, aktiv: IKnoten, ...inaktiv: IKnoten[]) {
        super(name);

        this.setAktiverKnoten(aktiv);
        for (let i of inaktiv) {
            this.knoten.add(i);
        }
    }

    setAktiverKnoten(aktiverKnoten: IKnoten) {
        if (!this.knoten.has(aktiverKnoten)) {
            this.knoten.add(aktiverKnoten);
        }
        this.aktiverKnoten = aktiverKnoten;
        return this;
    }

    getAktiverKnoten() {
        return this.aktiverKnoten;
    }

    getSpalten(): string[] {
        let spalten: string[] = [];
        for (let k of this.knoten) {
            spalten = spalten.concat(k.getSpalten());
        }
        return spalten;
    }

    getZahlen(jahr: number): number[] {
        let zahlen: number[] = [];
        for (let k of this.knoten) {
            zahlen = zahlen.concat(k.getZahlen(jahr));
        }
        return zahlen;
    }

    getVermoegensWerte(jahr: number): VermoegensWerte {
        return this.getAktiverKnoten().getVermoegensWerte(jahr);
    }

    getSteuerWerte(jahr: number): SteuerWerte {
        return this.getAktiverKnoten().getSteuerWerte(jahr);
    }
}

export class VariantenVergleich extends Knoten {

    variante: VariantenWeiche;

    constructor(name: string, einstiegsKnoten: IKnoten, weiche: VariantenWeiche) {
        super(name);
        this.variante = weiche;
        this.addKnoten(einstiegsKnoten);
    }

    setVariantenWeiche(weiche: VariantenWeiche) {
        this.variante = weiche;
    }

    getSpalten(): string[] {
        let spalten = [];
        let i = 1;
        for (let i = 1; i <= this.variante.knoten.size; i++) {
            spalten.push('v' + i);
        }
        return spalten;
    }

    getZahlen(jahr: number): number[] {
        let zahlen = [];

        for (let v of this.variante.knoten) {
            this.variante.setAktiverKnoten(v);
            let vw = this.getVermoegensWerte(jahr);
            let diff = vw.einnahmen - vw.ausgaben;
            if (zahlen[0]) {
                diff = diff - zahlen[0];
            }
            zahlen.push(diff);
        }
        return zahlen;
    }

}
