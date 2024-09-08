{
  const crearNodo = (tipoNodo, propert) =>{
    const tipos = {
      'Primal': nodos.Primal,
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
      'llamada': nodos.Llamada,
      'dclFunc' : nodos.FuncDcl
    }

    const nodo = new tipos[tipoNodo](propert)
    nodo.location = location()
    return nodo
  }
}

Start = _ dcl:Sentencias* _ { return dcl }

Sentencias = vdlc:DeclarVar _ { return vdlc }
            / fdlc:DeclarFunc _ { return fdlc }
            / ndlc:StmtnDlc _ { return ndlc }

DeclarVar = tipo:TipoDato _ id:Identificador _ "=" _ exp:Expresion _ ";" {return crearNodo('declaracionVariable', { id, exp, tipo })}
          / tipo:"var" _ id:Identificador _ "=" _ exp:Expresion _ ";" {return crearNodo('declaracionVariable', { id, exp, tipo })} // Se infiere el tipo.

TipoDato = td:"int" { return td }
        / td:"float" { return td }
        / td:"string" { return td }
        / td:"bool" { return td }
        / td:"char" { return td }

DeclarFunc = "function" _ id:Identificador _ "(" _ params: Parametros? _ ")" _  block:Bloque { return crearNodo('dclFunc', { id, params: params || [], block }) }

Parametros = id:Identificador _ params:("," _ ids:Identificador {return ids})* {return [id, ...params]}

StmtnDlc = "System.out.println(" _ exp:Expresion _ ")" { return crearNodo('print', { exp }) }
    / block:Bloque { return block }
    / "if" _ "(" _ cond:Expresion _ ")" _ iftrue:StmtnDlc iffalse:(
      _ "else" _ iffalse:StmtnDlc { return iffalse }
    )? { return crearNodo('if', { cond, iftrue, iffalse }) }
    / "while" _ "(" _ cond:Expresion _ ")" _ loop:StmtnDlc { return crearNodo('while', {cond, loop})}
    / "for" _ "(" _ init:ForInit _  cond:Expresion _ ";" _ inc:Expresion _ ")" _ loop:StmtnDlc { return crearNodo('for', {init, cond, inc, loop})}
    / "break" _ ";" { return crearNodo('break') }
    / "continue" _ ";" { return crearNodo('continue') }
    / "return" _ exp:Expresion? _ ";" { return crearNodo('return', { exp }) }
    / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }

Bloque = "{" _ block:Sentencias* _ "}" { return crearNodo('bloque', { block }) }

ForInit = dcl:DeclarVar { return dcl }
        / exp:Expresion _ ";" { return exp }

Expresion = Asignacion

Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return crearNodo('asignacion', {id, asgn} )}
            / OR

