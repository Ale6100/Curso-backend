const numeroAlAzar = (num1, num2) => { // Recibe dos números `num1` y `num2`. Devuelve un número al azar entre ellos (no incluye al `num2`)
    const randomAmpliado = Math.random()*(Math.abs(num2-num1)) //  Número al azar entre 0 y |num2-num1| (este último sin incluir)
    const numeroMasChico = num1 < num2 ? num1 : num2
    return numeroMasChico + randomAmpliado // Desplazo el rango para que inicie donde inicia el número más pequeño
}

const numeroEnteroAlAzar = (num1, num2) => { // Recibe dos números enteros y devuelve un número entero al azar entre ellos
    const numeroBuscado = Math.round(numeroAlAzar(num1-0.5, num2+0.5))
    return numeroBuscado === -0 ? 0 : numeroBuscado // Evitamos que el resultado pueda ser -0 en lugar de 0
}

const numerosAleatorios = (objeto, n=100000000) => { // Construye un objeto que contiene como claves a los números desde el 1 hasta el 1000, y como valores a la cantidad de veces que salió cada uno, considerando n números naturales randoms entre 1 y 1000
    for (let i=1; i<=n; i++) {
        const numeroAzar = numeroEnteroAlAzar(1, 1000)
        objeto[numeroAzar]++
    }
    return objeto
}

process.on("message", data => { // Ejecuta ests líneas de código en un proceso hijo, ya que requiere mucho esfuerzo computacional
    const { objeto, cant } = data
    process.send(numerosAleatorios(objeto, cant)) // Cuando la info ya está lista, se envía al proceso padre
})
