import { MongoClient, Db } from "mongodb";

export default class Conexion {
    private static instancia: Conexion;
    private static cliente  : MongoClient | null = null;
    private static db       : Db | null          = null;

    private readonly host  : string = process.env.DB_HOST!;
    private readonly port  : string = process.env.DB_PORT!;  
    private readonly dbName: string = process.env.DB_NAME!;
    private readonly uri   : string =  `mongodb://${this.host}:${this.port}`;

    constructor() { }

    public static getInstancia = async (): Promise<Conexion> => {
        if (!Conexion.instancia) {
            Conexion.instancia = new Conexion;
            await Conexion.instancia.conectar();
        }

        return Conexion.instancia;
    }

    public conectar = async (): Promise<Db> => {
        if (!Conexion.cliente) {
            try {
                Conexion.cliente = new MongoClient(this.uri, { maxPoolSize: 10, });

                await Conexion.cliente.connect();

                console.log('conexion a la db exitosa.');

                Conexion.db = Conexion.cliente.db(this.dbName);
            } catch (error) {
                console.log('error de conexion a la db: ', error);
                throw error;
            }
        }

        return Conexion.db!;
    }

    public cerrarConexion = async (): Promise<void> => {
        if (Conexion.cliente) {
            await Conexion.cliente.close();
            
            console.log('conexion a db cerrada.');

            Conexion.cliente = null;
            Conexion.db      = null;
        }
    }

    public obtenerDb = (): Db => {
        if (!Conexion.db) {
            throw new Error('no existe ninguna conexion.');
        }

        return Conexion.db;
    }

    // get obtenerDb(): Db {
    //     if (Conexion.db) {
    //         throw new Error('no existe ninguna conexion.');
    //     }

    //     return Conexion.db!;
    // }

    public consulta = async (consulta: string, datos?: any[]): Promise<any> => { }
}