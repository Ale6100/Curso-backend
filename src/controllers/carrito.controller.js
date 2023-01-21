import { Contenedor, ContenedorDeContenedores } from "../daos/index.js";

const contenedorCarrito = new ContenedorDeContenedores("carritos");
const contenedorProductos = new Contenedor("productos")

const getAll = async (req, res) => { // En /api/cart devuelve todos los carritos disponibles
    const result = await contenedorCarrito.getAll()
    res.send({ status: "success", payload: result })
}

const getById = async (req, res) => { // En /api/cart/n/products devuelve el carrito con id n, siempre y cuando exista
    const { cid } = req.params
    let result
    try { 
        result = await contenedorCarrito.getById(cid)
    } catch (error) {
        req.logger.error(`${req.infoPeticion} | Cart not found | ${error}`) // Da error cuando el tipo de id solicitado no es compatible con el id de mongo. Si esto sucede termina la petición
        return res.send({ error: "Cart not found"})
    }

    if (!result) {
        req.logger.error(`${req.infoPeticion} | Cart not found`)
        res.send({ error: "Cart not found"})
    } else {
        res.send({ status: "success", payload: result })
    }   
}

const save = async (req, res) => { // Agrega una colección (que representa a un carrito) al archivo gracias a Postman. Devuelve su id asignado
    const result = await contenedorCarrito.save()
    res.send({ status: "sucess", message: "Cart added", idCart: result })
}

const saveContainerInContainer = async (req, res) => { // Agrega un producto particular en un carrito en particular
    let { cid, pid } = req.params;

    let carritoId, productoId
    try { 
        carritoId = await contenedorCarrito.getById(cid)
        productoId = await contenedorProductos.getById(pid)
    } catch (error) {
        req.logger.error(`${req.infoPeticion} | Cart or product not found | ${error}`)
        return res.send({ error: "Cart or product not found"})
    }

    if (!carritoId) {
        req.logger.error(`${req.infoPeticion} | Cart not found`)
        res.status(404).send({ status: "error", error: "Cart not found" })
    
    } else if (!productoId) {
        req.logger.error(`${req.infoPeticion} | Product not found`)
        res.status(404).send({ status: "error", error: "Product not found" })
    
    } else {
        contenedorCarrito.saveContainerInContainer(cid, pid)
        res.send({ status: "success" })
    }
}

const deleteById = async (req, res) => { // Vacía un carrito según su id
    let { cid } = req.params
    const datosArchivo = await contenedorCarrito.getAll()
    
    if (datosArchivo.some(carrito => carrito.id == cid)) { // Primero verifica si el carrito con ese id está en el archivo
        await contenedorCarrito.deleteById(cid)
        res.send({ status: "sucess", message: `Carrito con id ${cid} vaciado` })

    } else {
        req.logger.error(`${req.infoPeticion} | Cart not found`)
        res.send({ error: "Cart not found" })
    }
}

const deleteContainerInContainer = async (req, res) => { // Elimina un producto del carrito según sus ids
    let { cid, pid } = req.params;

    let carritoId
    try {
        carritoId = await contenedorCarrito.getById(cid)
    } catch (error) {
        req.logger.error(`${req.infoPeticion} | Cart not found | ${error}`)
        return res.send({ error: "Cart not found"})
    }
    
    if (!carritoId) {
        req.logger.error(`${req.infoPeticion} | Cart not found`)
        res.status(404).send({ status: "error", error: "Cart not found" })
    
    } else {
        let borrado
        try {
            borrado = await contenedorCarrito.deleteContainerInContainer(cid, pid)
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | Cart not found | ${error}`)
            return res.status(404).send({ status: "error", error: "Cart not found" })
        }

        if (borrado) {
            res.send({ status: "success" })
        } else {
            req.logger.error(`${req.infoPeticion} | Product not found in cart`)
            res.status(404).send({ status: "error", error: "Product not found in cart" })
        }
    }
}

export default {
    getAll,
    getById,
    save,
    saveContainerInContainer,
    deleteById,
    deleteContainerInContainer
}
