
/**
 * @typedef {Object} Location
 * @property {Object} start
 * @property {number} start.offset
 * @property {number} start.line
 * @property {number} start.column
 * @property {Object} end
 * @property {number} end.offset
 * @property {number} end.line
 * @property {number} end.column
*/
    

/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */

export class Expresion  {

    /**
    * @param {Object} options
    * @param {Location|null} options.location Ubicacion del nodo en el codigo fuente
    */
    constructor() {
        
        
        /**
         * Ubicacion del nodo en el codigo fuente
         * @type {Location|null}
        */
        this.location = null;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresion(this);
    }
}
    
export class Primal extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.valor Valor del numero
 * @param {string} options.tipo Tipo de la expresion
    */
    constructor({ valor, tipo }) {
        super();
        
        /**
         * Valor del numero
         * @type {Expresion}
        */
        this.valor = valor;


        /**
         * Tipo de la expresion
         * @type {string}
        */
        this.tipo = tipo;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrimal(this);
    }
}
    
export class OperacionBinaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionBinaria(this);
    }
}
    
export class OperacionUnaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ exp, op }) {
        super();
        
        /**
         * Expresion de la operacion
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionUnaria(this);
    }
}
    
export class Agrupacion extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion agrupada
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion agrupada
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAgrupacion(this);
    }
}
    
export class Numero extends Expresion {

    /**
    * @param {Object} options
    * @param {number} options.valor Valor del numero
    */
    constructor({ valor }) {
        super();
        
        /**
         * Valor del numero
         * @type {number}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNumero(this);
    }
}
    
export class DeclaracionVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.exp Expresion de la variable
 * @param {string} options.tipo Tipo de la variable
    */
    constructor({ id, exp, tipo }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion de la variable
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Tipo de la variable
         * @type {string}
        */
        this.tipo = tipo;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionVariable(this);
    }
}
    
export class ReferenciaVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
    */
    constructor({ id }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReferenciaVariable(this);
    }
}
    
export class Print extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.exp Expresion a imprimir
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a imprimir
         * @type {Expresion[]}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrint(this);
    }
}
    
export class ExpresionStmt extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a evaluar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a evaluar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresionStmt(this);
    }
}
    
export class Asignacion extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.asgn Expresion a asignar
    */
    constructor({ id, asgn }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion a asignar
         * @type {Expresion}
        */
        this.asgn = asgn;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacion(this);
    }
}
    
export class Bloque extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.block Lista de sentencias del bloque
    */
    constructor({ block }) {
        super();
        
        /**
         * Lista de sentencias del bloque
         * @type {Expresion[]}
        */
        this.block = block;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBloque(this);
    }
}
    
export class If extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del if
 * @param {Expresion} options.iftrue Bloque de sentencias del if
 * @param {Expresion|undefined} options.iffalse Bloque de sentencias del else
    */
    constructor({ cond, iftrue, iffalse }) {
        super();
        
        /**
         * Condicion del if
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Bloque de sentencias del if
         * @type {Expresion}
        */
        this.iftrue = iftrue;


        /**
         * Bloque de sentencias del else
         * @type {Expresion|undefined}
        */
        this.iffalse = iffalse;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIf(this);
    }
}
    
export class While extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del while
 * @param {Expresion} options.loop Bloque de sentencias del while
    */
    constructor({ cond, loop }) {
        super();
        
        /**
         * Condicion del while
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Bloque de sentencias del while
         * @type {Expresion}
        */
        this.loop = loop;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitWhile(this);
    }
}
    
export class For extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.init Inicializacion del for
 * @param {Expresion} options.cond Condicion del for
 * @param {Expresion} options.inc Incremento del for
 * @param {Expresion} options.loop Bloque de sentencias del for
    */
    constructor({ init, cond, inc, loop }) {
        super();
        
        /**
         * Inicializacion del for
         * @type {Expresion}
        */
        this.init = init;


        /**
         * Condicion del for
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Incremento del for
         * @type {Expresion}
        */
        this.inc = inc;


        /**
         * Bloque de sentencias del for
         * @type {Expresion}
        */
        this.loop = loop;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFor(this);
    }
}
    
export class Break extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        super();
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBreak(this);
    }
}
    
export class Continue extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        super();
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitContinue(this);
    }
}
    
export class Return extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a retornar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a retornar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReturn(this);
    }
}
    
