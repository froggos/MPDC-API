import Conexion from "../db/conexion";

export default class Perfil {
    private conexion: Conexion;

    constructor() {
        this.conexion = new Conexion();
    }

    public obtener = async (): Promise<any> => { }

    public registrar = async (perfil: {}): Promise<any> => { }

    public editar = async (id: number, perfil: {}): Promise<any> => { }

    public eliminar = async (id: number): Promise<any> => { }
}