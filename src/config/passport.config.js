import passport from "passport"
import local from "passport-local"
import GithubStrategy from "passport-github2"
import config from "./config.js"
import userModel from "../models/User.js"
import { createHash, validatePassword } from "../utils.js"

const LocalStrategy = local.Strategy // Forma de inicialización que proporciona passport para obtener la estrategia

const initializePassport = () => { // Le sirve al corazón principal para poder realizar las autenticaciones a partir de la estrategia que definamos dentro de esta función
    passport.use("register", new LocalStrategy({
        passReqToCallback: true, // Permite que la variable req viaje hacia el callback
        usernameField: "email" // Por defecto la función asíncrona pide el username. Acá le decimos que pida el email
    }, async (req, email, password, done) => {
        try {
            const { first_name, last_name } = req.body;
            if (!first_name || !last_name) return done(null, false, {message: "Incomplete values"}) // Le decimos que no hubo error (en realidad sí ya que faltan datos, pero no es culpa del passport) no mandamos ningún usuario, y enviamos un objeto con un oportuno mensaje
            
            const user = await userModel.findOne({ email })
        
            if (user !== null) return done(null, false, {message: "El email ya existe en nuestra base de datos"})
        
            const hashedPassword = await createHash(password)
        
            const usuario = {
                first_name,
                last_name,
                email,
                password: hashedPassword // Guardamos en MongoDB el pasword hasheado
            }
        
            const result = await userModel.create(usuario)
            done(null, result) // Enviamos al usuario, dando por hecho que todo salió bien
        } catch (error) {
            done(error)
        }
    }))

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {            
            const usuario = await userModel.findOne({ email })
            
            if (usuario === null) return done(null, false, {message:  "Email no encontrado"})
            
            const isValidPassword = await validatePassword(usuario, password)
            if (!isValidPassword) return done(null, false, {message:  "Invalid password"})
        
            done(null, usuario) // Enviamos al usuario (luego lo llamamos con req.user)
        } catch (error) {
            done(error)
        }
    }))

    passport.use("github", new GithubStrategy({
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accesToken, refreshToken, profile, done) => {
        const { email, name } = profile._json;
        let user = await userModel.findOne({ email })
        if (!user) { // Si el usuario no existía, lo creo
            let newUser = {
                first_name: name,
                email,
                password: ""
            }
            let result = await userModel.create(newUser)
            return done(null, result);
        }
        return done(null, user)
    }))

    passport.serializeUser((user, done) => { // Serializamos a los usuarios y los deserializamos fuera de la sesión, para restaurar el estado de autenticación a través de solicitudes HTTP 
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const result = await userModel.findOne({ _id: id })
        return done(null, result)
    })
}

export default initializePassport;