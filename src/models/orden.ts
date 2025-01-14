import Conexion from "../db/conexion";

export default class Orden {
    private conexion: Conexion;
    constructor(){
        this.conexion = new Conexion();
    }

    public obtenerOrden = async(): Promise<{ok: boolean, respuesta:any}> => {
        const sql: string = `select o.id_orden, o.fecha_registro, o.fecha_fin, c.categoria, o.descripcion, o.observacion, s.servicio, 
        concat_ws(' ', u.nombres, u.apellido_paterno, u.apellido_materno) as nombre_usuario, e.id_estado, e.estado  
        from orden o
        inner join servicio s on o.id_servicio = s.id_servicio 
        inner join usuario u on o.id_usuario = u.id_usuario 
        inner join categoria c on o.id_categoria = c.id_categoria 
        inner join estado e on o.id_estado = e.id_estado;`;
        
        try {
            const resp = await this.conexion.consulta(sql);
            return { ok: true, respuesta: resp};
        } catch (error) {
            throw error
        }
    }

    public registrarOrden = async(payload: any): Promise<{ok: boolean, respuesta:any}> => {
        const sql: string = `insert into orden (fecha_fin, descripcion, observacion, id_servicio, id_usuario ,id_estado, id_categoria)
        VALUES (null,?,null,?,?,1,?)`;
        try {
            const resp = await this.conexion.consulta(sql, payload);
            return { ok: true, respuesta: resp};
        } catch (error) {
            throw error
        }
    }
    
    public editarOrden = async(payload: any, ): Promise<{ok: boolean, respuesta:any}> => {
        const sql: string = 'update orden set fecha_ingreso = ?, descripcion = ?, id_servicio = ?, id_usuario = ?, id_categoria = ? where id_orden = ?';
        try {

            const resp = await this.conexion.consulta(sql, payload);
            return { ok: true, respuesta: resp};
        } catch (error) {
            throw error
        }
    }

    public eliminarOrden = async(id_orden: number): Promise<{ok: boolean, respuesta:any}> => {
        const sql: string = 'delete from orden where id_orden = ?';
        try {
            const resp = await this.conexion.consulta(sql, [id_orden]);
            return { ok: true, respuesta: resp};
        } catch (error) {
            throw error
        }
    }

    public editarEstadoOrden = async (id_orden: number, id_estado: number, observacion: string): Promise<{ok: boolean, respuesta: any}> => {
        const sql: string = `update orden set fecha_fin = NOW(), observacion = ?, id_estado = ? where id_orden = ?`;
        try {
            const resp = await this.conexion.consulta(sql, [observacion ,id_estado, id_orden]);
            return {ok: true, respuesta: resp};
        } catch (error) {
            throw error
        }
    }


}