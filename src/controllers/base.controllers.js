import { Contenedor, ContenedorDeContenedores } from "../daos/index.js";
import enviarMail from "../services/sendMail.js";

const contenedorProductos = new Contenedor("productos")
const contenedorCarrito = new ContenedorDeContenedores("carritos");

const base = async (req, res) => { // Renderiza el formulario en la ruta "/" que sirve para cargar productos
    const usuario = req.session.user
    if (usuario === undefined) {
        res.render("formLogin")
    } else {
        const arrayProductos = await contenedorProductos.getAll()
        res.render("index", { arrayProductos, usuario })
    }
}

const profile = async (req, res) => {
    const usuario = req.session.user
    if (usuario === undefined) {
        res.render("formLogin")
    } else {
        res.render("profile", { usuario })
    }
}

const info = async (req, res) => {
    const info = {
        argumentosEntrada: process.argv.slice(2),
        sistemaOperativo: process.platform,
        versionNode: process.version,
        memoriaTotalReservada: process.memoryUsage(),
        pathEjecucion: __dirname,
        processId: process.pid,
        carpetaProyecto: process.cwd()
    }
    res.render("info", { info })
}

const cart = async (req, res) => {
    res.render("cart")
}

const comprar = async (req, res) => {
    const { user, subject, html } = req.body
    try {
        await enviarMail(user, subject, html)
        await contenedorCarrito.deleteById(user.cartId)
        res.send({status: "success", message: "enviado"})
    } catch (error) {
        req.logger.error(`${req.infoPeticion} | ${error}`)
        res.send({status: "error", message: `Error: ${error}`})
    }
}

export default {
    base,
    profile,
    info,
    cart,
    comprar
}
