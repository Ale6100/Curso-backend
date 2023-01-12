import dotenv from "dotenv"

dotenv.config(); // Copia todas las igualdades que estén en el archivo ".env" y las transforma como propiedades del process.env (es decir inicializa todas las variables de entorno que defina allí)

// Por seguridad el archivo .env no lo dejo como público, puedes hacerte el tuyo a la altura de la carpeta src

export default { // Exporto un objeto que incluye de manera ordenada las variables de entorno recién mencionadas
    mongo: {
        password: process.env.MONGO_PASSWORD
    },

    github: {
        clientId: process.env.GITHUB_CLIENTID,
        clientSecret: process.env.GITHUB_CLIENTSECRET
    },

    site: {
        name: process.env.SITE_NAME
    }
}