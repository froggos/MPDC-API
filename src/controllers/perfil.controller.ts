import { Request, Response } from "express";
import Perfil from "../models/perfil";

export default class PerfilController {
    private perfil: Perfil;
    
    constructor() {
        this.perfil = new Perfil();
    }

    public obtenerPerfiles = async(req: Request, res: Response) => {
        try {
            const resp = await this.perfil.obtenerPerfil();
            res.status(200).json(resp);
        } catch (error) {
            console.log('Error en el perfilController/obtenerPerfiles', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"});
        }
    }

    public registrarPerfiles = async(req: Request, res: Response) => {
        try {
            const { perfil } = req.body;
            const resp = await this.perfil.registrarPerfil(perfil);
            res.status(200).json(resp);
        } catch (error) {
            console.log('Error en el perfilController/registrarPerfiles', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"});
        }
    }

    public editarPerfiles = async(req: Request, res: Response) => {
        try {
            const { id_perfil, perfil } = req.body;
            const resp = await this.perfil.editarPerfil(id_perfil, perfil);
            res.status(200).json(resp);
        } catch (error) {
            console.log('Error en el perfilController/obtenerPerfiles', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"});
        }
    }

    public eliminarPerfiles = async(req: Request, res: Response) => {
        try {
            const id_perfil = Number(req.params.id_perfil);
            const resp = await this.perfil.eliminarPerfil(id_perfil);
            res.status(200).json(resp);
        } catch (error) {
            console.log('Error en el perfilController/obtenerPerfiles', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"});
        }
    }


}