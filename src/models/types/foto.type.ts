import { ObjectId } from "mongodb";

export interface Foto {
    _id?          : ObjectId;
    idUsuario?    : ObjectId;
    titulo        : string;
    nombreArchivo : string;
    tipoMime      : string;
    fechaRegistro?: Date;
    urlUbicacion? : string;
    peso?         : number;
    memorable?    : boolean;
}