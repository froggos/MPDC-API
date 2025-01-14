import { Request, Response } from "express";
import Categoria from "../models/categoria";


export default class CategoriaController {
    private categoria: Categoria;
    constructor(){
        this.categoria = new Categoria;
        // console.log('this.categoria', this.categoria.obtenerCategoria());
    }


    public obtenerCategoria = async (req: Request, res: Response) => {
        try {
            const resp = await this.categoria.obtenerCategoria();
            res.status(200).json(resp)
        } catch (error) {
            console.log('Error en el categoriaController/obtenerCategoria', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"})
        }
    };

    public registrarCategoria = async (req: Request, res: Response) => {
        try {
            const {categoria} = req.body;
            const resp = await this.categoria.registrarCategoria(categoria);
            res.status(200).json(resp);
        } catch (error) {
            console.log('Error en el categoriaController/registrarCategoria', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"});
            
        }
    }

    public editarCategoria = async (req: Request, res: Response) => {
        try {
            const { id_categoria, categoria} = req.body
            const resp = await this.categoria.editarCategoria(id_categoria, categoria);
            res.status(200).json(resp);
        } catch (error) {
            console.log('Error en el categoriaController/editarCategoria', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"});
            
        }
    }

    public eliminarCategoria = async (req: Request, res: Response) => {
        try {
            const id_categoria = Number(req.params.id_categoria)
            const resp = await this.categoria.eliminarCategoria(id_categoria);
            res.status(200).json(resp);
        } catch (error) {
            console.log('Error en el categoriaController/eliminarCategoria', error);
            res.status(500).json({ok: false, respuesta: "Error interno en el servidor"});
            
        }
    }


    

    
}