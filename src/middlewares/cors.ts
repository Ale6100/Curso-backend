const corsOptions = (whitelist: string[]) => { // Recibe una lista de dominios que tienen permido hacer peticiones. Aclaración: las url con la palabra explícita "localhost" no funcionan correctamente
    return {
        credentials: true,
        origin: whitelist,
        optionsSuccessStatus: 200
    }
}
export default corsOptions
