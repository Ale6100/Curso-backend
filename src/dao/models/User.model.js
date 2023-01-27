class User {
    static get model() { // Nombre de la colección a manipular
        return "users"
    }

    static get schema() { // Estructura que tendrá cada documento en mongo
        return {
            first_name: {
                type: String,
                required: true
            },

            last_name: {
                type: String,
                required: true
            },

            email: {
                type: String,
                required: true,
                unique: true
            },

            password: {
                type: String,
                required: true
            },

            direccion: {
                type: String,
                required: true
            },

            age: {
                type: Number,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            image: {
                type: String,
                required: true
            },

            cartId: { // Cada usuario tiene un carrito asociado
                type: String,
                required: true
            },

            role: {
                type: String,
                required: true,
                default: "user"
            }
        }
    }
}

export default User
