import { Request, Response } from "express";
import Perfil from "../models/perfil";

export default class PerfilController {
    private perfil: Perfil;
    
    constructor() {
        this.perfil = new Perfil();
    }

    public obtener = async (req: Request, res: Response) => { }

    public registrar = async(req: Request, res: Response) => { }

    public editar = async(req: Request, res: Response) => { }

    public eliminar = async(req: Request, res: Response) => { }
}