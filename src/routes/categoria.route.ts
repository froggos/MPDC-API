import { Router } from "express";
import CategoriaController from "../controllers/categoria.controller";
import TokenMiddleWare from '../middlewares/token.middleware';


const tokenMiddleWare: TokenMiddleWare = new TokenMiddleWare();
const categoriaController: CategoriaController = new CategoriaController();
const routeCate: Router = Router();

routeCate.get('/obtener-categoria', /*tokenMiddleWare.verificarToken,*/ categoriaController.obtenerCategoria)
routeCate.post('/registrar-categoria', tokenMiddleWare.verificarToken, categoriaController.registrarCategoria)
routeCate.post('/editar-categoria', tokenMiddleWare.verificarToken, categoriaController.editarCategoria)
routeCate.get('/eliminar-categoria/:id_categoria', tokenMiddleWare.verificarToken, categoriaController.eliminarCategoria)

export { routeCate }