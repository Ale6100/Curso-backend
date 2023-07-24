# Proyecto e-commerce completo | Parte backend

Este proyecto lo inicié en mi curso de Backend donde debía hacer un e-commerce, con el paso del tiempo lo estoy mejorando. La parte Frontend (necesaria para que funcione) se encuentra [aquí](https://github.com/Ale6100/Curso-backend-parte-front.git).

Utiliza la versión más reciénte del proyecto subido a la web [aquí](https://proyectocompleto.netlify.app/).

## Comenzando 🚀

Lee atentamente las siguientes instrucciones si deseas obtener una copia funcional del proyecto en tu computadora.

Primero debes descargar el archivo comprimido _zip_ desde el botón "code" o hacer click [aquí](https://github.com/Ale6100/Curso-backend/archive/refs/heads/main.zip).

Si en cambio deseas tener una copia en tu propio repositorio de GitHub puedes _Forkear_ el proyecto. 

Mira **Despliegue** para conocer cómo desplegar el proyecto.

### Pre-requisitos 📋

Necesitas tener previamente descargado e instalado [NodeJs](https://nodejs.org/).

### Instalación 🔧

Instala las dependencias con el comando

```
npm install
```

Es necesario crear variables de entorno mediante la elaboración de un archivo .env al mismo nivel que la carpeta src. Este archivo debe completarse con los siguientes campos, los cuales deben modificarse con tus propias credenciales en lugar del valor "X". Es importante destacar que algunas credenciales, identificadas con un asterisco, pueden ser completadas con cualquier valor personalizado (por ejemplo: JWT_NAME_COOKIE = ilua21da812).:

```env
MONGO_URL = X # URL de mongo, la que ponemos dentro de mongoose.connect(X)

NODEMAILER_USER = X # Tu gmail, que será utilizado para enviar mails en el servicio de mensajería gratuito

NODEMAILER_PASS = X # Tu contraseña de gmail

JWT_NAME_COOKIE = X* # Nombre de la cookie donde se comprueba el logueo de un usuario

JWT_SECRET = X* # Cadena de caracteres que se utiliza como una clave secreta para firmar el token JSON Web Token

URL_FRONTEND = X # URL de tu frontend sin barra lateral final

ACCESS_TOKEN = X* # Cadena de caracteres utilizado como mecanismo de autenticación para asegurar que solamente los usuarios que presenten este token en los encabezados de sus solicitudes puedan acceder al backend. Importante: Su valor tiene que ser el mismo que el de la variable de entorno VITE_ACCESS_TOKEN que ponés en el frontend

ADMIN_EMAIL = X # Email del administrador

ADMIN_PASSWORD = X # Contraseña del administrador

STRIPE_SECRET_KEY = X # Key secreta de stripe
```

## Desarrollo 👷

La carpeta de trabajo es [src](/src) y su archivo principal se ubica en [src/app.ts](/src/app.ts). Realiza las modificaciones que desees y, cuando estés listo, ejecuta el comando

```
npm run tsc-copy
```

Este comando se encarga de crear una carpeta dist lista para su uso: primero compilará todos los archivos TypeScript y los guardará en dist, luego copiará todos los archivos restantes de src a dist, manteniendo así la estructura de organización.

Recomiendo eliminar o vaciar la carpeta dist antes de ejecutar dicho comando.

## Despliegue 📦

Para ejecutar el proyecto compilado, utiliza el comando:

```
npm start
```

Podrás empezar a utilizarlo sin problemas luego de que aparezcan dos mensajes, el primero es "Servidor escuchando en el puerto 8080" (puerto configurado por defecto) y el segundo es "Base de mongo conectada".

*Importante*: Asegúrate de que la [parte frontend](https://github.com/Ale6100/Curso-backend-parte-front.git) esté ejecutándose

## Construido con 🛠️

* CSS
* JavaScript
* [TypeScript](https://www.typescriptlang.org/)
* [NodeJs](https://nodejs.org/)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [connect-mongo](https://www.npmjs.com/package/connect-mongo)
* [express](https://www.npmjs.com/package/express)
* [Bycrypt](https://www.npmjs.com/package/bcrypt)
* [cookie-parser](https://www.npmjs.com/package/cookie-parser)
* [cors](https://www.npmjs.com/package/cors)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [ejs](https://www.npmjs.com/package/ejs)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [minimist](https://www.npmjs.com/package/minimist)
* [multer](https://www.npmjs.com/package/multer)
* [nodemailer](https://www.npmjs.com/package/nodemailer)
* [stripe](https://www.npmjs.com/package/stripe)
* [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)
* [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
* [winston](https://www.npmjs.com/package/winston)
* [copyfiles](https://www.npmjs.com/package/copyfiles)

## Autor ✒️

* **Alejandro Portaluppi** - [LinkedIn](https://www.linkedin.com/in/alejandro-portaluppi/)

## Expresiones de Gratitud 🎁

* [Mauricio Espinosa Flores](https://www.linkedin.com/in/mauricio-espinosa-flores-9b4202b4/) - Profesor Backend
* [Fernando Galdós Silva](https://www.linkedin.com/in/fernandogaldos/) - Tutor Backend
