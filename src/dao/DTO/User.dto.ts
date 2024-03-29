import { UserRegister, UserLogin, UserLogged, UserSaveMongo } from "../../types/users"

class UserDto {
    static getRegisterFrom = (user: UserRegister): UserSaveMongo => { // Recibe un usuario y devuelve al objeto con todos los campos que necesito para registrarlo
        return { // Actualmente no le estoy sacando provecho, pero el método es útil si, por ejemplo, queremos devolver una propiedad que no siempre venga definida. Por ejemplo podríamos agregar username: user.username || ""
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            direccion: user.direccion,
            date: user.date,
            phone: user.phone,
            image: user.image,
            cartId: user.cartId,
        }
    }

    static getLoginForm = (user: UserLogin): UserLogged => { // Recibe un usuario y devuelve un objeto con las propiedades que deseo que tenga al loguearse
        return {
            _id: user._id || "",
            first_name: user.first_name || "Administrator",
            last_name: user.last_name || "Account",
            email: user.email,
            direccion: user.direccion || "No aplica (administrador)",
            date: user.date || "No aplica (administrador)",
            phone: user.phone || "No aplica (administrador)",
            image: user.image || "https://img.icons8.com/ios/50/000000/admin-settings-male.png",
            cartId: user.cartId || "No aplica (administrador)",
            role: user.role || "admin"
        }
    }
}

export default UserDto
