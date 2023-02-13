const corsOptions = (whitelist) => { // Recibe una lista de dominios que tienen permido hacer peticiones. Advertencia: las url con la palabra explícita "localhost" no funcionan para loguearse
    return {
        credentials: true,
        origin: whitelist,
        optionsSuccessStatus: 200
    }
}
export default corsOptions
