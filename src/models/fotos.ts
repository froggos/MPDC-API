import { Db, ObjectId } from "mongodb";
import Conexion from "../db/conexion";
import { Foto as FotoT } from "./types/foto.type";

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

            if (!res.insertedId) {
                console.log('no se inserto nada.');
                throw new Error('no se inserto nada');
            }

            

            return res.insertedId;
        } catch (error) {
            throw error;
        }
    }
    
    private static obtenerPesoArchivo = () => {
        
    }
}