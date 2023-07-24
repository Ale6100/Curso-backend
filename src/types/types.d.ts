import { UserSaveMongo } from "./users";
import { ProductSaveMongo } from "./products";
import { CartSaveMongo } from "./carts";

type Email = `${string}@${string}`

export interface Models { // Modelos disponibles actualmente
    user: "users",
    product: "products",
    cart: "carts"
}

export type PosibleModels = Models[keyof Models]; // Es la unión de todos los strings de Models (pasar el mouse por encima)

export interface SendMail {
    from: string,
    to: Email,
    subject: string
    html: string,
    attachments?: {
        filename: string,
        path: string
    }[]
}

export interface GetMongo { // Propiedades que se pueden utilizar para obtener un documento de MongoDB
    _id?: string,
    email?: Email,
    title?: string
}

export type PostMongo = UserSaveMongo | ProductSaveMongo | CartSaveMongo

export interface DeleteMongo {
    _id: string
}

export interface ReferenceUpdateBy {
    _id: string
}