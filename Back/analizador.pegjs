Expresion = Adicion

Adicion = izq:Multiplicacion expansion:( 
    operando:("+" / "-") der:Multiplicacion { return { tipo: operando, der } }
    )* { 
    return expansion.reduce(
        (opPrevia, opActual) => {
        const { tipo, der } = opActual
        return { tipo, izq: opPrevia, der }
        },
        izq
    )
}

Multiplicacion = izq:Unaria expansion:(
  op:("*" / "/" / "%") der:Unaria { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (opPrevia, opActual) => {
        const { tipo, der } = opActual
        return { tipo, izq: opPrevia, der }
      },
      izq
    )
}

Unaria = "-" num:Numero { return { tipo: "-", der: num } }
/ Numero


Numero = [0-9]+( "." [0-9]+ )? { return{ tipo: "numero", valor: parseFloat(text(), 10) } }
  / "(" exp:Expresion ")" { return { tipo: "parentesis", exp } }