OR = izq:AND expansion:(
  _ op:( "||" ) _ der:AND { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

AND = izq:Comparacion expansion:(
  _ op:( "&&" ) _ der:Comparacion { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

Comparacion = izq:Relacionales expansion:(
  _ op:("!=" / "==") _ der:Relacionales { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

Relacionales = izq:Adicion expansion:(
  _ op:("<=" / "<" / ">=" / ">") _ der:Adicion { return { tipo: op, der } }
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
      / "!" _ num:Unaria { return crearNodo('unaria', { op: '!', exp: num }) }
      / Llamada

Llamada = callee:Primitivo _ params:("(" args:Argumentos? ")" { return args })*{
  return params.reduce(
    (callee, args) => {
      return crearNodo('llamada', {callee, args: args || [] } )
    },
    callee
  )
}

Argumentos = arg:Expresion _ args:("," _ exp:Expresion { return exp })* { return [arg, ...args] }

Identificador = [a-zA-Z_][a-zA-Z0-9_]* { return text() }

Primitivo = [0-9]+"."[0-9]+ {return crearNodo('Primal', { valor: parseFloat(text(), 10), tipo: 'float' })}
  / [0-9]+                  {return crearNodo('Primal', { valor: parseInt(text(), 10), tipo: 'int' })}
  / "true"                  {return crearNodo('Primal', { valor: true, tipo: 'bool' })}
  / "false"                 {return crearNodo('Primal', { valor: false, tipo: 'bool' })}
  / str:String              { return str }
  / "\'" [^'] "\'"          {return crearNodo('Primal', { valor: text().slice(1, -1), tipo: 'char' })}
  / "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }
  / id:Identificador { return crearNodo('referenciaVariable', { id }) }

String
  = "\"" chars:((EscapedChar / [^"\\])*) "\"" {
      return crearNodo('Primal', { valor: chars.join(''), tipo: 'string' });
    }

EscapedChar
  = "\\" ("n" { return "\n"; }
          / "r" { return "\r"; }
          / "t" { return "\t"; }
          / "\"" { return "\""; }
          / "\\" { return "\\"; })

_ = ([ \t\n\r] / Comentarios)*

Comentarios = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"

/*
Start = _ dlcs:Sentencias* _ { return dlcs }

Sentencias = vdlc:DeclarVar _ { return vdlc }
            / fdlc:DeclarFunc _ { return fdlc }
            / ndlc:StmtnDlc _ { return ndlc }    

//          / adlc:DeclarArr _ {return adlc}
//          / sdlc:DeclarStr _ {return sdlc}

VarDcl = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('declaracionVariable', { id, exp }) }

DeclarVar = tipo:TipoDato _ id:Identificador _ ";" {}
          / tipo:TipoDato _ id:Identificador _ "=" _ exp:Expresion _ ";" {}
          / "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" {} // Se infiere el tipo.

TipoDato = td:"int" { return td }
        / td:"float" { return td }
        / td:"string" { return td }
        / td:"bool" { return td }
        / td:"char" { return td }

Identificador = [a-zA-Z_][a-zA-Z0-9_]* { return text() }

DeclarFunc = td:TipoDato _ id:Identificador _ "(" _ params:Parametros? _ ")" _ block:Bloque { return { td, id, params: params || [], block } }

Parametros = td:TipoDato _ id:Identificador _ params:("," _ tds:TipoDato _ ids:Identificador {return xd})* {return [id, ...params]}

StmtnDlc = "System.out.println(" _ expList:ListaExp _ ")"  {}
        / block:Bloque { return block }
        / stContr:StmtControl { return stContr }
        / stCicle:StmtCiclos { return stCicle }
        / stTrans:StmtTransferencia { return stTrans }
        / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }

ListaExp = exp:Expresion _ exps:("," _ expre:Expresion { return expre })* { return [exp, ...exps] }

StmtControl = "if" _ "(" _ cond:Expresion _ ")" _ iftrue:StmtnDlc iffalse:(
      _ "else" _ iffalse:StmtnDlc { return iffalse }
      )? { return crearNodo('if', { cond, iftrue, iffalse }) }
    / "switch"

StmtCiclos = "while" _ "(" _ cond:Expresion _ ")" _ loop:StmtnDlc { return crearNodo('while', {cond, loop})}
    / "for" _ "(" _ init:ForInit _  cond:Expresion _ ";" _ inc:Expresion _ ")" _ loop:StmtnDlc { return crearNodo('for', {init, cond, inc, loop})}

ForInit = dcl:DeclarVar { return dcl }
        / exp:Expresion _ ";" { return exp }

StmtTransferencia = "break" _ ";" { return crearNodo('break') }
    / "continue" _ ";" { return crearNodo('continue') }
    / "return" _ exp:Expresion? _ ";" { return crearNodo('return', { exp }) }

Bloque = "{" _ block:Sentencias* _ "}" { return crearNodo('bloque', { block }) }

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

Llamada = callee:Primitivo _ params:("(" args:Argumentos? ")" { return args })*{
  return params.reduce(
    (callee, args) => {
      return crearNodo('llamada', {callee, args: args || [] } )
    },
    callee
  )
}

Argumentos = arg:Expresion _ args:("," _ exp:Expresion { return exp })* { return [arg, ...args] }

Primitivo = [0-9]+\.[0-9]+  {return crearNodo('Primal', { valor: parseFloat(text(), 4), tipo: 'float' })}
  / [0-9]+                  {return crearNodo('Primal', { valor: parseInt(text(), 1), tipo: 'int' })}
  / "true"                  {return crearNodo('Primal', { valor: "true", tipo: 'bool' })}
  / "false"                 {return crearNodo('Primal', { valor: "false", tipo: 'bool' })}
  / \".*\"                  {return crearNodo('Primal', { valor: text(), tipo: 'string' })}
  / \'.\'                   {return crearNodo('Primal', { valor: text(), tipo: 'char' })}
  / "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }
  / id:Identificador { return crearNodo('referenciaVariable', { id }) }

_ = ([ \t\n\r] / Comentarios)*

tipo:TipoDato _ id:Identificador _ ";" {return crearNodo('declaracionVariable', { id, 'null', tipo })}
          /
*/