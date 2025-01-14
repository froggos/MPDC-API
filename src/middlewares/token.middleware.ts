import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from 'jsonwebtoken';

export default class TokenMiddleWare {
    constructor() {}

    public verificarToken: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
        const token: string | undefined = request.header('token');

        if (token === undefined || token.trim() === '') {
            response.status(401).json({
                mensaje: 'Error de token',
            });
            return;
        }

        try {
            jwt.verify(token, process.env.JWT!);
            next();
        } catch (error) {
            console.error(error);
            
            response.status(401).json({
                mensaje: 'Error de token'
            });
        }
    }
}