import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import env from 'dotenv'
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import { createServer, Server as HttpServer } from 'http';
import { routeUsu } from '../routes/usuario.route';
import { routeFoto } from '../routes/foto.route';

env.config({
    path: ".env"
});

export default class Server {
    private app: Application;
    private server: HttpServer;
    private rutas: any;

    private swaggerOptions: {} = {
        definition: {
            openApi: "3.0.0",
            info: {
                title: "MPDC",
                version: "1.0.0",
                description: "API de sistema de almacenamiento de fotografias MPDC"
            },
            servers: []
        },
        apis: [".routes/*.js"]
    }

    private swaggerSpec: any;

    constructor() {
        this.swaggerOptions = swaggerJsDoc(this.swaggerOptions);
        this.app            = express();
        this.server         = createServer(this.app);
        this.middlewares();
        this.rutas = {
            usuario: '/usuario',
            fotos  : '/foto',
        }
        this.routes();
    }

    private routes(): void {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const hora = new Date();
            const formateado = `${hora.getFullYear()}-${hora.getMonth() + 1}-${hora.getDay() + 1} ${hora.getHours()}:${hora.getMinutes()}:${hora.getMilliseconds()}`
            console.log(`[${formateado}] HTTP | ${req.method.toUpperCase()} | ${req.url}`);
            next();
        });
        this.app.use(this.rutas.usuario, routeUsu);
        this.app.use(this.rutas.fotos, routeFoto);
    }

    private middlewares(): void {
        this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(this.swaggerSpec));
        this.app.use(express.json());
        this.app.use(cors());
    }

    public escuchar(): void {
        this.server.listen(process.env.PORT!, () => {
            console.log(`Servidor inicializado en: ${process.env.PORT}`);
        });
    }
}