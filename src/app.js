"use strict";

import express from "express"
import Contenedor from "./Contenedor.js"

const app = express() // Inicializo express

const server = app.listen(8080) // Le decimos que va a escuchar las peticiones en el puerto 8080

server.on("error", error => console.log(error)) // En caso de que haya un error en la puesta en marcha del servidor

const producto1 = {
    title: "Título 1",
    price: 100,
    img: "https://dummyimage.com/100x400/000/fff"
}

const producto2 = {
    title: "Título 2",
    price: 200,
    img: "https://dummyimage.com/200x400/000/fff"
}

const producto3 = {
    title: "Título 3",
    price: 300,
    img: "https://dummyimage.com/300x400/000/fff"
}

const contenedor = new Contenedor("productos")

const obtenerProductos = async () => { // Obtiene los objetos del archivo json "productos". Si el archivo no existe entonces primero lo crea y coloca tres objetos, sólo para verificar que funciona
    let productos = await contenedor.getAll()
    if (productos.length === 0) {
    await contenedor.save(producto1)
    await contenedor.save(producto2)
    await contenedor.save(producto3)
    productos = await contenedor.getAll()
    }
    return productos
}

app.get("/productos", async (req, res) => { // En la ruta /productos devuelve un array con todos los productos disponibles
    const productos = await obtenerProductos()
    res.send(productos)
})

app.get("/productoRandom", async (req, res) => { // En la ruta /productoRandom devuelve un producto al azar
    const productos = await obtenerProductos()
    const productoRandom = productos[parseInt(productos.length*Math.random())]
    res.send(productoRandom)
})

// Extra: devuelve un producto según su id pasado en la url
app.get("/productos/:idProducto", async (req, res) => {
    const { idProducto } = req.params
    const productoPedido = await contenedor.getById(parseInt(idProducto))
    if (productoPedido === null) {
        res.send("El producto no existe")
    } else {
        res.send(productoPedido)
    }   
})
