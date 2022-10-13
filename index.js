"use strict";

class Usuario {
    constructor(nombre, apellido) {
        this.nombre = nombre
        this.apellido = apellido
        this.libros = []
        this.mascotas = []
    }

    getFullName() {
        return `${this.nombre} ${this.apellido}`
    }

    addMascota(nombreMascota) {
        this.mascotas.push(nombreMascota)
    }

    countMascotas() {
        return this.mascotas.length
    }

    addBook(nombre, autor) {
        this.libros.push({
            nombre: nombre,
            autor: autor
        })
    }

    getBookNames() {
        return this.libros.map(libro => libro.nombre)
    }
}

const usuario = new Usuario("Juan", "Pérez") // Creo el usuario

console.log(`El usuario se llama ${usuario.getFullName()}`) // Consulto su nombre completo

usuario.addMascota("Perro") // Agrego dos mascotas
usuario.addMascota("Gato")

console.log(`El usuario tiene ${usuario.countMascotas()} mascotas`) // Consulto la cantidad de mascotas actuales

usuario.addBook("Harry Potter", "J. K. Rowling") // Agrega dos libros
usuario.addBook("Los juegos del hambre", "Suzanne Collins")

console.log(`Los libros del usuario son: ${usuario.getBookNames()}`) // Consulto los libros actuales del usuario
