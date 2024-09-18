import { InstanciaStruct } from "./instancia.js";

export class Struct {
    constructor(nombre, propiedades) {
        /**
         * @type {string}
         */
        this.nombre = nombre;

        /**
         * @type {Object.<string, Expresion>}
         */
        this.propiedades = propiedades || {};
    }

    /**
     * Instancia las propiedades del struct.
     */
    instanciar(valoresAsignados = {}) {
        const nuevaInstancia = new InstanciaStruct(this);
        // nuevaInstancia.valores = nuevaInstancia.struct.propiedades;
        console.log(nuevaInstancia.struct);
        Object.entries(this.propiedades).forEach(([nombre, valor]) => {
            if (valoresAsignados.hasOwnProperty(nombre)) {
                nuevaInstancia.set(nombre, valoresAsignados[nombre]); // Asignar el valor proporcionado
            } else {
                nuevaInstancia.set(nombre, valor); // Asignar el valor por defecto (null si no hay valor asignado)
            }
        });

        return nuevaInstancia;
    }
}