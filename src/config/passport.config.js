import passport from "passport"
import local from "passport-local"
import { createHash, validatePassword } from "../utils.js"
import { server } from "../app.js"
import { ContenedorDeContenedores, ContenedorUsers } from "../daos/index.js"

const contenedorCarrito = new ContenedorDeContenedores("carritos");
const contenedorUsers = new ContenedorUsers("users")

const LocalStrategy = local.Strategy // Forma de inicialización que proporciona passport para obtener la estrategia

const initializePassport = () => { // Le sirve al corazón principal para poder realizar las autenticaciones a partir de la estrategia que definamos dentro de esta función
    passport.use("register", new LocalStrategy({
        passReqToCallback: true, // Permite que la variable req viaje hacia el callback
        usernameField: "email" // Por defecto la función asíncrona pide el username. Acá le decimos que pida el email
    }, async (req, email, password, done) => {
        try {
            const { first_name, last_name, direccion, age, phone } = req.body;
            if (!first_name || !last_name || !direccion || !age || !phone || !req.file) {
                req.logger.error(`${req.infoPeticion} | Incomplete values`)
                return done(null, false, {message: "Incomplete values"}) // Le decimos que hubo un error independiente a passport (ya que faltan datos, pero no es culpa del passport), por lo tanto no mandamos ningún usuario y enviamos un objeto con un oportuno mensaje de error
            }
            
            const user = await contenedorUsers.getById({ email })
            if (user) {
                req.logger.error(`${req.infoPeticion} | El email ya existe en nuestra base de datos`)
                return done(null, false, {message: "El email ya existe en nuestra base de datos"})
            }
            
            const hashedPassword = await createHash(password)

            const cartId = await contenedorCarrito.save()

            const usuario = {
                first_name,
                last_name,
                email,
                password: hashedPassword, // Guardamos en MongoDB el pasword hasheado
                direccion,
                age,
                phone,
                image: `${req.protocol}://${req.hostname}:${server.address().port}/images/${req.file.filename}`, // La foto de perfil se guarda en esta ruta
                cartId // Cada usuario tiene su correspondiente carrito
            }
        
            const id = await contenedorUsers.save(usuario)
            const result = await contenedorUsers.getById({ id })
            done(null, result) // Enviamos al usuario, dando por hecho que todo salió bien
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error}`)
            done(error)
        }
    }))

    passport.use("login", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, email, password, done) => {
        try {            
            const usuario = await contenedorUsers.getById({ email })
            
            if (usuario === null) {
                req.logger.error(`${req.infoPeticion} | Email no encontrado`)
                return done(null, false, {message:  "Email no encontrado"})
            }
            
            const isValidPassword = await validatePassword(usuario, password)
            if (!isValidPassword) {
                req.logger.error(`${req.infoPeticion} | Invalid password`)
                return done(null, false, {message:  "Invalid password"})
            }
        
            done(null, usuario) // Enviamos al usuario (luego lo llamamos con req.user)
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error}`)
            done(error)
        }
    }))

    passport.serializeUser((user, done) => { // Serializamos a los usuarios y los deserializamos fuera de la sesión, para restaurar el estado de autenticación a través de solicitudes HTTP 
        if (user.id) done(null, user.id)
        else done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const result = await contenedorUsers.getById({ id })
        return done(null, result)
    })
}

export default initializePassport;
