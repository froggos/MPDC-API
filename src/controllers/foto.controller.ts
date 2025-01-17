import { Request, Response } from "express";
import { Foto as FotoModel } from "../models/fotos";
import { ObjectId } from "mongodb";
import path from "path";
import fs from 'fs';

const ROOT_DIR = path.join("private", "fotos");

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
        const fotoBody = req.body;

        let realBody: {
            clave: string;
            valor: any;
        }[] = [];
    
        const fechaRegistro: Date = new Date();

        let dataBuffer: Buffer[] = [];
        let limite = '';

        const contentType = req.headers['content-type'];

        console.log('62: contentType: ', contentType);

        if (contentType && contentType.startsWith('multipart/form-data')) {
            limite = `--${contentType.split('=')[1]}`
        } else { 
            res.status(400).json({
                mensaje: 'content-type invalido.',
            });
            return;
        }

        console.log('65: limite: ', limite);

        req.on('data', (chunk) => {
            dataBuffer.push(chunk);
        });

        // console.log('77: dataBuffer: ', dataBuffer);

        req.on('end', () => {
            const crudo = Buffer.concat(dataBuffer).toString();
            const partes = crudo.split(limite).filter((parte) => parte.trim() !== '--');

            // console.log('93: crudo: ', crudo);
            console.log('94: partes: ', partes);

            console.log('partes[1]: ', partes[1].split(' '));

            for (let i = 0; i < partes.length; i++) {
                const indexFinHeaders = partes[i].indexOf('\r\n\r\n');
                const headers         = partes[i].slice(0, indexFinHeaders).split('\r\n');
                const body            = partes[i].slice(indexFinHeaders + 4, -2);

                console.log('91: headers: ', headers);

                const disposition = headers.find((header) => {
                    return header.startsWith('Content-Disposition');
                });

                console.log('96: disposition: ', disposition);

                const type = headers.find((header) => {
                    return header.startsWith('Content-Type');
                });

                console.log('102: type: ', type);

                if (disposition && type) {
                    const archivo = disposition.match(/filename="(.+?)"/);

                    console.log('109: archivo: ', archivo);

                    if (archivo) {
                        let nombreArchivo = archivo[1];
                        
                        const dia  = String(fechaRegistro.getDate()).padStart(2, '0');
                        const mes  = String(fechaRegistro.getMonth() + 1).padStart(2, '0');
                        const anio = fechaRegistro.getFullYear();
                        
                        nombreArchivo = `${dia}-${mes}-${anio}-${nombreArchivo}`;

                        const ruta = path.join(ROOT_DIR, fotoBody.id_usuario);

                        console.log('123: ruta: ', ruta)

                        fs.writeFileSync(ruta, body, 'binary');
                    }
                }

                const dispositionMetaData = headers.find((header) => {
                    return header.startsWith('Content-Disposition');
                });

                if (dispositionMetaData && !partes[i].includes('Content-Type: image/')) {
                    const claveEncontrada = dispositionMetaData.match(/name="(.+?)"/);

                    if (claveEncontrada) {
                        const clave = claveEncontrada[1];
                        const valor = body.toString().trim();
                        
                        const bodyObj = {
                            clave,
                            valor,
                        } as {
                            clave: string;
                            valor: any;
                        };

                        realBody.push(bodyObj);
                    }
                }
            }
            console.log("Real body: ", realBody);
        });

        try {
            const res = await this.foto.crear({
                idUsuario: new ObjectId(fotoBody.id_usuario),
                titulo: fotoBody.titulo,
                tipoMime: fotoBody.tipo_mime,
                fechaRegistro,
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