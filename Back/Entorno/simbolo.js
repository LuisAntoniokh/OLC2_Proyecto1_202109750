export class SymbolTable {
    constructor() {
        this.symbols = [];
    }

    addSymbol(id, tipoSimbolo, tipoDato, ambito, linea, columna) {
        this.symbols.push({ id, tipoSimbolo, tipoDato, ambito, linea, columna });
    }

    getSymbols() {
        return this.symbols;
    }
}