export class Llamada extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.callee Llamada a la función
 * @param {Expresion[]} options.args Argumentos de la funcion
    */
    constructor({ callee, args }) {
        super();
        
        /**
         * Llamada a la función
         * @type {Expresion}
        */
        this.callee = callee;


        /**
         * Argumentos de la funcion
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitLlamada(this);
    }
}
    
export class FuncDcl extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.td Tipo de dato de la funcion
 * @param {string} options.id Identificador de la funcion
 * @param {string[]} options.params Parametros de la funcion
 * @param {Bloque} options.block Bloque de sentencias de la funcion
    */
    constructor({ td, id, params, block }) {
        super();
        
        /**
         * Tipo de dato de la funcion
         * @type {string}
        */
        this.td = td;


        /**
         * Identificador de la funcion
         * @type {string}
        */
        this.id = id;


        /**
         * Parametros de la funcion
         * @type {string[]}
        */
        this.params = params;


        /**
         * Bloque de sentencias de la funcion
         * @type {Bloque}
        */
        this.block = block;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFuncDcl(this);
    }
}
    
export class Switch extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion del switch
 * @param {Array<{exp: Expresion, stmts: Expresion[]}>} options.cases Lista de casos del switch
 * @param {{stmts: Expresion[]} | undefined} options.defo Caso por defecto del switch
    */
    constructor({ exp, cases, defo }) {
        super();
        
        /**
         * Expresion del switch
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Lista de casos del switch
         * @type {Array<{exp: Expresion, stmts: Expresion[]}>}
        */
        this.cases = cases;


        /**
         * Caso por defecto del switch
         * @type {{stmts: Expresion[]} | undefined}
        */
        this.defo = defo;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSwitch(this);
    }
}
    
export class Ternario extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del ternario
 * @param {Expresion} options.iftrue Bloque de sentencias del if
 * @param {Expresion} options.iffalse Bloque de sentencias del else
    */
    constructor({ cond, iftrue, iffalse }) {
        super();
        
        /**
         * Condicion del ternario
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Bloque de sentencias del if
         * @type {Expresion}
        */
        this.iftrue = iftrue;


        /**
         * Bloque de sentencias del else
         * @type {Expresion}
        */
        this.iffalse = iffalse;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitTernario(this);
    }
}
    
export class Embebidas extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de embebida
 * @param {Expresion} options.exp Expresion de la embebida
    */
    constructor({ tipo, exp }) {
        super();
        
        /**
         * Tipo de embebida
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Expresion de la embebida
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitEmbebidas(this);
    }
}
    
export class DeclaracionArreglo extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato del arreglo
 * @param {string} options.id Identificador del arreglo
 * @param {Expresion[]} options.lista Lista de elementos del arreglo
    */
    constructor({ tipo, id, lista }) {
        super();
        
        /**
         * Tipo de dato del arreglo
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador del arreglo
         * @type {string}
        */
        this.id = id;


        /**
         * Lista de elementos del arreglo
         * @type {Expresion[]}
        */
        this.lista = lista;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionArreglo(this);
    }
}
    
export class DeclaracionArregloTam extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato del arreglo
 * @param {string} options.id Identificador del arreglo
 * @param {string} options.tipo2 Tipo de dato del tamaño
 * @param {Expresion} options.tam Tamaño del arreglo
    */
    constructor({ tipo, id, tipo2, tam }) {
        super();
        
        /**
         * Tipo de dato del arreglo
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador del arreglo
         * @type {string}
        */
        this.id = id;


        /**
         * Tipo de dato del tamaño
         * @type {string}
        */
        this.tipo2 = tipo2;


        /**
         * Tamaño del arreglo
         * @type {Expresion}
        */
        this.tam = tam;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionArregloTam(this);
    }
}
    
export class DeclaracionArregloCopia extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato del arreglo
 * @param {string} options.id Identificador del arreglo
 * @param {string} options.id2 Identificador del arreglo a copiar
    */
    constructor({ tipo, id, id2 }) {
        super();
        
        /**
         * Tipo de dato del arreglo
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador del arreglo
         * @type {string}
        */
        this.id = id;


        /**
         * Identificador del arreglo a copiar
         * @type {string}
        */
        this.id2 = id2;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionArregloCopia(this);
    }
}
    
export class AccesoArreglo extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del arreglo
 * @param {Expresion} options.indice Indice del arreglo
    */
    constructor({ id, indice }) {
        super();
        
        /**
         * Identificador del arreglo
         * @type {string}
        */
        this.id = id;


        /**
         * Indice del arreglo
         * @type {Expresion}
        */
        this.indice = indice;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAccesoArreglo(this);
    }
}
    
