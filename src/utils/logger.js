import winston from "winston";

const customLevelsConfig = { // Creo mis propios niveles de prioridad para usar en winston
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
}

export default winston.createLogger({
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
