import { Request, Response } from "express";
import { Foto as FotoModel } from "../models/fotos";
import { ObjectId } from "mongodb";

export default class FotoController {
    private foto: FotoModel;

    constructor() { 
        this.foto = new FotoModel;
    }

    public manejaListar = async (req: Request, res: Response) => {
        const id: string = req.params.id;

        const body = req.body as {
            offset    : number,
            limit     : number,
        };

        if (body.offset == undefined || body.limit == undefined) {
            res.status(401).json({
                mensaje: 'cuerpo incompleto.'
            });
            return;
        }

        const objectIdUsuario = new ObjectId(id);

        try {
            const fotos = await this.foto.listar(objectIdUsuario, [body.offset, body.limit]);
            
            res.status(200).json({
                fotos,
            });
        } catch (error) {
            console.log(error);

            res.status(500).json({
                mensaje: 'error interno del servidor.',
            })
        }
    }

    public manejarRegistrar = async (req: Request, res: Response) => {
        const fotoBody = req.body as {
            id_usuario    : string;
            titulo        : string;
            nombre_archivo: string;
            tipo_mime     : string;
            memorable     : boolean;
        };

        try {
            const res = await this.foto.crear({
                idUsuario: new ObjectId(fotoBody.id_usuario),
                titulo: fotoBody.titulo,
                nombreArchivo: fotoBody.nombre_archivo,
                tipoMime: fotoBody.tipo_mime,
                fechaRegistro: new Date(),
                memorable: fotoBody.memorable,
            });

            console.log(res);
        } catch (error) {
            console.log(error);

            res.status(500).json({
                mensaje: 'error interno del servidor.',
            });
        }
    }
}