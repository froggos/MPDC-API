import Conexion from "../db/conexion";


export default class Categoria {
    private conexion: Conexion;
    constructor(){
        this.conexion = new Conexion();
    }

    public obtenerCategoria = async (): Promise<{ok: boolean, respuesta: any}> => {
        console.log('en el obtenercategoria model');
        const sql: string = 'select * from categoria';
        try {
            const resp = await this.conexion.consulta(sql);
            return {ok: true, respuesta: resp};
        } catch (error) {
            throw error
        }
    }

    public registrarCategoria = async(categoria: string): Promise<{ok: boolean, respuesta: any}> => {
        const sql: string = `insert into categoria (categoria) Values (?)`;
        try {
            const resp = await this.conexion.consulta(sql, [categoria]);
            return {ok: true, respuesta: resp};
        } catch (error) {
            throw error

        }
    }

    public editarCategoria = async(id_categoria: number, categoria: string): Promise<{ok: boolean, respuesta: any}> => {
        const sql: string = `update categoria set categoria = ? where id_categoria = ?`;
        try {
            const resp = await this.conexion.consulta(sql, [categoria, id_categoria]);
            return {ok: true, respuesta: resp};
        } catch (error) {
            throw error

        }
    }

    public eliminarCategoria = async(id_categoria: number): Promise<{ok: boolean, respuesta: any}> => {
        const sql: string = `delete from categoria where id_categoria = ?`;
        try {
            const resp = await this.conexion.consulta(sql, [id_categoria]);
            return {ok: true, respuesta: resp};
        } catch (error) {
            throw error

        }
    }


}



























