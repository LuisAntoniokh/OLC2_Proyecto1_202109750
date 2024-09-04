import {InterpreterVisitor} from '../interprete.js';
import {Entorno} from '../Entorno/entorno.js';

export class Invocable{
    //Gestionar tipo también
    aridad(){
        throw new Error('No implementado');
    }

    /**
     * @param interprete {InterpreterVisitor}
     * @param args {any[]}
     */
    invocar(interprete, args){
        throw new Error('No implementado');
    }

}