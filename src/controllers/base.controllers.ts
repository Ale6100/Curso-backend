import sendMail from "../services/mailingService.js";
import __dirname from "../utils.js";
import config from "../config/config.js";
import { Request, Response } from "express";

const base = async (_req: Request, res: Response) => { // Renderiza una pequeña presentación en la ruta "/"
    res.render("index", { frontendUrl: config.site.urlfrontend })
}

const sendNewMail = async (req: Request, res: Response) => { // En api/sendNewMail con el método POST envía un mail con los valores pasados en el body
    const { from, to, subject, html } = req.body

    if (!from || !to || !subject || !html) {
        req.logger.error(`${req.infoPeticion} | Incomplete values`)
        return res.status(400).send({status: "error", error: "Valores incompletos"})
    }

    try {
        await sendMail({
            from,
            to,
            subject,
            html
        })

        return res.status(200).send({status: "success", message: "Enviado"})
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({status: "error", error})
    }
}

export default {
    base,
    sendNewMail
}
