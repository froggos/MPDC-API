import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import env from 'dotenv'
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import { createServer, Server as HttpServer } from 'http';
import { routePer } from '../routes/perfil.route';
import { routeCate } from '../routes/categoria.route';
import { routeUsu } from '../routes/usuario.route';
import Conexion from '../db/conexion';
import { routeOrden } from '../routes/orden.route';


env.config({
    path: ".env"
});

export default class Server {
    private app: Application;
    private server: HttpServer;
    private con: Conexion;
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
            usuario  : '/usuario',
            servicios: '/servicios',
            perfil   : '/perfil',
            categoria: '/categoria',
            orden    : '/orden',

        }
        this.routes();

        this.con = new Conexion();
        this.con.conectar();
    }

    private routes(): void {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const hora = new Date();
            const formateado = `${hora.getFullYear()}-${hora.getMonth() + 1}-${hora.getDay() + 1} ${hora.getHours()}:${hora.getMinutes()}:${hora.getMilliseconds()}`
            console.log(`[${formateado}] HTTP | ${req.method.toUpperCase()} | ${req.url}`);
            next();
        });
        this.app.use(this.rutas.usuario, routeUsu );
        this.app.use(this.rutas.perfil, routePer);
        this.app.use(this.rutas.categoria, routeCate);
        this.app.use(this.rutas.orden, routeOrden)
    }

    private middlewares(): void {
        this.app.use("/gestion-swagger", swaggerUi.serve, swaggerUi.setup(this.swaggerSpec));
        this.app.use(express.json());
        this.app.use(cors());
    }

    public escuchar(): void {
        this.server.listen(process.env.PORT!, () => {
            console.log(`Servidor inicializado en: ${process.env.PORT}`);
        });
    }
}