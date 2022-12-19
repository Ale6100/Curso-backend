import { Router } from "express";
import userModel from "../models/User.js"
import session from "express-session";
import MongoStore from "connect-mongo";
import key from "../../keys/key.js"

const router = Router();

const password = key
const database = "dbSession" // Si no existe, la crea

router.use(session({ 
    store: MongoStore.create({ // Crea un sistema de almacenamiento en Mongo. Guarda la session en Mongo
        mongoUrl: `mongodb+srv://backendCoder:${password}@cluster1.typ6zn6.mongodb.net/${database}?retryWrites=true&w=majority`,
        ttl: 60
    }),
    secret: "asd",
    resave: false, // Esta propiedad y la de abajo las dejo en false porque la persistencia y el sistema de vida de la session la maneja el store
    saveUninitialized: false
}))

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" })
    
    const user = await userModel.findOne({ email })

    if (user !== null) return res.status(400).send({ status: "error", error: "El email ya existe en nuestra base de datos" })

    const usuario = {
        first_name,
        last_name,
        email,
        password
    }

    const result = await userModel.create(usuario)
    
    res.status(400).send({ status: "success", message: `Usuario con mail ${usuario.email} e id ${result.id} guardado` })
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" })
    
    const usuario = await userModel.findOne({ email, password })

    if (usuario === null) return res.status(400).send({ status: "error", error: "Email o contraseña incorrectos" })

    req.session.user = {
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        email: usuario.email,
        role: usuario.role
    }

    res.status(400).send({ status: "success", message: `Usuario con email ${usuario.email} logueado!` })
})

router.get("/logout", async (req, res) => {
    req.session.destroy(err=>{
        if (err) return res.status(500).send("No se pudo cerrar sesión")
    })
    return res.send({ status: "success", message: "Deslogueado" })
})

router.get("/user", async (req, res) => {
    return res.send(req.session.user)
})

export default router
