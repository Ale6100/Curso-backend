import multer from "multer";
import __dirname from "../utils.js";
import { Request } from "express";

const storage = multer.diskStorage({ // Configura un almacenamiento de servidor en disco
    destination: (req: Request, _file, cb) => { // Destino (la ruta ya debe estar creada)
        if (req.originalUrl == "/api/sessions/register") {
            cb(null, __dirname + "/public/images/profiles")
        } else if (req.originalUrl == "/api/products" || req.originalUrl.includes("/api/products/")) {
            cb(null, __dirname + "/public/images/products")
        } else {
            req.logger.fatal(`${req.infoPeticion} | Se guardó una imagen en la carpeta images`)
            cb(null, __dirname + "/public/images")
        }
    },
    filename: (_req, file, cb) => { // Nombre del archivo cargado
        cb(null, (Date.now()+"-"+file.originalname).replaceAll(" ", "_"))
    }
})

// Verificación del tipo de archivo
function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Acepta el archivo si es una imagen, y la rechaza si no lo es
    } else {
        cb(null, false)
    }
  }

const uploader = multer({ storage, fileFilter }); // Lo guardamos para poder utilizarlo luego

export default uploader
