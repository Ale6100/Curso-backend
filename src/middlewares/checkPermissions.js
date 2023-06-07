import config from "../config/config.js"

const checkPermissions = (req, res, next) => { // Chequea si la persona que hace peticiones está autorizado para eso
    if (req.url.includes("/api/sessions/login") || req.url.includes("/api/sessions/logout")) return next() // No quiero que exista ese chequeo para loguearte y desloguearte
    
    if (req.headers.origin?.includes(config.site.urlfrontend)) { // Entra en este if si hacemos la petición desde el frontend. Gracias al módulo cors sé que las peticiones desde el cliente siempre van a tener el origin
        if (req.file || req.headers.authorization?.split(" ")[1] === config.site.accessToken) return next() // Permitimos el acceso del cliente sólo si en los encabezados coloca el token de acceso, utilizando el esquema de autenticación Bearer
        req.logger.error(`${req.infoPeticion} | Forbidden | You do not have permissions, be sure to pass a valid access token "accesToken" in the body of your request to the server`)
        return res.status(403).send({ status: "error", "error": 'Forbidden | You do not have permissions, be sure to pass a valid access token "accesToken" in the body of your request to the server' })
    }

    if (req.method === "GET") {
        if (req.url === "/" || req.url.includes("/api-docs")) return next() // Permito el método GET en las rutas base y en la correspondiente a la documentación, para poder navegar entre ellas
    }
    
    if (!req.user) { // Me aseguro que nadie pueda usar ninguno de los endpoints desde el backend sin estar logueado. Para loguearte puedes hacerlo desde la documentación en /api-docs/
        return res.status(403).send({ status: "error", "error": "Forbidden | You do not have permissions, please login" })
    
    } else if (req.user.role === "user") { // Impide el paso del usuario logueado sin permisos de admin
        return res.status(403).send({ status: "error", "error": "Forbidden | You do not have permissions, this path is for administrators only" })
    
    } else if (req.user.role === "admin") { // Permite el paso al administrador
        return next()
    }

    req.logger.fatal(`${req.infoPeticion} | This message should not be visible, please check if your roles are only "admin" and "user"`)
}

export default checkPermissions
