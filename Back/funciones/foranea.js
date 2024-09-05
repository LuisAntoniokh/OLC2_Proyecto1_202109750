import { Invocable } from "./invocables.js";
import { Entorno } from "../Entorno/entorno.js";
import { ReturnExcp } from "../Entorno/transferencia.js";
import { FuncDcl } from "../patron/nodos.js";

export class FuncionForanea extends Invocable{

    constructor(nodo, clousure) {
        super();
        /**
         * @type {FuncDcl}
         */
        this.nodo = nodo;

        /**
         * @type {Entorno}
         */
        this.clousure = clousure;
    }

    aridad() {
        return this.nodo.params.length;
    }


    /**
    * @type {Invocable['invocar']}
    */
    invocar(interprete, args) {
        const entornoNuevo = new Entorno(this.clousure);
        this.nodo.params.forEach((param, i) => {
            entornoNuevo.set(param, args[i]);
        });
        const entornoAntesDeLaLlamada = interprete.entornoActual;
        interprete.entornoActual = entornoNuevo;
        try {
            this.nodo.block.accept(interprete);
        } catch (error) {
            interprete.entornoActual = entornoAntesDeLaLlamada;
            if (error instanceof ReturnExcp) {
                return error.value;
            }
            throw error;
        }

        interprete.entornoActual = entornoAntesDeLaLlamada;
        return null
    }
}