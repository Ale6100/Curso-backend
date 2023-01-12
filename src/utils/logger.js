import winston from "winston";

const customLevelsConfig = { // Creo mis propios niveles de prioridad para usar en winston
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
}

export const logger = winston.createLogger({
    levels: customLevelsConfig,
    transports: [ // Diferentes medios que va a tomar el logger para poder llevar a cabo su proceso de log
        new winston.transports.Console({ // Especifico que uno de los medios para crear logs será la consola
            level: "info" // Nivel de prioridad minímo en el cual se va a utilizar este transporte (ver niveles por defecto en https://github.com/winstonjs/winston#logging-levels)
        }),
        
        new winston.transports.File({ // Otro medio para guardar logs será en archivos
            level: "warn",
            filename: "./info/warn.log"
        }),

        new winston.transports.File({
            level: "error",
            filename: "./info/error.log"
        }),

        new winston.transports.File({
            level: "fatal",
            filename: "./info/fatal.log"
        })
    ]
})

export const addLogger = (req, res, next) => { // Esto luego en app.js se setea como middleware
    req.logger = logger;  // Agrego la configuracion del logger al req, para usarlo en cualquier ruta
    req.logger.info(`${req.infoPeticion}`) // Se muestra este mensaje en la consola con el método "info" cada vez que se visita una ruta
    next()
}
