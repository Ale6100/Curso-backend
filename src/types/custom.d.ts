import winston from 'winston';
import { UserLogin } from "./types.js";

declare global {
    interface MyReq {
        infoPeticion: string;
        logger: winston.Logger;
    }

    interface CustomUser {
        user: UserLogin;
    }

    namespace Express {
        interface Request extends MyReq, CustomUser {} // Hago que el request tenga nuevas propiedades personalizadas
    }
}
