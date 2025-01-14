import { Db } from "mongodb";
import Conexion from "../db/conexion";
import { Login } from "../types/login.type";
import jwt from 'jsonwebtoken';

export default class Usuario {
    private conexion: Conexion;
    // private db: Db;

    constructor() {
        this.conexion = Conexion.getInstancia();
    }

    public autenticar = async (login: Login): Promise<any> => { 
        try {
            await this.conexion.conectar();

            const db: Db = this.conexion.obtenerDb;

            console.log(db);
        } catch (error) {
            console.log(error);

            throw error;
        } finally {
            await this.conexion.cerrarConexion();
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