import { Entorno } from "./Entorno/entorno.js";
import { BaseVisitor } from "./patron/visitor.js";
import nodos, { Expresion } from "./patron/nodos.js";
import { BreakExcp, ContinueExcp, ReturnExcp } from "./Entorno/transferencia.js";
import { Invocable } from "./funciones/invocables.js";
import { embebidas } from "./funciones/embebidas.js";
import { FuncionForanea } from "./funciones/foranea.js";
import { SymbolTable } from "./Entorno/simbolo.js";
import { ErrorSemantico } from "./Entorno/errores.js";

export class InterpreterVisitor extends BaseVisitor {

    constructor() {
        super();
        this.entornoActual = new Entorno();
        Object.entries(embebidas).forEach(([nombre, funcion]) => {
            this.entornoActual.set(nombre, funcion, 'embebida');
        });
        this.salida = '';
        this.symbolTable = new SymbolTable();
        this.errs = new ErrorSemantico();

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
        
        if (izq.valor === null || der.valor === null) {
            this.errs.addError('Operación con valor null', node.location.start.line, node.location.start.column, 'Semántico');
            return { valor: null, tipo: 'null' };
        }
    
        if(izq.tipo === 'string' || der.tipo === 'string'){
            switch (node.op) {
                case '+':
                    return { valor: izq.valor + der.valor, tipo: 'string' };
                case '==':
                    return { valor: izq.valor == der.valor, tipo: 'boolean' };
                case '!=':
                    return { valor: izq.valor != der.valor, tipo: 'boolean' };
                default:
                    this.errs.addError('Operador no soportado', node.location.start.line, node.location.start.column, 'Semántico');
                    return { valor: null, tipo: 'null' };
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
                    if (der.valor === 0) {
                        this.errs.addError('División por cero', node.location.start.line, node.location.start.column, 'Semántico');
                        return { valor: null, tipo: 'null' };
                    } return { valor: Math.floor(izq.valor / der.valor), tipo: 'int' };
                case '%':
                    if (der.valor === 0) {
                        this.errs.addError('Módulo por cero', node.location.start.line, node.location.start.column, 'Semántico');
                        return { valor: null, tipo: 'null' };
                    } return { valor: izq.valor % der.valor, tipo: 'int' };
                case '==':
                    return { valor: izq.valor == der.valor, tipo: 'boolean' };
                case '!=':
                    return { valor: izq.valor != der.valor, tipo: 'boolean' };
                case '>':
                    return { valor: izq.valor > der.valor, tipo: 'boolean' };
                case '<':
                    return { valor: izq.valor < der.valor, tipo: 'boolean' };
                case '>=':
                    return { valor: izq.valor >= der.valor, tipo: 'boolean' };
                case '<=':
                    return { valor: izq.valor <= der.valor, tipo: 'boolean' };
                default:
                    this.errs.addError('Operador no soportado', node.location.start.line, node.location.start.column, 'Semántico');
                    return { valor: null, tipo: 'null' };
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
                    if (der.valor === 0) {
                        this.errs.addError('División por cero', node.location.start.line, node.location.start.column, 'Semántico');
                        return { valor: null, tipo: 'null' };
                    } return { valor: izq.valor / der.valor, tipo: 'float' };
                case '==':
                    return { valor: izq.valor == der.valor, tipo: 'boolean' };
                case '!=':
                    return { valor: izq.valor != der.valor, tipo: 'boolean' };
                case '>':
                    return { valor: izq.valor > der.valor, tipo: 'boolean' };
                case '<':
                    return { valor: izq.valor < der.valor, tipo: 'boolean' };
                case '>=':
                    return { valor: izq.valor >= der.valor, tipo: 'boolean' };
                case '<=':
                    return { valor: izq.valor <= der.valor, tipo: 'boolean' };
                default:
                    this.errs.addError('Operador no soportado', node.location.start.line, node.location.start.column, 'Semántico');
                    return { valor: null, tipo: 'null' };
            }
        } 
        
        if(izq.tipo === 'char' && der.tipo === 'char'){
            switch (node.op) {
                case '==':
                    return { valor: izq.valor == der.valor, tipo: 'boolean' };
                case '!=':
                    return { valor: izq.valor != der.valor, tipo: 'boolean' };
                case '>':
                    return { valor: izq.valor.charCodeAt(0) > der.valor.charCodeAt(0), tipo: 'boolean' };
                case '<':
                    return { valor: izq.valor.charCodeAt(0) < der.valor.charCodeAt(0), tipo: 'boolean' };
                case '>=':
                    return { valor: izq.valor.charCodeAt(0) >= der.valor.charCodeAt(0), tipo: 'boolean' };
                case '<=':
                    return { valor: izq.valor.charCodeAt(0) <= der.valor.charCodeAt(0), tipo: 'boolean' };
                default:
                    this.errs.addError('Operador no soportado', node.location.start.line, node.location.start.column, 'Semántico');
                    return { valor: null, tipo: 'null' };
            }
        }
        
        if(izq.tipo === 'boolean' && der.tipo === 'boolean'){
            switch (node.op) {
                case '==':
                    return { valor: izq.valor == der.valor, tipo: 'boolean' };
                case '!=':
                    return { valor: izq.valor != der.valor, tipo: 'boolean' };
                case '&&':
                    return { valor: izq.valor && der.valor, tipo: 'boolean' };
                case '||':
                    return { valor: izq.valor || der.valor, tipo: 'boolean' };
                default:
                    this.errs.addError('Operador no soportado', node.location.start.line, node.location.start.column, 'Semántico');
                    return { valor: null, tipo: 'null' };
            }
        }

        else {
            this.errs.addError('Operacion no soportada', node.location.start.line, node.location.start.column, 'Semántico');
            return { valor: null, tipo: 'null' };
        }
    }