export class AsignacionArreglo extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del arreglo
 * @param {Expresion} options.indice Indice del arreglo
 * @param {Expresion} options.valor Valor a asignar
    */
    constructor({ id, indice, valor }) {
        super();
        
        /**
         * Identificador del arreglo
         * @type {string}
        */
        this.id = id;


        /**
         * Indice del arreglo
         * @type {Expresion}
        */
        this.indice = indice;


        /**
         * Valor a asignar
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacionArreglo(this);
    }
}
    
export class FuncionArreglo extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del arreglo
 * @param {string} options.funcion Funcion del arreglo
 * @param {Expresion|undefined} options.argumento Argumento de la funcion
    */
    constructor({ id, funcion, argumento }) {
        super();
        
        /**
         * Identificador del arreglo
         * @type {string}
        */
        this.id = id;


        /**
         * Funcion del arreglo
         * @type {string}
        */
        this.funcion = funcion;


        /**
         * Argumento de la funcion
         * @type {Expresion|undefined}
        */
        this.argumento = argumento;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFuncionArreglo(this);
    }
}
    
export class ForEach extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato del arreglo
 * @param {string} options.id Identificador del arreglo
 * @param {Expresion} options.arr Arreglo a recorrer
 * @param {Expresion} options.loop Bloque de sentencias del forEach
    */
    constructor({ tipo, id, arr, loop }) {
        super();
        
        /**
         * Tipo de dato del arreglo
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador del arreglo
         * @type {string}
        */
        this.id = id;


        /**
         * Arreglo a recorrer
         * @type {Expresion}
        */
        this.arr = arr;


        /**
         * Bloque de sentencias del forEach
         * @type {Expresion}
        */
        this.loop = loop;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitForEach(this);
    }
}
    
export class DeclaracionMatriz2D extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato de la matriz
 * @param {string} options.id Identificador de la matriz
 * @param {Expresion[][]|undefined} options.filas Numero de filas de la matriz
 * @param {Expresion|undefined} options.tam1 Tamaño de la primera dimension
 * @param {Expresion|undefined} options.tam2 Tamaño de la segunda dimension
    */
    constructor({ tipo, id, filas, tam1, tam2 }) {
        super();
        
        /**
         * Tipo de dato de la matriz
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la matriz
         * @type {string}
        */
        this.id = id;


        /**
         * Numero de filas de la matriz
         * @type {Expresion[][]|undefined}
        */
        this.filas = filas;


        /**
         * Tamaño de la primera dimension
         * @type {Expresion|undefined}
        */
        this.tam1 = tam1;


        /**
         * Tamaño de la segunda dimension
         * @type {Expresion|undefined}
        */
        this.tam2 = tam2;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionMatriz2D(this);
    }
}
    
export class DeclaracionMatriz3D extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato de la matriz
 * @param {string} options.id Identificador de la matriz
 * @param {Expresion[][][]|undefined} options.capas Lista de capas de la matriz
 * @param {Expresion|undefined} options.tam1 Tamaño de la primera dimensión de la matriz
 * @param {Expresion|undefined} options.tam2 Tamaño de la segunda dimensión de la matriz
 * @param {Expresion|undefined} options.tam3 Tamaño de la tercera dimensión de la matriz
    */
    constructor({ tipo, id, capas, tam1, tam2, tam3 }) {
        super();
        
        /**
         * Tipo de dato de la matriz
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la matriz
         * @type {string}
        */
        this.id = id;


        /**
         * Lista de capas de la matriz
         * @type {Expresion[][][]|undefined}
        */
        this.capas = capas;


        /**
         * Tamaño de la primera dimensión de la matriz
         * @type {Expresion|undefined}
        */
        this.tam1 = tam1;


        /**
         * Tamaño de la segunda dimensión de la matriz
         * @type {Expresion|undefined}
        */
        this.tam2 = tam2;


        /**
         * Tamaño de la tercera dimensión de la matriz
         * @type {Expresion|undefined}
        */
        this.tam3 = tam3;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionMatriz3D(this);
    }
}
    
export class AccesoMatriz2D extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la matriz
 * @param {Expresion} options.indice1 Indice de la primera dimension
 * @param {Expresion} options.indice2 Indice de la segunda dimension
    */
    constructor({ id, indice1, indice2 }) {
        super();
        
        /**
         * Identificador de la matriz
         * @type {string}
        */
        this.id = id;


        /**
         * Indice de la primera dimension
         * @type {Expresion}
        */
        this.indice1 = indice1;


        /**
         * Indice de la segunda dimension
         * @type {Expresion}
        */
        this.indice2 = indice2;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAccesoMatriz2D(this);
    }
}
    
export class AccesoMatriz3D extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la matriz
 * @param {Expresion} options.indice1 Indice de la primera dimension
 * @param {Expresion} options.indice2 Indice de la segunda dimension
 * @param {Expresion} options.indice3 Indice de la tercera dimension
    */
    constructor({ id, indice1, indice2, indice3 }) {
        super();
        
        /**
         * Identificador de la matriz
         * @type {string}
        */
        this.id = id;


        /**
         * Indice de la primera dimension
         * @type {Expresion}
        */
        this.indice1 = indice1;


        /**
         * Indice de la segunda dimension
         * @type {Expresion}
        */
        this.indice2 = indice2;


        /**
         * Indice de la tercera dimension
         * @type {Expresion}
        */
        this.indice3 = indice3;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAccesoMatriz3D(this);
    }
}
    
