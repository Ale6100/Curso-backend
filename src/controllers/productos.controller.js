import { productService } from "../services/repositories/services.js"

const stringAleatorio = (n) => { // Devuelve un string aleatorio de longitud n
    const simbolos = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789¡!¿?@#$%&()+-=*,.;:_"
    let stringRandom = ""
    for (let i=1; i<=n; i++) {
        stringRandom += simbolos[Math.floor(simbolos.length*Math.random())]
    }
    return stringRandom
}

const getAll = async (req, res) => { // En /api/products con el método GET devuelve todos los productos disponibles
    const result = await productService.getAll()
    res.status(200).send({ status: "success", payload: result })
}

const getById = async (req, res) => { // En /api/products/pid con el método GET devuelve el producto con id pid, siempre y cuando exista
    const { pid } = req.params

    let result
    try {
        result = await productService.getBy({ _id: pid })
        if (!result) {
            return res.status(404).send({ status: "error", error: "Product not found"})
        }
    } catch (error) {
        req.logger.error(`${req.infoPeticion} | Product not found | ${error}`) // Da error cuando el tipo de id solicitado no es compatible con el id de Mongo
        return res.status(404).send({ status: "error", error: "Product not found"})
    }

    res.status(200).send({ status: "success", payload: result })
}

const getByTitle = async (req, res) => { // En /api/products/title/:ptitle con el método GET devuelve el producto con título ptitle, siempre y cuando exista
    const { ptitle } = req.params
    let result
    try {
        result = await productService.getBy({ title: ptitle })
    } catch (error) {
        req.logger.error(`${req.infoPeticion} | Product not found | ${error}`) // Da error cuando el tipo de id solicitado no es compatible con el id de Mongo
        return res.status(404).send({ status: "error", error: "Product not found"})
    }

    if (!result) {
        req.logger.error(`${req.infoPeticion} | Product not found`)
        res.status(404).send({ status: "error", error: "Product not found"})
    } else {
        res.status(200).send({ status: "success", payload: result })
    }
}

const save = async (req, res) => { // En /api/products con el método POST agrega un producto a Mongo. Devuelve su id asignado
    const { title, description, price, image, stock } = req.body; // Traigo sólo las propiedades que me interesan, por seguridad

    if (!title || !description || !price || !stock || (!req.file && !image)) {
        req.logger.error(`${req.infoPeticion} | Incomplete values`)
        return res.status(400).send({ status: "error", error: "Campos incompletos" })
    }

    const product = await productService.getBy({ title })
    if (product) {
        req.logger.error(`${req.infoPeticion} | El producto ya existe, no puedes crearlo!`)
        return res.status(400).send({status: "error", error: "El producto ya existe, no puedes crearlo!"})     
    }

    const producto = {
        title,
        description,
        image: image || `/images/products/${req.file.filename}`, // Si paso la url de una imagen externa se guarda con el protocolo https incluído. Si es una ruta local, entonces sé que es una imagen cargada con Multer
        price: parseFloat(price),
        stock,
        code: stringAleatorio(10)
    }
    const result = await productService.save(producto)
    res.status(200).send({ status: "success", message: "Product added", idProduct: result._id })
}

const update = async (req, res) => { // En /api/products/pid con el método PUT, actualiza un producto de Mongo, siempre y cuando el id del producto esté pasado en la URL y sea válido
    const { pid } = req.params

    const datosArchivo = await productService.getAll()
    const oldProduct = await productService.getBy({ _id: pid })

    const { title, description, price, image, stock } = req.body;

    title && (oldProduct.title = title)
    description && (oldProduct.description = description)
    price && (oldProduct.price = price)
    stock && (oldProduct.stock = stock)
    req.file && (oldProduct.image = `/images/products/${req.file.filename}`)
    image && (oldProduct.image = image) // En principio esto no debería ser necesario, pero lo dejo por si se desea testear el endpoint con Swagger, mandando una imagen usando una URL

    if (datosArchivo.some(objeto => objeto._id == pid)) {
        await productService.updateBy({_id: pid}, {$set: {...oldProduct}})
        res.status(200).send({ status: "success", message: `Producto actualizado`})

    } else {
        req.logger.error(`${req.infoPeticion} | Product not found`)
        res.status(404).send({status: "error", error: "Producto no encontrado"})
    }
}

const deleteById = async (req, res) => { // En /api/products/pid con el método DELETE, elimina un producto según su id
    const { pid } = req.params

    const datosArchivo = await productService.getAll()
    
    if (datosArchivo.some(objeto => objeto._id == pid)) { // Primero verifica si el producto con ese id está en el archivo
        await productService.deleteBy({ _id: pid })
        res.status(200).send({ status: "success", message: `Producto eliminado` })
    } else {
        req.logger.error(`${req.infoPeticion} | Product not found`)
        res.status(404).send({ status: "error", error: "Producto no encontrado" })
    }
}

export default {
    getAll,
    getById,
    getByTitle,
    save,
    update,
    deleteById
}
