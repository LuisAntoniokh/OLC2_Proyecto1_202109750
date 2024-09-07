import { Entorno } from "./Entorno/entorno.js";
import { BaseVisitor } from "./patron/visitor.js";
import nodos, { Expresion } from "./patron/nodos.js";
import { BreakExcp, ContinueExcp, ReturnExcp } from "./Entorno/transferencia.js";
import { Invocable } from "./funciones/invocables.js";
import { embebidas } from "./funciones/embebidas.js";
import { FuncionForanea } from "./funciones/foranea.js";

export class InterpreterVisitor extends BaseVisitor {

    constructor() {
        super();
        this.entornoActual = new Entorno();
        Object.entries(embebidas).forEach(([nombre, funcion]) => {
            this.entornoActual.set(nombre, funcion);
        });
        this.salida = '';

        /**     
         * @type {Expresion | null}
         */
        this.prevConti = null;
    }

    /**
      * @type {BaseVisitor['visitOperacionBinaria']}
      */
    visitOperacionBinaria(node) {
        const izq = node.izq.accept(this);
        const der = node.der.accept(this);

        if(izq.tipo === 'string' || der.tipo === 'string'){
            switch (node.op) {
                case '+':
                    return { valor: izq.valor + der.valor, tipo: 'string' };
                case '==':
                    return { valor: izq.valor == der.valor, tipo: 'bool' };
                case '!=':
                    return { valor: izq.valor != der.valor, tipo: 'bool' };
                default:
                    throw new Error(`Operador no soportado: ${node.op}`);
            }
        }

        if(izq.tipo === 'int' && der.tipo === 'int'){
            switch (node.op) {
                case '+':
                    return { valor: parseInt(izq.valor + der.valor, 10), tipo: 'int' };
                case '-':
                    return { valor: parseInt(izq.valor - der.valor, 10), tipo: 'int' };
                case '*':
                    return { valor: parseInt(izq.valor * der.valor, 10), tipo: 'int' };
                case '/':
                    return { valor: Math.floor(izq.valor / der.valor), tipo: 'int' };
                case '%':
                    return { valor: izq.valor % der.valor, tipo: 'int' };
                case '==':
                    return { valor: izq.valor == der.valor, tipo: 'bool' };
                case '!=':
                    return { valor: izq.valor != der.valor, tipo: 'bool' };
                case '>':
                    return { valor: izq.valor > der.valor, tipo: 'bool' };
                case '<':
                    return { valor: izq.valor < der.valor, tipo: 'bool' };
                case '>=':
                    return { valor: izq.valor >= der.valor, tipo: 'bool' };
                case '<=':
                    return { valor: izq.valor <= der.valor, tipo: 'bool' };
                default:
                    throw new Error(`Operador no soportado: ${node.op}`);
            }
        } 
        
        if((izq.tipo === 'int' && der.tipo === 'float') || (izq.tipo === 'float' && der.tipo === 'int') || (izq.tipo === 'float' && der.tipo === 'float')){ 
            switch (node.op) {
                case '+':
                    return { valor: (izq.valor + der.valor).toFixed(4), tipo: 'float' };
                case '-':
                    return { valor: (izq.valor - der.valor).toFixed(4), tipo: 'float' };
                case '*':
                    return { valor: (izq.valor * der.valor).toFixed(4), tipo: 'float' };
                case '/':
                    return { valor: (izq.valor / der.valor).toFixed(4), tipo: 'float' };
                case '==':
                    return { valor: izq.valor == der.valor, tipo: 'bool' };
                case '!=':
                    return { valor: izq.valor != der.valor, tipo: 'bool' };
                case '>':
                    return { valor: izq.valor > der.valor, tipo: 'bool' };
                case '<':
                    return { valor: izq.valor < der.valor, tipo: 'bool' };
                case '>=':
                    return { valor: izq.valor >= der.valor, tipo: 'bool' };
                case '<=':
                    return { valor: izq.valor <= der.valor, tipo: 'bool' };
                default:
                    throw new Error(`Operador no soportado: ${node.op}`);
            }
        } 
        
        if(izq.tipo === 'char' && der.tipo === 'char'){
            switch (node.op) {
                case '==':
                    return { valor: izq.valor == der.valor, tipo: 'bool' };
                case '!=':
                    return { valor: izq.valor != der.valor, tipo: 'bool' };
                case '>':
                    return { valor: izq.valor.charCodeAt(0) > der.valor.charCodeAt(0), tipo: 'bool' };
                case '<':
                    return { valor: izq.valor.charCodeAt(0) < der.valor.charCodeAt(0), tipo: 'bool' };
                case '>=':
                    return { valor: izq.valor.charCodeAt(0) >= der.valor.charCodeAt(0), tipo: 'bool' };
                case '<=':
                    return { valor: izq.valor.charCodeAt(0) <= der.valor.charCodeAt(0), tipo: 'bool' };
                default:
                    throw new Error(`Operador no soportado: ${node.op}`);
            }
        }
        
        if(izq.tipo === 'bool' && der.tipo === 'bool'){
            switch (node.op) {
                case '==':
                    return { valor: izq.valor == der.valor, tipo: 'bool' };
                case '!=':
                    return { valor: izq.valor != der.valor, tipo: 'bool' };
                case '&&':
                    return { valor: izq.valor && der.valor, tipo: 'bool' };
                case '||':
                    return { valor: izq.valor || der.valor, tipo: 'bool' };
                default:
                    throw new Error(`Operador no soportado: ${node.op}`);
            }
        }

        else {
            throw new Error('Tipos no soportados');
        }
    }

