import PaymentService from "../services/payments.js"
import sendMail from "../services/mailingService.js"
import { productService, cartService } from "../services/repositories/services.js"

const paymentIntents = async (req, res) => { // En api/payments/payment-intents con el método POST, inicializo un intento de pago
    const { total, clientId, direccion, phone } = req.body

    if (!total || !clientId || !direccion) { // Este error nunca debería suceder
        req.logger.error(`${req.infoPeticion} | Incomplete values`)
        return res.status(400).send({ status: "error", error: "Incomplete values" })
    }

    const paymentIntentsInfo = {
        amount: total, // Precio total
        currency: "usd", // Tipo de cambio
        metadata: { // Información opcional adicional
            clientId,
            direccion,
            phone
        }
    }

    const paymentService = new PaymentService()
    let result = await paymentService.createPaymentIntent(paymentIntentsInfo)

    res.status(200).send({ status: "success", payload: result })
}

const updateCartDeleteStockSendMail = async (req, res) => { // En api/payments/updateCartDeleteStockSendMail con el método PUT, actualiza el carrito de la base de datos, el stock, y envía un mail de confirmación de compra
    const { from, to, subject, html, cartId, products } = req.body

    if (!from || !to || !subject || !html || !cartId || !products) {
        req.logger.error(`${req.infoPeticion} | Incomplete values`)
        return res.status(400).send({status: "error", error: "Valores incompletos"}) // No debería mostrarse nunca este error
    }

    try {
        await sendMail({
            from,
            to,
            subject,
            html
        })

        await cartService.deleteCartById(cartId)
        for (let i=0; i<products.length; i++) {
            await productService.updateBy({ _id: products[i]._id }, { $inc: { stock: -products[i].quantity } })
        }
        
        res.status(200).send({status: "success", message: "Petición exitosa"})

    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        res.status(500).send({status: "error", error})
    }
}

export default {
    paymentIntents,
    updateCartDeleteStockSendMail
}
