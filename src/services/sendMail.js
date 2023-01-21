import nodemailer from "nodemailer"
import config from "../config/config.js";

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.nodemailer.user, // Gmail personalizado que se usa para enviar los mails con nodemailer
        pass: config.nodemailer.pass // Contraseña que te proporciona nodemailer
    }
})

const enviarMail = async (user, subject, html) => {
    await transport.sendMail({
        from: `${user.first_name} ${user.last_name} < >`,
        to: `${user.email}`,
        subject: `${subject}`,
        html
    })
}

export default enviarMail
