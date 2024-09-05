export class Entorno {
    /**
     * @param {Entorno} padre
     */
    constructor(padre = undefined){
        this.valores = {};
        this.padre = padre;
    }

    /**
     * @param {string} id
     * @param {any} valor
     */
    set(id, valor){
        this.valores[id] = valor;
    }

    /**
     * @param {string} id
     */
    get(id){
        const actValue = this.valores[id];
        if(actValue !== undefined) return actValue;

        if(!actValue && this.padre){
            return this.padre.get(id);
        }
        
        throw new Error(`La variable ${id} no está definida`);
    }

    /**
     * @param {string} id
     * @param {any} valor
     */
    assign(id, valor){
        const actValue = this.valores[id];

        if(actValue !== undefined){
            this.valores[id] = valor;
            return;
        }

        if(!actValue && this.padre){
            this.padre.assign(id, valor);
            return;
        }

        throw new Error(`La variable ${id} no está definida`);
    }
}