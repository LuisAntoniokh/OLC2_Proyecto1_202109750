{
  const crearNodo = (tipoNodo, propert) =>{
    const tipos = {
      'numero': nodos.Numero,
      'agrupacion': nodos.Agrupacion,
      'binaria': nodos.OperacionBinaria,
      'unaria': nodos.OperacionUnaria,
      'declaracionVariable': nodos.DeclaracionVariable,
      'referenciaVariable': nodos.ReferenciaVariable,
      'print': nodos.Print,
      'expresionStmt': nodos.ExpresionStmt,
    }

    const nodo = new tipos[tipoNodo](propert)
    nodo.location = location()
    return nodo
  }
}

Start = _ dcl:Declaracion* _ { return dcl }

Declaracion = dlc:VarDcl _ { return dlc }
            / stmt:Stmt _ { return stmt }

VarDcl = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('declaracionVariable', { id, exp }) }

Stmt = "print(" _ exp:Expresion _ ")" _ ";" { return crearNodo('print', { exp }) }
    / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }

Expresion = Adicion

Adicion = izq:Multiplicacion expansion:(
  _ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } }
  )* { 
  return expansion.reduce(
    (opPrevia, opActual) => {
      const { tipo, der } = opActual
      return crearNodo('binaria', { op:tipo, izq: opPrevia, der })
    },
    izq
  )
}

Multiplicacion = izq:Unaria expansion:(
  _ op:("*" / "/" / "%") _ der:Unaria { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (opPrevia, opActual) => {
        const { tipo, der } = opActual
        return crearNodo('binaria', { op:tipo, izq: opPrevia, der })
      },
      izq
    )
}

Unaria = "-" _ num:Numero { return crearNodo('unaria', { op: '-', exp: num }) }
/ Numero

Identificador = [a-zA-Z_][a-zA-Z0-9_]* { return text() }

Numero = [0-9]+( "." [0-9]+ )? {return crearNodo('numero', { valor: parseFloat(text(), 10) })}
  / "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }
  / id:Identificador { return crearNodo('referenciaVariable', { id }) }

_ = [ \t\n\r]*