export class Entorno {
    constructor(){
        this.valores = {};
    }

    /**
     * @param {string} id
     * @param {any} valor
     */

    setVariable(id, valor){
        this.valores[id] = valor;
    }

    /**
     * @param {string} id
     */
    getVariable(id){
        return this.valores[id];
    }
}