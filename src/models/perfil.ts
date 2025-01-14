import Conexion from "../db/conexion";

export default class Perfil {
    private conexion: Conexion;

    constructor() {
        this.conexion = new Conexion();
    }

    public async obtenerPerfil(): Promise<{ok: boolean, respuesta: any}>{
        const sql: string = `select * from perfil`;
        try {
            const resp = await this.conexion.consulta(sql);
            return { ok: true, respuesta: resp};
        } catch (error) {
            throw error
        }
    }

    public async registrarPerfil(perfil: string): Promise<{ok: boolean, respuesta: any}>{
        const sql: string = `insert into perfil (perfil) values (?)`;
        try {
            const resp = await this.conexion.consulta(sql, [perfil]);
            return { ok: true, respuesta: resp};
        } catch (error) {
            throw error
        }
    }

    public async editarPerfil(id_perfil: number, perfil: string): Promise<{ok: boolean, respuesta: any}>{
        const sql: string = `update perfil set perfil = ? where id_perfil = ?`;
        try {
            const resp = await this.conexion.consulta(sql, [perfil, id_perfil]);
            return { ok: true, respuesta: resp};
        } catch (error) {
            throw error
        }
    }

    public async eliminarPerfil(id_perfil: number): Promise<{ok: boolean, respuesta: any}>{
        const sql: string = `delete from perfil where id_perfil = ?`;
        try {
            const resp = await this.conexion.consulta(sql, [id_perfil]);
            return { ok: true, respuesta: resp};
        } catch (error) {
            throw error
        }
    }
}