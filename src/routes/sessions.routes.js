import { Router } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import config from "../config/config.js";
import passport from "passport";

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
router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failedRegister" }), async (req, res) => {
    const user = req.user; // Es lo que enviamos en el done de passport.config
    res.status(400).send({ status: "success", message: `Usuario registrado. Id: ${user.id} guardado` })
})

router.get("/failedRegister", (req, res) => { // Página que muestra un mensaje si salió un error imprevisto en el registro con passport
    res.status(500).send({ status: "error", error: "Error de passport a la hora de registrarte" })
})

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/failedLogin" }), async (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role
    }
    res.status(400).send({ status: "success", message: `Usuario con email ${req.user.email} logueado!` })
})

router.get("/failedLogin", (req, res) => { // Página que muestra un mensaje si salió un error imprevisto en el logueo con passport
    res.status(500).send({ status: "error", error: "Error de passport a la hora de loguearse" })
})


router.get("/logout", async (req, res) => {
    req.session.destroy(err=>{
        if (err) return res.status(500).send("No se pudo cerrar sesión")
    })
    return res.send({ status: "success", message: "Deslogueado" })
})

router.get("/github", passport.authenticate("github"), (req, res) => {}) // Abre gitHub y solicita los datos (está conectado con el botón del html)

router.get("/githubcallback", passport.authenticate("github"), (req, res) => { // Toma los datos de github e inicia sesión
    req.session.user = {
        name: `${req.user.first_name}`,
        email: req.user.email,
        role: req.user.role
    }
    res.status(400).send({ status: "success", message: `Usuario con email ${req.user.email} logueado!` })
})

router.get("/user", async (req, res) => {
    return res.send(req.session.user)
})

export default router
