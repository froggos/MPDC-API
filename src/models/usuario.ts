import { Collection, Db, WithId } from "mongodb";
import Conexion from "../db/conexion";
import { Login } from "../types/login.type";
import jwt from 'jsonwebtoken';

export default class Usuario {
    
    constructor() { }
    
    public autenticar = async (login: Login): Promise<any> => {
        try {
            const conexion = await Conexion.getInstancia();
            
            const db: Db = await conexion.conectar();

            const usuario: WithId<any> = await db.collection('usuario').find({
                usuario: `${login.usuario}`
            }).toArray();

            return usuario;
        } catch (error) {
            console.log(error);

            throw error;
        }
    }

    public registrar = async (datos: [string, string, string, string, string, string, number, number]): Promise<any> => { }

    public listar = async (limit: number, offset: number, param: string): Promise<any> => { }

    public actualizar = async (datos: [string, string, string, string, string, number, number, number, number]): Promise<any> => { }

    public eliminar = async (id: number): Promise<any> => { }

    public solicitarEstadoUsuario = async() => { }

    public static _generarToken = (payload: {}): string => {
        const jwtKey = process.env.JWT!;
        
        return jwt.sign(payload, jwtKey, {
            algorithm: 'HS256',
            expiresIn: '2h',
        });
    }

    public verificarToken = (token: string): boolean => {
        try {
            jwt.verify(token, process.env.JWT!);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}