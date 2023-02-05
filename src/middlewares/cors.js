const corsOptions = (whitelist) => { // Recibe una lista de dominios que tienen permido hacer peticiones
    return {
        credentials: true,
        origin: whitelist,
        optionsSuccessStatus: 200
    }
}
export default corsOptions
