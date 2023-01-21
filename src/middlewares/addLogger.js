import logger from "../utils/logger.js"

export const addLogger = (req, res, next) => {
    const fecha = new Date().toLocaleDateString('es', { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"})
    req.infoPeticion = `${fecha} | Petición a la ruta '${req.url}' | Método ${req.method}` // Defino esta propiedad para usarla en cualquier otro req
    req.logger = logger;  // Agrego la configuracion del logger al req, para usarlo en cualquier ruta
    req.logger.info(`${req.infoPeticion}`) // Se muestra este mensaje en la consola con el método "info" cada vez que se visita una ruta
    next()
}
