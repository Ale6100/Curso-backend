import { Router } from "express"; 
import Contenedor from "../Contenedor.js";
import uploader from "../services/upload.js";

const router = Router(); // Inicializamos el router

const contenedor = new Contenedor("productos");

router.get("/", async (req, res) => { // En /api/productos devuelve todos los productos disponibles
    const result = await contenedor.getAll()
    res.send({ result })
})

router.get("/:idProducto", async (req, res) => { // En /api/productos/n devuelve el producto con id n, siempre y cuando exista
    const { idProducto } = req.params
    const result = await contenedor.getById(parseInt(idProducto))
    if (result === null) {
        res.send({ error: "Producto no encontrado"})
    } else {
        res.send({ result })
    }   
})

router.post("/", uploader.single("image"), async (req, res) => { // Agrega un producto al archivo gracias al formulario del index.html o manualmente con Postman. Devuelve su id asignado
    const producto = req.body;
    if (req.file) { // Si se envía desde el formulario se ejecuta este if
        producto.image = `${req.protocol}://${req.hostname}:8080/images/${req.file.filename}`
        const result = await contenedor.save(producto)
        res.send({ status: "sucess", message: "Producto agregado", result })

    } else if (producto.image) { // Se ejecuta en caso de que queramos agregar una imagen con Postman o Thunder Client por ejemplo, en vez de enviarlo desde el formulario. En este caso pasaríamos la url de una imágen como propiedad del objeto
        /*Para que esto funcione, se debe enviar en el método post un objeto con la siguiente estructura
        {
            "title": "Acá va el título",
            "price": "1000", (precio de ejemplo)
            "image": "aca va la url de la imagen"
        }
        */    
        const result = await contenedor.save(producto)
        res.send({ status: "sucess", message: "Producto agregado", result })

    } else {
        res.send({ error: "Datos ingresados incorrectamente"})
    }
})

// Actualiza un objeto del archivo gracias al formulario del index.html, siempre y cuando la opción "Actualizar producto" esté activada y el id del objeto esté pasado en el input correspondiente. También se puede hacer manualmente con Postman
router.put("/:idProducto", uploader.single("image"), async (req, res) => {
    const { idProducto } = req.params
    const producto = req.body;
    
    const datosArchivo = await contenedor.getAll()

    if (datosArchivo.some(objeto => objeto.id == idProducto)) { // Verifica que el objeto a actualizar realmente pertenezca al array de productos en el archivo
        if (req.file) { // Si se envía desde el formulario se ejecuta este if
            producto.image = `${req.protocol}://${req.hostname}:8080/images/${req.file.filename}`
            const objetoActualizado = {
                title: producto.title,
                price: producto.price,
                image: producto.image,
            }
            await contenedor.update(objetoActualizado, idProducto)
            res.send({ status: "sucess", message: `Producto con id ${idProducto} actualizado`})
        
        } else if (producto.image) { // Se ejecuta en caso de que queramos agregar una imagen con Postman o Thunder Client por ejemplo
            /*Para que esto funcione, se debe enviar en el método put un objeto con la siguiente estructura, utilizando como id del objeto al parámetro que viene en la url
            {
                "title": "Acá va el título",
                "price": "1000", (precio de ejemplo)
                "image": "aca va la url de la imagen"
            }
            */   
            await contenedor.update(producto, idProducto)
            res.send({ status: "sucess", message: `Producto con id ${idProducto} actualizado`})
        
        } else {
            res.send({ error: "Datos ingresados incorrectamente"})
        }
    } else {
        res.send({ error: "Producto no encontrado"})
    }
})

router.delete("/:idProducto", async (req, res) => { // Elimina un producto según su id. Es el mismo análisis aunque se haga con desde el formulario o con Postman
    const { idProducto } = req.params
    const datosArchivo = await contenedor.getAll()
    
    if (datosArchivo.some(objeto => objeto.id == idProducto)) { // Primero verifica si el producto con ese id está en el archivo
        await contenedor.deleteById(parseInt(idProducto))
        res.send({ status: "sucess", message: `Producto con id ${idProducto} eliminado` })
    } else {
        res.send({ error: "Producto no encontrado" })
    }
})

export default router;
