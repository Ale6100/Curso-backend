"use strict";

const fs = require("fs"); // Trae el módulo local fs

class Contenedor {
    constructor(nombreDelArchivo) {
        this.nombre = nombreDelArchivo
    }

    async getAll() { // Devuelve un array con todos los objetos presentes en el archivo
        let datosArchivo = []
        try {
            datosArchivo = await fs.promises.readFile(`${this.nombre}.json`, "utf-8") // Si el archivo con el array de objetos existe, devuelve ese array
            datosArchivo = JSON.parse(datosArchivo)
        } catch(error) {
            console.log(error) // Lanza error si no encuentra el archivo (lo va a lanzar hasta la primera vez que agregue un objeto ya que por defecto no lo tengo creado, pero no es un problema)
        }
        return datosArchivo
    }
       
    async save(objeto) { // Recibe un objeto, lo guarda en el archivo, devuelve el id asignado
        let datosArchivo = await this.getAll()
        let idAAgregar        
        if (datosArchivo.length === 0) { // El propósito de este if-else es asegurar que el id agregado es único en el array
            idAAgregar = 1 // Define a esta variable como 1 ya que queremos que el primer objeto tenga id igual a 1
        } else {
            idAAgregar = datosArchivo[datosArchivo.length-1].id + 1 // Los siguientes objetos tendrán un id igual al id del último objeto del array+1
        }
        objeto.id = idAAgregar // Le agrega al objeto el id mencionado
        datosArchivo.push(objeto) // y luego agrega el objeto actualizado al array
        datosArchivo = JSON.stringify(datosArchivo, null, "\t") // Pasa el array a formato json
        await fs.promises.writeFile(`${this.nombre}.json`, datosArchivo) // Actualiza el archivo con el nuevo objeto agregado
        return idAAgregar // Retorna el id asignado
    }

    async getById(id) { // Recibe un id y devuelve el objeto con ese id, o null si no está
        const datosArchivo = await this.getAll()
        return datosArchivo.some(objeto => objeto.id === id) ? datosArchivo.find(objeto => objeto.id === id) : null
    }

    async deleteById(id) { // Elimina del archivo el objeto con el id buscado
        let datosArchivo = await this.getAll()
        datosArchivo = datosArchivo.filter(objeto => objeto.id !== id)
        datosArchivo = JSON.stringify(datosArchivo, null, "\t")
        await fs.promises.writeFile(`${this.nombre}.json`, datosArchivo) // Actualiza el array en el archivo
    }

    async deleteAll() {
        try { // Pide que se vacíe el array en el archivo (el contenido se define como []) si es que está creado
            await fs.promises.readFile(`${this.nombre}.json`, "utf-8")
            await fs.promises.writeFile(`${this.nombre}.json`, "[]")
        } catch(error) {
            console.log(error)
        }
    }
}

const producto1 = {
    title: "Título 1",
    price: 100,
    img: "https://dummyimage.com/600x400/000/fff"
}

const producto2 = {
    title: "Título 2",
    price: 200,
    img: "https://dummyimage.com/600x400/000/fff"
}

const producto3 = {
    title: "Título 3",
    price: 300,
    img: "https://dummyimage.com/600x400/000/fff"
}

const contenedor = new Contenedor("productos") // Creo un objeto. El nombre del archivo es "productos"

const comprobarMetodos = async () => { // Esta función va a poner a prueba los métodos definidos arriba
    try {
        // Agrego cuatro productos gracias al método save
        const primerId = await contenedor.save(producto1) // Crea el archivo y agrega el producto1 con id igual a 1
        console.log(`El id del objeto agregado es: ${primerId}`)
    
        const segundoId = await contenedor.save(producto2) // Agrega el producto2 con id igual a 2
        console.log(`El id del objeto agregado es: ${segundoId}`)
    
        const tercerId = await contenedor.save(producto3)
        console.log(`El id del objeto agregado es: ${tercerId}`)

        const cuartoId = await contenedor.save(producto2) // Agrega el producto2 otra vez, pero ahora con id igual a 4 (por lo tanto sería un producto idéntico pero no el mismo...)
        console.log(`El id del objeto agregado es: ${cuartoId}`)
        
        // Muestro por consola los objetos gracias al método getById
        console.log("\nLos objetos son:")

        const objeto1 = await contenedor.getById(primerId)
        console.table(objeto1)
    
        const objeto2 = await contenedor.getById(segundoId)
        console.table(objeto2)

        const objeto3 = await contenedor.getById(tercerId)
        console.table(objeto3)
    
        const objeto4 = await contenedor.getById(cuartoId)
        console.table(objeto4)

        // Muestro por consola todos los objetos gracias al método getAll
        const todosLosObjetos = await contenedor.getAll()
        console.log("\nLa siguiente tabla muestra todos los objetos:")
        console.table(todosLosObjetos)

        // Elimino dos objetos gracias al método deleteById
        await contenedor.deleteById(tercerId)
        await contenedor.deleteById(cuartoId)
        console.log(`\nTodos los objetos sin los objetos con id ${tercerId} y ${cuartoId}:`)
        console.table(await contenedor.getAll())

        // Elimino todos los objetos gracias al método deleteAll()
        await contenedor.deleteAll()
        console.log(`\nToda la lista quedó borrada. Compruebo:`)
        console.log(await contenedor.getAll())

    } catch(error) {
        console.log(error)
    }
}

comprobarMetodos()
