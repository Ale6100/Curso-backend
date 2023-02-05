import dotenv from "dotenv"

dotenv.config(); // Copia todas las igualdades que estén en el archivo ".env" y las transforma como propiedades del process.env (es decir inicializa todas las variables de entorno que defina allí)

// Por seguridad el archivo .env no lo dejo como público, puedes hacerte el tuyo a la altura de la carpeta src

export default { // Exporto un objeto que incluye de manera ordenada las variables de entorno recién mencionadas
    mongo: {
        url: process.env.MONGO_URL
    },

    nodemailer: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    },

    jwt: {
        nameCookie: process.env.JWT_NAME_COOKIE,
        secret: process.env.JWT_SECRET
    },

    site: {
        urlfrontend: process.env.URL_FRONTEND // Sitio donde está ubicado nuestro frontend
    }
}
