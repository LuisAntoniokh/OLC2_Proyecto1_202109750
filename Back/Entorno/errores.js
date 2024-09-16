export class ErrorSemantico {
    constructor() {
        this.errores = [];
    }

    addError(descripcion, linea, columna, tipo) {
        this.errores.push({ descripcion, linea, columna, tipo });
    }

    getErrores() {
        return this.errores;
    }
}