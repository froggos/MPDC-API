import { Request, Response } from "express";
import { RegistroOrden } from "../models/types/orden.type";
import Orden from "../models/orden";

export default class OrdenController{
    private orden: Orden;

    constructor(){
        this.orden = new Orden();
    }

    public obtenerOrden = async(req: Request, res: Response) => {
        try {
            const resp = await this.orden.obtenerOrden();
            res.status(200).json(resp);
        } catch (error) {
            console.log('Error en el ordenController/obtenerOrden', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"});
        }
    }

    public registrarOrden = async(req: Request, res: Response) => {
        try {
            const { 
                descripcion,
                id_servicio,
                id_usuario,
                id_categoria } = req.body;
            console.log('req.body', req.body);
            const payload = [
                descripcion,
                id_servicio,
                id_usuario,
                id_categoria]
            const resp = await this.orden.registrarOrden(payload);
            res.status(200).json(resp);
        } catch (error) {
            console.log('Error en el ordenController/obtenerOrden', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"});
        }
    }

    public editarOrden = async(req: Request, res: Response) => {
        try {
            const { 
                id_orden,
                fecha_ingreso,
                descripcion,
                id_servicio,
                id_usuario,
                id_categoria } = req.body;

            const payload = [
                fecha_ingreso,
                descripcion,
                id_servicio,
                id_usuario,
                id_categoria,
                id_orden
            ]

            const resp = await this.orden.editarOrden(payload);
            res.status(200).json(resp);
        } catch (error) {
            console.log('Error en el ordenController/obtenerOrden', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"});
        }
    }

    public eliminarOrden = async(req: Request, res: Response) => {
        try {
            const id_orden = Number(req.params.id_orden);
            const resp = await this.orden.eliminarOrden(id_orden);
            res.status(200).json(resp);
        } catch (error) {
            console.log('Error en el ordenController/obtenerOrden', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"});
        }
    }

    public editarEstadoOrden = async(req: Request, res: Response) => {
        try {
            const { id_orden, id_estado, observacion } = req.body;
            const resp = await this.orden.editarEstadoOrden(id_orden, id_estado, observacion);
            res.status(200).json(resp);
        } catch (error) {
            console.log('Error en el ordenController/obtenerOrden', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"});
        }
    }


}