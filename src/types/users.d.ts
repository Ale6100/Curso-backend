type Email = `${string}@${string}`

export interface UserRegister { // Usuario antes y después de registrarse
    first_name: string,
    last_name: string,
    email: Email,
    password: string,
    direccion: string,
    date: string,
    phone: string,
    image: string,
    cartId: string,
}

export interface UserLogin { // Usuario antes de loguearse
    _id?: string,
    first_name?: string,
    last_name?: string,
    email: Email,
    direccion?: string,
    date?: string,
    phone?: string,
    image?: string,
    cartId?: string,
    role?: "user",    
}

export interface UserLogged extends Required<UserLogin> { // Usuario logueado
    role: "admin" | "user",
}

export interface UserMongo { // Usuario en MongoDB
    _id: string,
    first_name: string,
    last_name: string,
    email: Email,
    password: string,
    direccion: string,
    date: string,
    phone: string,
    image: string,
    cartId: string,
    role: "admin" | "user",
}

export interface UserSaveMongo { // Usuario que se guardará en MongoDB
    first_name: string
    last_name: string
    email: Email
    password: string
    direccion: string
    date: string
    phone: string
    image: string
    cartId: string
}