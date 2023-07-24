import config from "../config/config.js"
import Stripe from "stripe"

export default class PaymentService {
    private stripe: Stripe

    constructor() {
        this.stripe = new Stripe(config.stripe.secret_key, { apiVersion: '2022-11-15' })

    }

    createPaymentIntent = async (data: Stripe.PaymentIntentCreateParams) => { // Crea un intento de pago usando Stripe
        const paymentIntent = await this.stripe.paymentIntents.create(data)
        return paymentIntent
    }
}
