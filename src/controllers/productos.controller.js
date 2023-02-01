import { productService } from "../services/repositories/services.js"

let admin = true; // Valor booleano que indica si el usuario tiene permisos de administrador

const stringAleatorio = (n) => { // Devuelve un string aleatorio de longitud n
    const simbolos = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789¡!¿?@#$%&()+-=*,.;:_"
    let stringRandom = ""
    for (let i=1; i<=n; i++) {
        stringRandom += simbolos[parseInt(simbolos.length*Math.random())]
    }
    return stringRandom
}

const getAll = async (req, res) => { // En /api/products devuelve todos los productos disponibles
    const result = await productService.getAll()
    res.send({ status: "success", payload: result })
}

const getById = async (req, res) => { // En /api/products/n devuelve el producto con id n, siempre y cuando exista
    const { pid } = req.params
    let result
    try {
        result = await productService.getBy({ _id: pid })
    } catch (error) {
        req.logger.error(`${req.infoPeticion} | Product not found | ${error}`) // Da error cuando el tipo de id solicitado no es compatible con el id de mongo. Si esto sucede termina la petición
        return res.send({ error: "Product not found"})
    }

    if (!result) {
        req.logger.error(`${req.infoPeticion} | Product not found`)
        res.send({ error: "Product not found"})
    } else {
        res.send({ status: "success", payload: result })
    }
}

const save = async (req, res) => { // Agrega un producto al archivo gracias a Postman. Devuelve su id asignado
    if (!admin) {
        req.logger.error(`${req.infoPeticion} | Método no autorizado`)
        return res.send({ error: -1, description: "Ruta '/api/products', método POST no autorizado" })
    }

    const { title, description, image, price, stock } = req.body; // Traigo sólo las propiedades que me interesan, por seguridad
        
    if (!title || !description || !image || !price || !stock) {
        req.logger.error(`${req.infoPeticion} | Incomplete values`)
        res.status(400).send({ status: "error", error: "Incomplete values" })
    
    } else {
        const producto = { // Esta estructura debe tener el objeto mandado por Postman
            title,
            description,
            image,
            price: parseFloat(price),
            stock,
            code: stringAleatorio(10)
        }
        const result = await productService.save(producto)
        // res.redirect("/")
        res.send({ status: "sucess", message: "Product added", idProduct: result })
    }
}

const update = async (req, res) => { // Actualiza un objeto del archivo gracias a Postman, siempre y cuando el id del objeto esté pasado en la URL
    const { pid } = req.params

    if (!admin) {
        req.logger.error(`${req.infoPeticion} | Método no autorizado`)
        return res.send({ error: -1, description: `Ruta '/api/products/${pid}', método PUT no autorizado` })
    }

    const datosArchivo = await productService.getAll()

    const { title, description, image, price, stock } = req.body;
    
    const producto = { // Esta estructura debe tener el objeto mandado por Postman
        title,
        description,
        image,
        price: parseFloat(price),
        stock
    }
    producto.timestamp = Date.now()

    if (!title || !description || !image || !price || !stock) {
        req.logger.error(`${req.infoPeticion} | Incomplete values`)
        res.status(400).send({ status: "error", error: "Incomplete values" })
    
    } else if (datosArchivo.some(objeto => objeto.id == pid)) {
        await productService.updateBy({_id: pid}, {$set: {...producto}})
        res.send({ status: "sucess", message: `Producto con id ${pid} actualizado`})

    } else {
        req.logger.error(`${req.infoPeticion} | Product not found`)
        res.send({ error: "Product not found"})
    }
}

const deleteById = async (req, res) => { // Elimina un producto según su id
    const { pid } = req.params

    if (!admin) {
        req.logger.error(`${req.infoPeticion} | Método no autorizado`)
        return res.send({ error: -1, description: `Ruta '/api/products/${pid}', método DELETE no autorizado` })
    }

    const datosArchivo = await productService.getAll()
    
    if (datosArchivo.some(objeto => objeto.id == pid)) { // Primero verifica si el producto con ese id está en el archivo
        await productService.deleteBy({ _id: pid })
        res.send({ status: "sucess", message: `Producto con id ${pid} eliminado` })
    } else {
        req.logger.error(`${req.infoPeticion} | Product not found`)
        res.send({ error: "Product not found" })
    }
}

export default {
    getAll,
    getById,
    save,
    update,
    deleteById
}
