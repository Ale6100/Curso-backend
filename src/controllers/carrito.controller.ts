import { Request, Response } from "express"
import { cartService, productService } from "../services/repositories/services.js"
import { ProductMongo } from "../types/products.js"
import { CartMongo } from "../types/carts.js"

const getAll = async (_req: Request, res: Response) => { // En /api/carts con el método GET devuelve todos los carritos disponibles
    const result = await cartService.getAll()
    res.status(200).send({ status: "success", payload: result })
}

const getById = async (req: Request, res: Response) => { // En /api/carts/cid con el método GET devuelve el carrito con id cid, siempre y cuando exista
    const { cid } = req.params
    let result
    try { 
        result = await cartService.getByAndPopulate({ _id: cid })
    } catch (error) {
        req.logger.error(`${req.infoPeticion} | Cart not found | ${error}`) // Da error cuando el tipo de id solicitado no es compatible con el id de mongo
        return res.status(404).send({ status: "error", error: "Cart not found"})
    }

    if (!result) {
        req.logger.error(`${req.infoPeticion} | Cart not found`)
        return res.status(404).send({ status: "error", error: "Cart not found"})
    } else {
        return res.status(200).send({ status: "success", payload: result })
    }   
}

const save = async (_req: Request, res: Response) => { // En api/carts con el método POST agrega a Mongo un nuevo objeto que representa a un carrito. Devuelve su id asignado
    const result = await cartService.save({ // Creo un nuevo carrito y luego en otro código asocio su id al usuario que acaba de registrarse
        contenedor: []
    })
    res.status(200).send({ status: "sucess", message: "Cart added", idCart: result._id.valueOf() })
}

const saveContainerInContainer = async (req: Request, res: Response) => { // En api/carts/cid/products/:pid?cant=cant con el método POST agrega "cant" productos de un mismo tipo en un carrito, según sus ids
    try {
        const { cid, pid } = req.params;
        const query = req.query
        let cant_ = query["cant"] as string
        const cant = parseInt(cant_)
    
        let cart: CartMongo
        let product: ProductMongo

        const cid_ = cid ?? ""
        const pid_ = pid ?? ""

        try {
            cart = await cartService.getBy({ _id: cid_ })
            product = await productService.getBy({ _id: pid_ })
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | Cart or product not found | ${error}`)
            return res.status(404).send({ error: "Cart or product not found"})
        }
    
        if (!cart) {
            req.logger.error(`${req.infoPeticion} | Cart not found`)
            return res.status(404).status(404).send({ status: "error", error: "Cart not found" })
        }
        
        if (!product) {
            req.logger.error(`${req.infoPeticion} | Product not found`)
            return res.status(404).status(404).send({ status: "error", error: "Product not found" })
        }
    
        if (cart.contenedor.length !== 0) { // Si X es el stock actual e Y es la cantidad de productos en el carrito, entonces me aseguro de que no se puedan agregar más productos al carrito si cant > X - Y, porque si no, en ese caso habría más productos en el carrito que stock disponible
            const result = cart.contenedor.find(( p => p.idProductInCart.valueOf() === product._id.valueOf() ))
            const quantity = result ? result.quantity : 0 // Cantidad de veces que el producto está en el carrito
    
            if (cant > product.stock - quantity) {
                req.logger.error(`${req.infoPeticion} | Out of stock`)
                return res.status(400).send({ status: "error", error: `Error: Superas el stock disponible` }) 
            }
        }
    
        const updatedProduct = await cartService.saveContainerInContainer(cid_, pid_, cant)
        return res.status(200).send({ status: "success", message: "Producto agregado al carrito", updatedProduct })
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({status: "error", error })
    }
}

const deleteById = async (req: Request, res: Response) => { // En api/carts/cid con el método DELETE, vacía un carrito según su id
    let { cid } = req.params
    const datosArchivo = await cartService.getAll()
    
    if (datosArchivo.some(carrito => carrito._id == cid)) { // Primero verifica si el carrito con ese id está en el archivo
        const cid_ = cid ?? ""
        await cartService.deleteCartById(cid_)
        res.status(200).send({ status: "success", message: `Carrito con id ${cid} vaciado` })

    } else {
        req.logger.error(`${req.infoPeticion} | Cart not found`)
        res.status(404).send({ status: "error", error: "Cart not found" })
    }
}

const deleteContainerInContainer = async (req: Request, res: Response) => { // En api/carts/cid/products/pid con el método DELETE, elimina un producto del carrito según sus ids
    try {
        const { cid, pid } = req.params;

        let carritoId
        const cid_ = cid ?? ""
        const pid_ = pid ?? ""
        try {
            carritoId = await cartService.getBy({ _id: cid_ })
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | Cart not found | ${error}`)
            return res.status(404).send({ error: "Cart not found"})
        }
        
        if (!carritoId) {
            req.logger.error(`${req.infoPeticion} | Cart not found`)
            return res.status(404).send({ status: "error", error: "Cart not found" })
        }

        let borrado
        try {
            borrado = await cartService.deleteContainerInContainer(cid_, pid_)
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | Cart not found | ${error}`)
            return res.status(404).send({ status: "error", error: "Cart not found" })
        }

        if (borrado) {
            return res.status(200).send({ status: "success", message: "Producto eliminado del carrito" })
        } else {
            req.logger.error(`${req.infoPeticion} | Product not found in cart`)
            return res.status(404).send({ status: "error", error: "Product not found in cart" })
        }
        
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({status: "error", error })
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
