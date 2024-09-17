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
        if (this.entornoActual.getLocal(nombreVariable)) {
            this.errs.addError(`La variable ${nombreVariable} ya fue declarada en el mismo entorno`, linea, columna, 'Semántico');
            return;
        }
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
            if(tipoVariable === 'int' && node.exp.tipo === 'parseInt('){
                this.entornoActual.set(nombreVariable, node.exp.accept(this).valor, tipoVariable);
                this.symbolTable.addSymbol(nombreVariable, 'variable', tipoVariable, env, linea, columna);
                return;
            } else if(tipoVariable === 'float' && node.exp.tipo === 'parsefloat('){
                this.entornoActual.set(nombreVariable, node.exp.accept(this).valor, tipoVariable);
                this.symbolTable.addSymbol(nombreVariable, 'variable', tipoVariable, env, linea, columna);
                return;
            }
            this.entornoActual.set(nombreVariable, null, tipoVariable);
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
        console.log(node.cond);

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
                if (val.tipo !== 'string') {
                    this.errs.addError(`Tipo de dato incorrecto: se esperaba string pero se obtuvo ${val.tipo}`, node.location.start.line, node.location.start.column, 'Semántico');
                    return { valor: null, tipo: 'null' };
                }
                const parsedInt = parseInt(val.valor, 10);
                if (isNaN(parsedInt)) {
                    this.errs.addError(`La expresión "${val.valor}" no es convertible a número`, node.location.start.line, node.location.start.column, 'Semántico');
                    return { valor: null, tipo: 'null' };
                }
                return { valor: parsedInt, tipo: 'int' };
            case 'parsefloat(':
                if (val.tipo !== 'string') {
                    this.errs.addError(`Tipo de dato incorrecto: se esperaba string pero se obtuvo ${val.tipo}`, node.location.start.line, node.location.start.column, 'Semántico');
                    return { valor: null, tipo: 'null' };
                }
                const parsedfloat = parseFloat(val.valor, 10).toFixed(4);
                if (isNaN(parsedfloat)) {
                    this.errs.addError(`La expresión "${val.valor}" no es convertible a decimal`, node.location.start.line, node.location.start.column, 'Semántico');
                    return { valor: null, tipo: 'null' };
                }
                return { valor: parsedfloat, tipo: 'float' };
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

    /**
      * @type {BaseVisitor['visitDeclaracionArreglo']}
      */
    visitDeclaracionArreglo(node) {
        const tipo = node.tipo;
        const id = node.id;
        const lista = node.lista.map(exp => exp.accept(this));
        const linea = node.location.start.line;
        const columna = node.location.start.column;

        for (const elem of lista) {
            if (elem.tipo !== tipo) {
                this.errs.addError(`Tipo de dato incorrecto en el arreglo: se esperaba ${tipo} pero se obtuvo ${elem.tipo}`, linea, columna, 'Semántico');
                return;
            }
        }
        this.entornoActual.set(id, lista, tipo );
        this.symbolTable.addSymbol(id, 'arreglo', tipo, 'global', linea, columna);
    }

     /**
      * @type {BaseVisitor['visitDeclaracionArregloTam']}
      */
    visitDeclaracionArregloTam(node) {
        const tipo = node.tipo;
        const id = node.id;
        const tam = node.tam.accept(this);
        const linea = node.location.start.line;
        const columna = node.location.start.column;
        if (tam.tipo !== 'int' || tam.valor < 0) {
            this.errs.addError(`Tamaño de arreglo inválido: se esperaba un entero no negativo`, linea, columna, 'Semántico');
            return;
        }
        const valorPorDefecto = this.obtenerValorPorDefecto(tipo);
        const arreglo = Array(tam.valor).fill(valorPorDefecto);

        this.entornoActual.set(id, arreglo, tipo );
        this.symbolTable.addSymbol(id, 'arreglo', tipo, 'global', linea, columna);
    }

    /**
      * @type {BaseVisitor['visitDeclaracionArregloCopia']}
     */
    visitDeclaracionArregloCopia(node) {
        const tipo = node.tipo;
        const id = node.id;
        const id2 = node.id2;
        const linea = node.location.start.line;
        const columna = node.location.start.column;
        const arregloOriginal = this.entornoActual.get(id2);

        this.entornoActual.set(id, [...arregloOriginal.valor], tipo);
        this.symbolTable.addSymbol(id, 'arreglo', tipo, 'global', linea, columna);
    }

    /**
      * @type {BaseVisitor['visitAccesoArreglo']}
     */
    visitAccesoArreglo(node) {
        const id = node.id;
        const indie = node.indice.accept(this);
        const linea = node.location.start.line;
        const columna = node.location.start.column;
        const arreglo = this.entornoActual.get(id);

        if (indie.tipo !== 'int' || indie.valor < 0 || indie.valor >= arreglo.valor.length) {
            this.errs.addError(`Índice de arreglo fuera de rango`, linea, columna, 'Semántico');
            return { valor: null, tipo: 'null' };
        }

        return arreglo.valor[indie.valor];
    }

    /**
      * @type {BaseVisitor['visitAsignacionArreglo']}
     */
    visitAsignacionArreglo(node) {
        const id = node.id;
        const indie = node.indice.accept(this);
        const value = node.valor.accept(this);
        const linea = node.location.start.line;
        const columna = node.location.start.column;
        const arreglo = this.entornoActual.get(id);
        if (indie.tipo !== 'int' || indie.valor < 0 || indie.valor >= arreglo.valor.length) {
            this.errs.addError(`Índice de arreglo fuera de rango`, linea, columna, 'Semántico');
            return;
        }
        arreglo.valor[indie.valor] = value;
    }

    obtenerValorPorDefecto(tipo) {
        switch (tipo) {
            case 'int': return { valor: 0, tipo: 'int' };
            case 'float': return { valor: 0.0, tipo: 'float' };
            case 'string': return { valor: '', tipo: 'string' };
            case 'boolean': return { valor: false, tipo: 'boolean' };
            case 'char': return { valor: '\u0000', tipo: 'char' };
            case 'struct': return { valor: null, tipo: 'struct' };
            default: throw new Error(`Tipo no soportado: ${tipo}`);
        }
    }

    /**
     * @type {BaseVisitor['visitFuncionArreglo']}
     */
    visitFuncionArreglo(node) {
        const id = node.id;
        const funcion = node.funcion;
        const argumento = node.argumento ? node.argumento.accept(this) : null;
        const linea = node.location.start.line;
        const columna = node.location.start.column;
        const arreglo = this.entornoActual.get(id);

        switch (funcion) {
            case 'indexOf':
                if (argumento === null) {
                    this.errs.addError(`La función indexOf requiere un argumento`, linea, columna, 'Semántico');
                    return { valor: null, tipo: 'null' };
                }
                return this.indexOf(arreglo, argumento);
            case 'join':
                return this.join(arreglo);
            case 'length':
                return { valor: arreglo.valor.length, tipo: 'int' };
            default:
                this.errs.addError(`Función de arreglo no soportada: ${funcion}`, linea, columna, 'Semántico');
                return { valor: null, tipo: 'null' };
        }
    }

    indexOf(arreglo, argumento) {
        for (let i = 0; i < arreglo.valor.length; i++) {
            if (arreglo.valor[i].valor === argumento.valor) {
                return { valor: i, tipo: 'int' };
            }
        }
        return { valor: -1, tipo: 'int' };
    }

    join(arreglo) {
        const joinedString = arreglo.valor.map(elem => elem.valor).join(', ');
        return { valor: joinedString, tipo: 'string' };
    }

    /**
     * @type {BaseVisitor['visitForEach']}
     */
    visitForEach(node){
        const tipo = node.tipo;
        const id = node.id;
        const arr = this.entornoActual.get(node.arr);
        if (!arr || !Array.isArray(arr.valor)) {
            throw new Error(`Variable ${node.arr} is not an array`);
        }

        const entornoAnterior = this.entornoActual;
        this.entornoActual = new Entorno(entornoAnterior);

        for (const elemento of arr.valor) {
            this.entornoActual.set(id, elemento.valor, tipo);
            node.loop.accept(this);
        }

        this.entornoActual = entornoAnterior;
    }

    /**
     * @type {BaseVisitor['visitDeclaracionMatriz2D']}
     */
    visitDeclaracionMatriz2D(node) {
        const nombreMatriz = node.id;
        const tipoMatriz = node.tipo;
        const linea = node.location.start.line;
        const columna = node.location.start.column;
        const env = 'global';
    
        let matriz;
        if (node.filas) {
            matriz = node.filas.map(fila => fila.map(exp => exp.accept(this).valor));
            this.entornoActual.set(nombreMatriz, matriz, tipoMatriz);
            this.symbolTable.addSymbol(nombreMatriz, 'matriz', tipoMatriz, env, linea, columna);
        } else {
            const tam1 = node.tam1.accept(this).valor;
            const tam2 = node.tam2.accept(this).valor;
            matriz = Array.from({ length: tam1 }, () => Array(tam2).fill(this.obtenerValorPorDefecto(tipoMatriz)));
            this.entornoActual.set(nombreMatriz, matriz, tipoMatriz);
            this.symbolTable.addSymbol(nombreMatriz, 'matriz', tipoMatriz, env, linea, columna);
        }
    }

    /**
     * @type {BaseVisitor['visitDeclaracionMatriz3D']}
     */
    visitDeclaracionMatriz3D(node) {
        const nombreMatriz = node.id;
        const tipoMatriz = node.tipo;
        const linea = node.location.start.line;
        const columna = node.location.start.column;
        const env = 'global';

        let matriz;
        if (node.capas) {
            matriz = node.capas.map(capa => {
                // Verificar si la capa contiene solo un elemento que es un array
                if (capa.length === 1 && Array.isArray(capa[0])) {
                    // Si es un Array(1), recorremos ese array
                    return capa[0].map(fila => fila.map(exp => exp.accept(this).valor));
                } else {
                    // Proceso normal
                    return capa.map(fila => fila.map(exp => exp.accept(this).valor));
                }
            });
            this.entornoActual.set(nombreMatriz, matriz, tipoMatriz);
            this.symbolTable.addSymbol(nombreMatriz, 'matriz', tipoMatriz, env, linea, columna);
        } else {
            const tam1 = node.tam1.accept(this).valor;
            const tam2 = node.tam2.accept(this).valor;
            const tam3 = node.tam3.accept(this).valor;
            matriz = Array.from({ length: tam1 }, () => Array.from({ length: tam2 }, () => Array(tam3).fill(this.obtenerValorPorDefecto(tipoMatriz))));
            this.entornoActual.set(nombreMatriz, matriz, tipoMatriz);
            this.symbolTable.addSymbol(nombreMatriz, 'matriz', tipoMatriz, env, linea, columna);
        }

    }

    /**
     * @type {BaseVisitor['visitAccesoMatriz2D']}
     */
    visitAccesoMatriz2D(node) {
        const id = node.id;
        const indice1 = node.indice1.accept(this).valor;
        const indice2 = node.indice2.accept(this).valor;
        const matriz = this.entornoActual.get(id);

        if (indice1 < 0 || indice1 >= matriz.valor.length || indice2 < 0 || indice2 >= matriz.valor[0].length) {
            throw new Error(`Índice fuera de rango para la matriz ${id}`);
        }

        return { valor: matriz.valor[indice1][indice2], tipo: matriz.tipo };
    }

    /**
     * @type {BaseVisitor['visitAccesoMatriz3D']}
     */
    visitAccesoMatriz3D(node) {
        const id = node.id;
        const indice1 = node.indice1.accept(this).valor;
        const indice2 = node.indice2.accept(this).valor;
        const indice3 = node.indice3.accept(this).valor;
        const matriz = this.entornoActual.get(id);

        if (indice1 < 0 || indice1 >= matriz.valor.length || indice2 < 0 || indice2 >= matriz.valor[0].length || indice3 < 0 || indice3 >= matriz.valor[0][0].length) {
            throw new Error(`Índice fuera de rango para la matriz ${id}`);
        }

        if (matriz.valor[indice1][indice2][indice3] instanceof Object){
            return { valor: matriz.valor[indice1][indice2][indice3].valor, tipo: matriz.valor[indice1][indice2][indice3].tipo };
        }
        
        return { valor: matriz.valor[indice1][indice2][indice3], tipo: matriz.tipo };
    }

    /**
     * @type {BaseVisitor['visitAsignacionMatriz2D']}
     */
    visitAsignacionMatriz2D(node) {
        const id = node.id;
        const indice1 = node.indice1.accept(this).valor;
        const indice2 = node.indice2.accept(this).valor;
        const valor = node.valor.accept(this).valor;
        const matriz = this.entornoActual.get(id);

        if (indice1 < 0 || indice1 >= matriz.valor.length || indice2 < 0 || indice2 >= matriz.valor[0].length) {
            throw new Error(`Índice fuera de rango para la matriz ${id}`);
        }

        matriz.valor[indice1][indice2] = valor;
    }

    /**
     * @type {BaseVisitor['visitAsignacionMatriz3D']}
     */
    visitAsignacionMatriz3D(node) {
        const id = node.id;
        const indice1 = node.indice1.accept(this).valor;
        const indice2 = node.indice2.accept(this).valor;
        const indice3 = node.indice3.accept(this).valor;
        const valor = node.valor.accept(this).valor;
        const matriz = this.entornoActual.get(id);

        if (indice1 < 0 || indice1 >= matriz.valor.length || indice2 < 0 || indice2 >= matriz.valor[0].length || indice3 < 0 || indice3 >= matriz.valor[0][0].length) {
            throw new Error(`Índice fuera de rango para la matriz ${id}`);
        }

        matriz.valor[indice1][indice2][indice3] = valor;
    }
}