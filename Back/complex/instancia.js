import { Struct } from "./struct.js";

export class InstanciaStruct {
    constructor(struct) {
        /**
         * @type {Struct}
         * */
        this.struct = struct;
        this.valores = {};
    }

    set(nombre, valor) {
        this.valores[nombre] = valor;
    }

    get(nombre) {
        if(this.valores.hasOwnProperty(nombre)) {
            return this.valores[nombre];
        }

        throw new Error(`Propiedad no encontrada: ${nombre}`);
    }
}
