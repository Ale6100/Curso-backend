import { Router } from "express"; 
import { Contenedor, ContenedorDeContenedores } from "../daos/index.js";
import __dirname from "../utils.js";
import nodemailer from "nodemailer"
import config from "../config/config.js";

const router = Router();

const contenedorProductos = new Contenedor("productos")
const contenedorCarrito = new ContenedorDeContenedores("carritos");

router.get("/", async (req, res) => { // Renderiza el formulario en la ruta "/" que sirve para cargar productos
    const usuario = req.session.user
    if (usuario === undefined) {
        res.render("formLogin")
    } else {
        const arrayProductos = await contenedorProductos.getAll()
        res.render("index", { arrayProductos, usuario })
    }
})

router.get("/profile", async (req, res) => {
    const usuario = req.session.user
    if (usuario === undefined) {
        res.render("formLogin")
    } else {
        res.render("profile", { usuario })
    }
})

router.get("/info", async (req, res) => {
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
})

router.get("/cart", async (req, res) => {
    res.render("cart")
})

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.nodemailer.user, // Gmail personalizado que se usa para enviar los mails con nodemailer
        pass: config.nodemailer.pass // Contraseña que te proporciona nodemailer
    }
})

router.put("/cart/comprar", async (req, res) => {
    const { user, subject, html } = req.body
    try {
        await transport.sendMail({
            from: `${user.first_name} ${user.last_name} < >`,
            to: "alejandro_portaluppi@outlook.com", // Aca deberia estar `${user.email}`
            subject: `${subject}`,
            html
        })

        await contenedorCarrito.deleteById(user.cartId)
        res.send({status: "success", message: "enviado"})
    } catch (error) {
        req.logger.error(`${req.infoPeticion} | ${error}`)
        res.send({status: "error", message: `Error: ${error}`})
    }
})

export default router;
