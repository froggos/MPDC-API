import { Db, ObjectId } from "mongodb";
import Conexion from "../db/conexion";
import { Foto as FotoT } from "./types/foto.type";
import path from "path";

const ROOT_DIR = path.join(__dirname, "fotos")

export class Foto {
    constructor() { }

    public listar = async (userId: ObjectId, paginacion: [offset: number, limit: number]): Promise<FotoT[] | Error> => {
        try {
            const db: Db = await (Conexion.getInstancia()).conectar();
            
            const fotos: FotoT[] = await db.collection<FotoT>('foto')
            .find({
                idUsuario: userId,
            })
            .skip(Number(paginacion[0]))
            .limit(Number(paginacion[1]))
            .toArray();

            return fotos;
        } catch (error) {
            throw error;
        }
    }

    public crear = async (foto: FotoT) => {
        try {
            const db: Db = await (Conexion.getInstancia()).conectar();

            const res = await db.collection<FotoT>('foto').insertOne(foto);

            return res.insertedId;
        } catch (error) {
            throw error;
        }
    }
    
    private static obtenerPesoArchivo = () => {

    }
}