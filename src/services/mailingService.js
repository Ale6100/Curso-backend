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

const sendMail = async (objConf) => {
    const { from, to, subject, html, attachments } = objConf
    await transport.sendMail({
        from,
        to,
        subject,
        html,
        attachments
    })
}

export default sendMail
