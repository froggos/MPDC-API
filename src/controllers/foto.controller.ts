import { Request, Response } from "express";
import { Foto as FotoModel } from "../models/fotos";
import { ObjectId } from "mongodb";
import path from "path";
import fs from 'fs';

const ROOT_DIR = path.join("./src", "private", "fotos");

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
        // const fotoBody = req.body;

        const id_usuario = req.query.id_usuario;
        const titulo     = req.query.titulo;
        const tipoMime   = req.query.tipoMime;
        const nombre     = req.query.nombre;

        if (id_usuario === undefined || id_usuario === null) {
            res.status(400).json({
                mensaje: 'no existe un id de usuario para completar la solicitud.'
            });
            return;
        }
    
        const fechaRegistro: Date = new Date();

        let dataBuffer: Buffer[] = [];
        let limite = '';

        const contentType = req.headers['content-type'];

        if (contentType && contentType.startsWith('multipart/form-data')) {
            limite = `--${contentType.split('=')[1]}`
        } else { 
            res.status(400).json({
                mensaje: 'content-type invalido.',
            });
            return;
        }

        req.on('data', (chunk) => {
            dataBuffer.push(chunk);
        });

        req.on('end', async () => {
            let carpetaEncontrada: boolean = true;

            const crudo      = Buffer.concat(dataBuffer);
            const crudoTexto = crudo.toString();

            const partes = crudoTexto.split(limite).filter((parte) => parte.trim() !== '--');

            console.log('87: partes: ', partes);

            for (let i = 0; i < partes.length; i++) {
                const indexFinHeaders = partes[i].indexOf('\r\n\r\n');
                const headers         = partes[i].slice(0, indexFinHeaders).split('\r\n');

                const bodyInicio      = crudoTexto.indexOf(partes[i]) + indexFinHeaders + 4;
                const bodyFin         = crudoTexto.indexOf(`${limite}`, bodyInicio) - 2;
                const body            = crudo.subarray(bodyInicio, bodyFin);

                const disposition = headers.find((header) => {
                    return header.startsWith('Content-Disposition');
                });

                const type = headers.find((header) => {
                    return header.startsWith('Content-Type');
                });

                if (disposition && type) {
                    const archivo = disposition.match(/filename="(.+?)"/);

                    if (archivo) {
                        let nombreArchivo = archivo[1];
                        
                        const dia  = String(fechaRegistro.getDate()).padStart(2, '0');
                        const mes  = String(fechaRegistro.getMonth() + 1).padStart(2, '0');
                        const anio = fechaRegistro.getFullYear();
                        
                        nombreArchivo = `${dia}-${mes}-${anio}-${nombreArchivo}`;

                        const ruta = path.join(ROOT_DIR, id_usuario!.toString(), nombreArchivo);

                        console.log('123: ruta: ', ruta);

                        // if (!fs.existsSync(ruta)) {
                        //     console.log('no existe la carpeta de la ruta solicitada.');
                        //     carpetaEncontrada = false;
                        //     break;
                        // }

                        try {
                            fs.writeFileSync(ruta, body, 'binary');

                            const resp = await this.foto.crear({
                                idUsuario: new ObjectId(id_usuario.toString()),
                                titulo: titulo!.toString(),
                                nombreArchivo: nombre!.toString(),
                                tipoMime: tipoMime!.toString(),
                                fechaRegistro,
                                memorable: false,
                                urlUbicacion: ruta,
                            });

                            console.log(resp);

                            res.status(200).json({
                                mensaje: 'foto registrada.',
                            });
                        } catch (error) {
                            console.log(error);

                            res.status(500).json({
                                mensaje: 'error interno del servidor.',
                            });
                        }
                    }
                }
            }

            if(!carpetaEncontrada) {
                res.status(500).json({
                    mensaje: 'error interno del servidor.',
                });
                return;
            }
        });
    }
}