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
      'asignacion': nodos.Asignacion,
      'bloque': nodos.Bloque,
      'if': nodos.If,
      'while': nodos.While,
      'for': nodos.For,
      'break': nodos.Break,
      'continue': nodos.Continue,
      'return': nodos.Return,
      'llamada': nodos.Llamada
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
    / "{" _ block:Declaracion* _ "}" { return crearNodo('bloque', {block}) }
    / "if" _ "(" _ cond:Expresion _ ")" _ iftrue:Stmt iffalse:(
      _ "else" _ iffalse:Stmt { return iffalse }
    )? { return crearNodo('if', { cond, iftrue, iffalse }) }
    / "while" _ "(" _ cond:Expresion _ ")" _ loop:Stmt { return crearNodo('while', {cond, loop})}
    / "for" _ "(" _ init:ForInit _  cond:Expresion _ ";" _ inc:Expresion _ ")" _ loop:Stmt { return crearNodo('for', {init, cond, inc, loop})}
    / "break" _ ";" { return crearNodo('break') }
    / "continue" _ ";" { return crearNodo('continue') }
    / "return" _ ret:Expresion? _ ";" { return crearNodo('return', { ret }) }
    / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }

ForInit = dcl:VarDcl { return dcl }
        / exp:Expresion _ ";" { return exp }

Expresion = Asignacion

Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return crearNodo('asignacion', {id, asgn} )}
            / Comparacion

Comparacion = izq:Adicion expansion:(
  _ op:("<=" / "==") _ der:Adicion { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

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

Unaria = "-" _ num:Unaria { return crearNodo('unaria', { op: '-', exp: num }) }
/ Llamada

Llamada = callee:Numero _ params:("(" args:Argumentos? ")" { return {args} })*{
  return params.reduce(
    (callee, args) => {
      return crearNodo('llamada', {callee, args: args || [] } )
    },
    callee
  )
}

Argumentos = arg:Expresion _ args:("," _ exp:Expresion { return exp })* { return [arg, ...args] }

Identificador = [a-zA-Z_][a-zA-Z0-9_]* { return text() }

Numero = [0-9]+( "." [0-9]+ )? {return crearNodo('numero', { valor: parseFloat(text(), 10) })}
  / "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }
  / id:Identificador { return crearNodo('referenciaVariable', { id }) }

_ = ([ \t\n\r] / Comentarios)*

Comentarios = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"