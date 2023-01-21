import { Router } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import config from "../config/config.js";
import passport from "passport";
import uploader from "../services/upload.js";

const router = Router();

const password = config.mongo.password
const database = "dbSession" // Si no existe, la crea

router.use(session({ 
    store: MongoStore.create({ // Crea un sistema de almacenamiento en Mongo. Guarda la session en Mongo
        mongoUrl: `mongodb+srv://backendCoder:${password}@cluster1.typ6zn6.mongodb.net/${database}?retryWrites=true&w=majority`,
        ttl: 60*60*24*7
    }),
    secret: "asd",
    resave: false, // Esta propiedad y la de abajo las dejo en false porque la persistencia y el sistema de vida de la session la maneja el store
    saveUninitialized: false
}))

// passport.authenticate("register") // Para indicarle que queremos usar la estrategia register
router.post("/register", uploader.single("image"), passport.authenticate("register", { failureRedirect: "/api/sessions/failedRegister" }), async (req, res) => {
    const user = req.user; // Es lo que enviamos desde el done de passport.config
    res.status(400).send({ status: "success", message: `Usuario registrado. Id: ${user.id} guardado` })
})

router.get("/failedRegister", (req, res) => { // Página que muestra un mensaje si salió un error imprevisto en el registro con passport
    res.status(500).send({ status: "error", error: "Error de passport a la hora de registrarte" })
})

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/failedLogin" }), async (req, res) => {
    const {first_name, last_name, email, direccion, age, phone, image, cartId, role} = req.user

    req.session.user = { // Propiedades que tiene cada usuario logueado
        first_name,
        last_name,
        email,
        direccion,
        age,
        phone,
        image,
        cartId,
        role
    }
    res.status(400).send({ status: "success", message: `Usuario con email ${req.user.email} logueado!` })
})

router.get("/failedLogin", (req, res) => { // Página que muestra un mensaje si salió un error imprevisto en el logueo con passport
    res.status(500).send({ status: "error", error: "Error de passport a la hora de loguearse" })
})

router.get("/logout", async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            req.logger.fatal(`${req.infoPeticion} | No se pudo cerrar sesión | ${error}`)
            return res.status(500).send({ status: "error", message: "No se pudo cerrar sesión" })
        }
    })
    return res.send({ status: "success", message: "Deslogueado" })
})

router.get("/user", async (req, res) => {
    return res.send(req.session.user)
})

export default router
