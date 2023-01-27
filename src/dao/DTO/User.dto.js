class UserDto {
    static getDbDTOFrom = (user) => { // Recibe un usuario y devuelve al objeto con todos los campos que necesito para registrarlo
        return {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            direccion: user.direccion,
            age: user.age,
            phone: user.phone,
            image: user.image,
            cartId: user.cartId, // El método es útil si queremos devolver una propiedad que no siempre venga definida, por ejemplo podríamos agregar username: user.username || ""
        }
    }

    static getPresenterForm = (user) => { // Recibe un usuario y devuelve un objeto con menos y/o nuevos datos, para devolver los que deseo
        return {
            fullname: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
            age: user.age,
            phone: user.phone,
            image: user.image
        }
    }

    static getLoginForm = (user) => { // Recibe un usuario y devuelve un objeto con las propiedades que deseo que tenga al loguearse
        return {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            direccion: user.direccion,
            age: user.age,
            phone: user.phone,
            image: user.image,
            cartId: user.cartId,
            role: user.role
        }
    }
}

export default UserDto