    /**
      * @type {BaseVisitor['visitOperacionUnaria']}
      */
    visitOperacionUnaria(node) {
        const exp = node.exp.accept(this);

        if(exp.tipo === 'int'){
            switch (node.op) {
                case '-':
                    return { valor: -exp.valor, tipo: 'int' };
                default:
                    throw new Error(`Operador no soportado: ${node.op}`);
            }
        } else if(exp.tipo === 'float'){
            switch (node.op) {
                case '-':
                    return { valor: (-exp.valor).toFixed(4), tipo: 'float' };
                default:
                    throw new Error(`Operador no soportado: ${node.op}`);
            }
        } 
        
        if (exp.tipo === 'bool'){
            switch (node.op) {
                case '!':
                    return { valor: !exp.valor, tipo: 'bool' };
                default:
                    throw new Error(`Operador no soportado: ${node.op}`);
            }
        } else {
            throw new Error('Tipos no soportados');
        }
    }

    /**
      * @type {BaseVisitor['visitAgrupacion']}
      */
    visitAgrupacion(node) {
        return node.exp.accept(this);
    }

    /**
      * @type {BaseVisitor['visitNumero']}
      */
    visitNumero(node) {
        return node.valor;
    }


    /**
     * @type {BaseVisitor['visitDeclaracionVariable']}
     */
    visitDeclaracionVariable(node) {
        const nombreVariable = node.id;
        const valorVariable = node.exp.accept(this);

        this.entornoActual.set(nombreVariable, valorVariable);
    }


    /**
      * @type {BaseVisitor['visitReferenciaVariable']}
      */
    visitReferenciaVariable(node) {
        const nombreVariable = node.id;
        return this.entornoActual.get(nombreVariable);
    }


    /**
      * @type {BaseVisitor['visitPrint']}
      */
    visitPrint(node) {
        const valor = node.exp.accept(this);
        this.salida += valor.valor + '\n';
    }


    /**
      * @type {BaseVisitor['visitExpresionStmt']}
      */
    visitExpresionStmt(node) {
        node.exp.accept(this);
    }

    /**
      * @type {BaseVisitor['visitAsignacion']}
      */
    visitAsignacion(node) {
        const value = node.asgn.accept(this);
        this.entornoActual.assign(node.id, value);
        return value;
    }

    /**
      * @type {BaseVisitor['visitBloque']}
      */
    visitBloque(node) {
        const entornoAnterior = this.entornoActual;
        this.entornoActual = new Entorno(entornoAnterior);
        node.block.forEach(loop => loop.accept(this));
        this.entornoActual = entornoAnterior;
    }

    /**
      * @type {BaseVisitor['visitIf']}
      */
    visitIf(node) {
        const condicion = node.cond.accept(this);

        if (condicion) {
            node.iftrue.accept(this);
            return;
        }

        if (node.iffalse) {
            node.iffalse.accept(this);
        }
    }

    /**
      * @type {BaseVisitor['visitWhile']}
      */
    visitWhile(node) {
        const startingEnv = this.entornoActual;
        try{
            while (node.cond.accept(this)) {
                node.loop.accept(this);
            }
        } catch (error) {
            this.entornoActual = startingEnv;
            if (error instanceof BreakExcp){
                console.log('Break');
                return;
            }
            if (error instanceof ContinueExcp){
                console.log('Continue');
                return this.visitWhile(node);
            }
            throw error;
        }
    }

    /**
      * @type {BaseVisitor['visitFor']}
      */
    visitFor(node) {
        const lastInc = node.prevConti;
        this.prevConti = node.inc;

        const forT = new nodos.Bloque({
            block: [
                node.init,
                new nodos.While({
                    cond: node.cond,
                    loop: new nodos.Bloque({
                        block: [
                            node.loop,
                            node.inc
                        ]
                    })
                })
            ]
        })
        forT.accept(this);
        this.prevConti = lastInc;
    }

    /** 
     * @type {BaseVisitor['visitBreak']}
     */
    visitBreak(node) {
        throw new BreakExcp();
    }

    /**
      * @type {BaseVisitor['visitContinue']}
      */
    visitContinue(node) {
        if (this.prevConti) {
            this.prevConti.accept(this);
        }
        throw new ContinueExcp();
    }

    /**
      * @type {BaseVisitor['visitReturn']}
    */
    visitReturn(node) {
        let value = null
        if(node.exp){
            value = node.exp.accept(this);
        }
        throw new ReturnExcp(value);
    }

    /**
      * @type {BaseVisitor['visitLlamada']}
      */
    visitLlamada(node){
        const funcion = node.callee.accept(this);
        const argumentos = node.args.map(arg => arg.accept(this));
        if(!(funcion instanceof Invocable)){
            throw new Error('No es invocable');
        }
        if(funcion.aridad() !== argumentos.length){
            throw new Error('Aridad incorrecta');
        }
        return funcion.invocar(this, argumentos)
    }

    /**
      * @type {BaseVisitor['visitFuncDcl']}
      */
    visitFuncDcl(node){
        const funcion = new FuncionForanea(node, this.entornoActual);
        this.entornoActual.set(node.id, funcion);
    }
    
    /**
      * @type {BaseVisitor['visitPrimal']}
      */
    visitPrimal(node){
        if (node.tipo === 'string'){
            const cleanval = node.valor.replace(/\\,/g, '');
            return { valor : cleanval, tipo : 'string' };
        }
        return { valor : node.valor, tipo : node.tipo };
    }
}