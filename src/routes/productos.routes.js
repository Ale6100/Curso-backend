import { Router } from "express"; 
import Contenedor from "../Managers/Contenedor.js";

const router = Router(); // Inicializamos el router

const contenedor = new Contenedor("productos");

let admin = true; // Valor booleano que indica si el usuario tiene permisos de administrador

router.get("/", async (req, res) => { // En /api/products devuelve todos los productos disponibles
    const result = await contenedor.getAll()
    res.send({ status: "success", payload: result })
})

router.get("/:pid", async (req, res) => { // En /api/products/n devuelve el producto con id n, siempre y cuando exista
    const { pid } = req.params
    const result = await contenedor.getById(parseInt(pid))
    if (result === null) {
        res.send({ error: "Product not found"})
    } else {
        res.send({ status: "success", payload: result })
    }   
})

router.post("/", async (req, res) => { // Agrega un producto al archivo gracias a Postman. Devuelve su id asignado
    if (!admin) {
        return res.send({ error: -1, description: "Ruta '/api/products', método POST no autorizado" })
    }

    const { title, description, image, price, stock } = req.body; // Traigo sólo las propiedades que me interesan, por seguridad
        
    if (!title || !description || !image || !price || !stock) {
        res.status(400).send({ status: "error", error: "Incomplete values" })
    
    } else {
        const producto = { // Esta estructura debe tener el objeto mandado por Postman
            title,
            description,
            image,
            price: parseFloat(price),
            stock
        }
        const result = await contenedor.save(producto)
        res.send({ status: "sucess", message: "Product added", idProduct: result })
    }
})

// Actualiza un objeto del archivo gracias a Postman, siempre y cuando el id del objeto esté pasado en la URL
router.put("/:pid", async (req, res) => {
    const { pid } = req.params

    if (!admin) {
        return res.send({ error: -1, description: `Ruta '/api/products/${pid}', método PUT no autorizado` })
    }

    const datosArchivo = await contenedor.getAll()

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
        res.status(400).send({ status: "error", error: "Incomplete values" })
    
    } else if (datosArchivo.some(objeto => objeto.id == pid)) {
        await contenedor.update(producto, pid)
        res.send({ status: "sucess", message: `Producto con id ${pid} actualizado`})

    } else {
        res.send({ error: "Product not found"})
    }
})

router.delete("/:pid", async (req, res) => { // Elimina un producto según su id
    const { pid } = req.params

    if (!admin) {
        return res.send({ error: -1, description: `Ruta '/api/products/${pid}', método DELETE no autorizado` })
    }

    const datosArchivo = await contenedor.getAll()
    
    if (datosArchivo.some(objeto => objeto.id == pid)) { // Primero verifica si el producto con ese id está en el archivo
        await contenedor.deleteById(parseInt(pid))
        res.send({ status: "sucess", message: `Producto con id ${pid} eliminado` })
    } else {
        res.send({ error: "Product not found" })
    }
})

export default router;
