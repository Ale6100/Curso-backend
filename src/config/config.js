import dotenv from "dotenv"

dotenv.config(); // Copia todas las igualdades que estén en .env y las transforma como propiedades del process.env (es decir inicializa todas las variables de entorno que defina allí)

export default { // Exporto un objeto que incluye de manera ordenada las variables de entorno recién definidas
    mongo: {
        password: process.env.MONGO_PASSWORD
    },
    
    github: {
        clientId: process.env.GITHUB_CLIENTID,
        clientSecret: process.env.GITHUB_CLIENTSECRET
    }
}