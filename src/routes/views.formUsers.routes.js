import { Router } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { passMongo } from "../../keys/key.js"

const router = Router();

const password = passMongo
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

router.get("/", (req, res) => {
    res.render("formUsers")
})

router.get("/login", (req, res) => {
    res.render("formLogin")
})

export default router