    /**
      * @type {BaseVisitor['visitOperacionUnaria']}
      */
    visitOperacionUnaria(node) {
        const exp = node.exp.accept(this);

        if (exp.valor === null) {
            this.errs.addError('Operación con valor null', node.location.start.line, node.location.start.column, 'Semántico');
            return { valor: null, tipo: 'null' };
        }

        if(exp.tipo === 'int'){
            switch (node.op) {
                case '-':
                    return { valor: -exp.valor, tipo: 'int' };
                default:
                    this.errs.addError('Operador no soportado', node.location.start.line, node.location.start.column, 'Semántico');
                    return { valor: null, tipo: 'null' };
            }
        } else if(exp.tipo === 'float'){
            switch (node.op) {
                case '-':
                    return { valor: (-exp.valor).toFixed(4), tipo: 'float' };
                default:
                    this.errs.addError('Operador no soportado', node.location.start.line, node.location.start.column, 'Semántico');
                    return { valor: null, tipo: 'null' };
            }
        } 
        
        if (exp.tipo === 'boolean'){
            switch (node.op) {
                case '!':
                    return { valor: !exp.valor, tipo: 'boolean' };
                default:
                    this.errs.addError('Operador no soportado', node.location.start.line, node.location.start.column, 'Semántico');
                    return { valor: null, tipo: 'null' };
            }
        } else {
            this.errs.addError('Tipos no soportados', node.location.start.line, node.location.start.column, 'Semántico');
            return { valor: null, tipo: 'null' };
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
        const tipoVariable = node.tipo;
        const linea = node.location.start.line;
        const columna = node.location.start.column;
        const env = 'global';
        if (node.exp === undefined) {
            this.entornoActual.set(nombreVariable, null, tipoVariable);
            this.symbolTable.addSymbol(nombreVariable, 'variable', tipoVariable, env, linea, columna);
            return;
        } 
        if (tipoVariable === "var"){
            const valorVariable = node.exp.accept(this);
            this.entornoActual.set(nombreVariable, valorVariable.valor, valorVariable.tipo);
            this.symbolTable.addSymbol(nombreVariable, 'variable', valorVariable.tipo, env, linea, columna);
            return;
        }
        if (tipoVariable !== node.exp.tipo){
            this.errs.addError(`Tipo de dato incorrecto: ${tipoVariable} != ${node.exp.tipo}`, linea, columna, 'Semántico');
            this.symbolTable.addSymbol(nombreVariable, 'variable', tipoVariable, env, linea, columna);
            return;
        }
        const valorVariable = node.exp.accept(this);
        this.entornoActual.set(nombreVariable, valorVariable.valor, tipoVariable);
        this.symbolTable.addSymbol(nombreVariable, 'variable', tipoVariable, env, linea, columna);
    }

    /**
      * @type {BaseVisitor['visitReferenciaVariable']}
      */
    visitReferenciaVariable(node) {
        const nombreVariable = node.id;
        const value = this.entornoActual.get(nombreVariable);
        if (value === undefined) {
            this.errs.addError(`Variable no declarada o fuera del ámbito: ${nombreVariable}`, node.location.start.line, node.location.start.column, 'Semántico');
            return { valor: null, tipo: 'null' };
        }
        return value;
    }


    /**
      * @type {BaseVisitor['visitPrint']}
      */
    visitPrint(node) {
        const valores = node.exp.map(exp => exp.accept(this).valor);
        this.salida += valores.join(' ') + '\n';
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
        const id = node.id;
        const value = node.asgn.accept(this);
        const varia = this.entornoActual.get(id);
        if(!varia){
            this.errs.addError(`Variable no declarada o fuera del ámbito: ${id}`, node.location.start.line, node.location.start.column, 'Semántico');
            return;
        }
        if(varia.tipo !== value.tipo){
            this.errs.addError(`Tipo de dato incompatible: ${varia.tipo} != ${value.tipo}`, node.location.start.line, node.location.start.column, 'Semántico');
            this.entornoActual.assign(node.id, {valor: null, tipo: 'null'});
            return;
        }
        this.entornoActual.assign(id, value);
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

        if (condicion.valor) {
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
            while (node.cond.accept(this).valor) {
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
        const funcion = node.callee.accept(this).valor;
        const argumentos = node.args.map(arg => arg.accept(this).valor);
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
        const nombre = node.id;
        const tipoSimbolo = 'funcion';
        const tipoFunc = node.td;
        const ambito = 'global';
        const linea = node.location.start.line;
        const columna = node.location.start.column;

        this.entornoActual.set(node.id, funcion, node.td);
        this.symbolTable.addSymbol(nombre, tipoSimbolo, tipoFunc, ambito, linea, columna);
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

    /**
      * @type {BaseVisitor['visitSwitch']}
      */
    visitSwitch(node) {
        const switchExp = node.exp.accept(this);
        let matched = false;
    
        for (let i = 0; i < node.cases.length; i++) {
            const caseNode = node.cases[i];
            const caseExp = caseNode.exp.accept(this);
    
            if (matched || switchExp.valor === caseExp.valor) {
                matched = true;
                try {
                    for (const stmt of caseNode.stmts) {
                        stmt.accept(this);
                    }
                } catch (error) {
                    if (error instanceof BreakExcp) {
                        break;
                    } else {
                        throw error;
                    }
                }
            }
        }
    
        if (!matched && node.defo) {
            try {
                for (const stmt of node.defo.stmts) {
                    stmt.accept(this);
                }
            } catch (error) {
                if (error instanceof BreakExcp) {
                    // Do nothing, just exit the switch
                } else {
                    throw error;
                }
            }
        }
    }

    /**
      * @type {BaseVisitor['visitTernario']}
      */
    visitTernario(node) {
        const cond = node.cond.accept(this);
        if (cond.valor) {
            return node.iftrue.accept(this);
        } else {
            return node.iffalse.accept(this);
        }
    }

    /**
      * @type {BaseVisitor['visitEmbebidas']}
      */
    visitEmbebidas(node){
        const tipoEmb = node.tipo;
        const val = node.exp.accept(this);
        switch (tipoEmb) {
            case 'parseInt(':
                return { valor: parseInt(val.valor, 10), tipo: 'int' };
            case 'parsefloat(':
                return { valor: parseFloat(val.valor).toFixed(4), tipo: 'float' };
            case 'toString(':
                return { valor: val.valor.toString(), tipo: 'string' };
            case 'toLowerCase(':
                return { valor: "\""+val.valor.toLowerCase()+"\"", tipo: 'string' };
            case 'toUpperCase(':
                return { valor: "\""+val.valor.toUpperCase()+"\"", tipo: 'string' };
            case 'typeof':
                return { valor: val.tipo, tipo: 'string' };
            default:
                throw new Error('Tipo embebido no soportado');
        }
    }
}