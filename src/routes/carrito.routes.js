import { Router } from "express"; 
import { Contenedor, ContenedorDeContenedores } from "../daos/index.js";

const router = Router();

const contenedorCarrito = new ContenedorDeContenedores("carritos");
const contenedorProductos = new Contenedor("productos")

router.get("/", async (req, res) => { // En /api/cart devuelve todos los carritos disponibles
    const result = await contenedorCarrito.getAll()
    res.send({ status: "success", payload: result })
})

router.get("/:cid/products", async (req, res) => { // En /api/cart/n/products devuelve el carrito con id n, siempre y cuando exista
    const { cid } = req.params
    const result = await contenedorCarrito.getById(cid)
    if (result === null) {
        res.send({ error: "Cart not found"})
    } else {
        res.send({ status: "success", payload: result })
    }   
})

router.post("/", async (req, res) => { // Agrega una colección (que representa a un carrito) al archivo gracias a Postman. Devuelve su id asignado
    const result = await contenedorCarrito.saveOne()
    res.send({ status: "sucess", message: "Cart added", idProduct: result })
})

router.post("/:cid/products/:pid", async (req, res) => { // Agrega un producto particular en un carrito en particular
    let { cid, pid } = req.params;

    const carritoId = await contenedorCarrito.getById(cid)
    const productoId = await contenedorProductos.getById(pid)
    
    if (carritoId === null) {
        res.status(404).send({ status: "error", error: "Cart not found" })
    
    } else if (productoId === null) {
        res.status(404).send({ status: "error", error: "Product not found" })
    
    } else {
        contenedorCarrito.saveContainerInContainer(cid, pid)
        res.send({ status: "success" })
    }
})

router.delete("/:cid", async (req, res) => { // Vacía un carrito según su id
    let { cid } = req.params
    const datosArchivo = await contenedorCarrito.getAll()
    
    if (datosArchivo.some(carrito => carrito.id == cid)) { // Primero verifica si el carrito con ese id está en el archivo
        await contenedorCarrito.deleteById(cid)
        res.send({ status: "sucess", message: `Carrito con id ${cid} vaciado` })
    } else {
        res.send({ error: "Cart not found" })
    }
})

router.delete("/:cid/products/:pid", async (req, res) => { // Vacía un carrito según su id
    let { cid, pid } = req.params;

    const carritoId = await contenedorCarrito.getById(cid)
    
    if (carritoId === null) {
        res.status(404).send({ status: "error", error: "Cart not found" })
    
    } else {
        const borrado = await contenedorCarrito.deleteContainerInContainer(cid, pid)
        if (borrado) {
            res.send({ status: "success" })
        } else {
            res.status(404).send({ status: "error", error: "Product not found in cart" })
        }
        
    }
})

export default router;
