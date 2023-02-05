import config from "../config/config.js"
import jwt from "jsonwebtoken"

//! El checkLogger de abajo lo uso en el front de React
// const checkLogger = (req, res, next) => { // Se encarga de obtener la información del usuario actual, si es que está logueado
//     const token = req.cookies[config.jwt.nameCookie]; // Obtiene la cookie del usuario que tiene la sesión iniciada (si no hay, sigifica que no hay una sesión abierta)
//     try {
//         const user = jwt.verify(token, config.jwt.secret); // Descifra al usuario
//         req.user = user; // Define req.user, para poder llamar al usuario actual en cualquier otro req que venga después 
//     } catch (error) {
//         console.log("-----")
//     }
//     next()
// }

const checkLogger = (req, res, next) => { // Se encarga de impedir que se realicen peticiones a las rutas a aquellos usuario no logueados
    const rutasIgnoradas = ["/formUsers/restorePassword", "/formUsers/passwordRestoreRequest", "/favicon.ico", "/api/sessions/passwordRestoreRequest", "/api/sessions/login", "/api/sessions/register", "/api/sessions/restorePassword"] // Rutas que serán ignoradas por el middleware
    const seIgnora = rutasIgnoradas.some(ruta => req.url.includes(ruta))
    if (seIgnora) return next()

    try {
        const token = req.cookies[config.jwt.nameCookie]; // Obtiene la cookie del usuario que tiene la sesión iniciada (si no hay, sigifica que no hay una sesión abierta)

        if (!token) {
            if (req.url.includes("/formUsers/register") || req.url.includes("/formUsers/login")) return next() // No quiero que de error ni rediriga si el usuario trata de entrar a estas rutas cuando no está logueado

            req.logger.warn(`${req.infoPeticion} | Se trató de visitar la ruta sin estar logueado`)
            return res.redirect("/formUsers/login?redirect=true"); // Si no hay una sesión abierta, te redirige al login
        }
        
        const user = jwt.verify(token, config.jwt.secret); // Descifra al usuario
        req.user = user; // Define req.user, para poder llamar al usuario actual en cualquier otro req que venga después
        next()

    } catch (error) {
        if (error.name === "TokenExpiredError") { // Si el tiempo expiró te va a redirigir a login, a menos que ya te encuentres en register o login
            if (req.url.includes("/formUsers/register") || req.url.includes("/formUsers/login")) return next()
        }

        req.logger.fatal(`${req.infoPeticion} | ${error.name}`)
        res.redirect("/formUsers/login?redirect=true")
    }
}

export default checkLogger