export class AsignacionMatriz2D extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la matriz
 * @param {Expresion} options.indice1 Indice de la primera dimension
 * @param {Expresion} options.indice2 Indice de la segunda dimension
 * @param {Expresion} options.valor Valor a asignar
    */
    constructor({ id, indice1, indice2, valor }) {
        super();
        
        /**
         * Identificador de la matriz
         * @type {string}
        */
        this.id = id;


        /**
         * Indice de la primera dimension
         * @type {Expresion}
        */
        this.indice1 = indice1;


        /**
         * Indice de la segunda dimension
         * @type {Expresion}
        */
        this.indice2 = indice2;


        /**
         * Valor a asignar
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacionMatriz2D(this);
    }
}
    
export class AsignacionMatriz3D extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la matriz
 * @param {Expresion} options.indice1 Indice de la primera dimension
 * @param {Expresion} options.indice2 Indice de la segunda dimension
 * @param {Expresion} options.indice3 Indice de la tercera dimension
 * @param {Expresion} options.valor Valor a asignar
    */
    constructor({ id, indice1, indice2, indice3, valor }) {
        super();
        
        /**
         * Identificador de la matriz
         * @type {string}
        */
        this.id = id;


        /**
         * Indice de la primera dimension
         * @type {Expresion}
        */
        this.indice1 = indice1;


        /**
         * Indice de la segunda dimension
         * @type {Expresion}
        */
        this.indice2 = indice2;


        /**
         * Indice de la tercera dimension
         * @type {Expresion}
        */
        this.indice3 = indice3;


        /**
         * Valor a asignar
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacionMatriz3D(this);
    }
}
    
export class DeclaracionStruct extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del struct
 * @param {Array<{tipo: string, id: string}>} options.propiedades Propiedades del struct
    */
    constructor({ id, propiedades }) {
        super();
        
        /**
         * Identificador del struct
         * @type {string}
        */
        this.id = id;


        /**
         * Propiedades del struct
         * @type {Array<{tipo: string, id: string}>}
        */
        this.propiedades = propiedades;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionStruct(this);
    }
}
    
export class InstanciaStruct extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la instancia
 * @param {string} options.idStruct Identificador del struct
 * @param {Array<{id: string, valor: Expresion}>} options.asignaciones Asignaciones de la instancia
    */
    constructor({ id, idStruct, asignaciones }) {
        super();
        
        /**
         * Identificador de la instancia
         * @type {string}
        */
        this.id = id;


        /**
         * Identificador del struct
         * @type {string}
        */
        this.idStruct = idStruct;


        /**
         * Asignaciones de la instancia
         * @type {Array<{id: string, valor: Expresion}>}
        */
        this.asignaciones = asignaciones;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitInstanciaStruct(this);
    }
}
    
export class AccesoPropiedadStruct extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la instancia
 * @param {string} options.propiedad Propiedad de la instancia
    */
    constructor({ id, propiedad }) {
        super();
        
        /**
         * Identificador de la instancia
         * @type {string}
        */
        this.id = id;


        /**
         * Propiedad de la instancia
         * @type {string}
        */
        this.propiedad = propiedad;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAccesoPropiedadStruct(this);
    }
}
    
export class AsignacionPropiedadStruct extends Expresion {

    /**
    * @param {Object} options
    * @param {AccesoPropiedadStruct} options.structProp Acceso a la propiedad del struct
 * @param {Expresion} options.valor Valor a asignar
    */
    constructor({ structProp, valor }) {
        super();
        
        /**
         * Acceso a la propiedad del struct
         * @type {AccesoPropiedadStruct}
        */
        this.structProp = structProp;


        /**
         * Valor a asignar
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacionPropiedadStruct(this);
    }
}
    
export default { Expresion, Primal, OperacionBinaria, OperacionUnaria, Agrupacion, Numero, DeclaracionVariable, ReferenciaVariable, Print, ExpresionStmt, Asignacion, Bloque, If, While, For, Break, Continue, Return, Llamada, FuncDcl, Switch, Ternario, Embebidas, DeclaracionArreglo, DeclaracionArregloTam, DeclaracionArregloCopia, AccesoArreglo, AsignacionArreglo, FuncionArreglo, ForEach, DeclaracionMatriz2D, DeclaracionMatriz3D, AccesoMatriz2D, AccesoMatriz3D, AsignacionMatriz2D, AsignacionMatriz3D, DeclaracionStruct, InstanciaStruct, AccesoPropiedadStruct, AsignacionPropiedadStruct }
