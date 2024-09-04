import { Entorno } from "./Entorno/entorno.js";
import { BaseVisitor } from "./patron/visitor.js";
import nodos, { Expresion } from "./patron/nodos.js";
import { BreakExcp, ContinueExcp, ReturnExcp } from "./Entorno/transferencia.js";
import { Invocable } from "./funciones/invocables.js";
import { embebidas } from "./funciones/embebidas.js";

export class InterpreterVisitor extends BaseVisitor {

    constructor() {
        super();
        this.entornoActual = new Entorno();
        Object.entries(embebidas).forEach(([nombre, funcion]) => {
            this.entornoActual.setVariable(nombre, funcion);
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

        switch (node.op) {
            case '+':
                return izq + der;
            case '-':
                return izq - der;
            case '*':
                return izq * der;
            case '/':
                return izq / der;
            case '%':
                return izq % der;
            case '<=':
                return izq <= der;
            case '==':
                return izq === der;
            default:
                throw new Error(`Operador no soportado: ${node.op}`);
        }
    }

    /**
      * @type {BaseVisitor['visitOperacionUnaria']}
      */
    visitOperacionUnaria(node) {
        const exp = node.exp.accept(this);

        switch (node.op) {
            case '-':
                return -exp;
            default:
                throw new Error(`Operador no soportado: ${node.op}`);
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

        this.entornoActual.setVariable(nombreVariable, valorVariable);
    }


    /**
      * @type {BaseVisitor['visitReferenciaVariable']}
      */
    visitReferenciaVariable(node) {
        const nombreVariable = node.id;
        return this.entornoActual.getVariable(nombreVariable);
    }


    /**
      * @type {BaseVisitor['visitPrint']}
      */
    visitPrint(node) {
        const valor = node.exp.accept(this);
        this.salida += valor + '\n';
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
        this.entornoActual.assignVariable(node.id, value);
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
        const args = node.args.map(arg => arg.accept(this));
        if(!(funcion instanceof Invocable)){
            throw new Error('No es invocable');
        }
        if(funcion.aridad() !== args.length){
            throw new Error('Aridad incorrecta');
        }
        return funcion.invocar(this, args)
    }
}