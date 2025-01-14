import {Request, Response} from 'express';
import Usuario from '../models/usuario';
import { Login } from '../types/login.type';
import bcrypt from 'bcrypt';

export default class UsuarioController {
    private usuario: Usuario;

    constructor() {
        this.usuario = new Usuario();
    }

    public login = async (req: Request, res: Response) => {
        const body = req.body as Login;
        
        try {
            const data = await this.usuario.autenticar({
                usuario: body.usuario,
                clave: body.clave,
            });

            if (data.length === 0) {
                res.status(404).json({
                    mensaje: 'Usuario no encontrado.'
                }); 
                return;
            }

            if (!bcrypt.compareSync(body.clave, data[0].pass_hash)) {
                res.status(404).json({
                    mensaje: 'Usuario o contraseña incorrecta.'
                });
                return;
            }

            const token: string = Usuario._generarToken({
                nombre  : data[0].perfil.nombre,
                apellido: data[0].perfil.apellido,
                correo  : data[0].correo,
            });

            res.status(200).json({
                id      : data[0]._id,
                nombre  : data[0].perfil.nombre,
                apellido: data[0].perfil.apellido,
                correo  : data[0].perfil.correo,
                estado  : data[0].estado,
                token   : token
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                mensaje: 'Error interno del servidor.',
            });
        }
    }

    public registrar = async (req: Request, res: Response) => {
        const body = req.body as {
            run             : string;
            nombres         : string;
            apellido_paterno: string;
            apellido_materno: string;
            correo          : string;
            clave           : string;
            id_servicio     : number;
            id_perfil       : number;
        };

        try {
            const resp = await this.usuario.registrar([
                body.run,
                body.nombres,
                body.apellido_paterno,
                body.apellido_materno,
                body.correo,
                body.clave,
                body.id_servicio,
                body.id_perfil
            ]);

            res.status(200).json({
                ok: true,
                mensaje: 'Usuario registrado.',
                id: resp.insertId,
            });
        } catch (error: any) {
            console.error(error);
            if(error.code === 'ER_DUP_ENTRY'){
                res.status(409).json(`Ya se encuentra registrado un usuario con el mismo run`)
            }

            res.status(500).json({
                mensaje: 'Error interno del servidor.',
            });
        }
    }

    public listar = async (req: Request, res: Response) => {
        const body = req.body as {
            limit : number;
            offset: number;
            param : string;
        };

        try {
            const data = await this.usuario.listar(body.limit, body.offset, body.param);

            res.status(200).json({
                data
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                mensaje: 'Error interno del servidor.'
            })
        }
    }

    public actualizar = async (req: Request, res: Response) => {
        const id = req.params.id;

        const body = req.body as {
            run: string;
            nombres: string;
            apellido_paterno: string;
            apellido_materno: string;
            correo: string;
            id_servicio: number;
            id_perfil: number;
            id_estado: number;
        };

        console.log('En el actualizar controlador', body);
        try {
            const data = await this.usuario.actualizar(
                [
                    body.run, 
                    body.nombres, 
                    body.apellido_paterno, 
                    body.apellido_materno, 
                    body.correo, 
                    body.id_servicio, 
                    body.id_perfil, 
                    body.id_estado,
                    Number(id), 
                ]
            );

            if (data.affectedRows <= 0) {
                res.status(404).json({
                    mensaje: 'No se encontró ningún registro.',
                });
                return;
            }

            res.status(200).json({
                ok:true,
                mensaje: 'Usuario actualizado.',
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                mensaje: 'Error interno del servidor.',
            });
        }
    }

    public eliminar = async (req: Request, res: Response) => {
        const id = req.params.id;

        try {
            const data = await this.usuario.eliminar(Number(id));

            if (data.affectedRows <= 0) {
                res.status(404).json({
                    mensaje: 'No se encontró ningún registro.',
                });
            }

            res.status(200).json({
                mensaje: 'Usuario eliminado.',
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                mensaje: 'Error interno del servidor.',
            });
        }
    }

    public solicitarEstado = async(req: Request, res: Response) => {
        try {
            const data = await this.usuario.solicitarEstadoUsuario();
            res.status(200).json({ok: true, respuesta: data})
        } catch (error) {
            res.status(500).json({ ok: false, respuesta: "Error interno del servidor" })
        }
    }
    
    public validarAutenticacion = async (req: Request, res: Response) => {
        const token: string | undefined = req.header('token');

        if (token === undefined || token.trim() === '') {
            res.status(401).json({
                mensaje: 'Token inválido.',
                auth: false,
            });
            return;
        }

        const valido = this.usuario.verificarToken(token);

        if (!valido) {
            res.status(401).json({
                mensaje: 'Token inválido.',
                auth: false,
            });
            return;
        }

        res.status(200).json({
            mensaje: 'Token válido.',
            auth: true,
        });
    }
}