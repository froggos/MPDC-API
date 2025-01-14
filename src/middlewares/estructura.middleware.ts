import { NextFunction, Request, Response } from "express";

export default class EstructuraMiddleware {
    constructor() {}

    public static validar = (estructura: {}) => {
        return (request: Request, response: Response, next: NextFunction) => {
            const body = request.body;

            const valido = this.cuerpoValido(body, estructura);

            if (!valido) {
                response.status(400).json({
                    mensaje: 'Estructura de cuerpo incorrecta.',
                });
                return;
            }

            next();
        }
    }

    private static cuerpoValido = (cuerpo: any, estructura: {}): boolean => {
        const requerido = Object.keys(estructura);
        return requerido.every((key) => key in cuerpo);
    }
}