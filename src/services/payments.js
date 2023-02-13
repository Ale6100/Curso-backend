import config from "../config/config.js"
import Stripe from "stripe"

export default class PaymentService {
    constructor() {
        this.stripe = new Stripe(config.stripe.secret_key)
    }

    createPaymentIntent = async (data) => { // Crea un intento de pago usando Stripe
        const paymentIntent = await this.stripe.paymentIntents.create(data)
        return paymentIntent
    }
}