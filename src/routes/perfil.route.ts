
import { Router } from "express";
import PerfilController from "../controllers/perfil.controller";
import TokenMiddleWare from '../middlewares/token.middleware';

const tokenMiddleWare: TokenMiddleWare = new TokenMiddleWare();
const perfilController: PerfilController = new PerfilController();
const routePer: Router = Router();

routePer.get('/obtener-perfil', /*tokenMiddleWare.verificarToken ,*/perfilController.obtenerPerfiles);
routePer.post('/registrar-perfil', tokenMiddleWare.verificarToken ,perfilController.registrarPerfiles);
routePer.post('/editar-perfil', tokenMiddleWare.verificarToken ,perfilController.editarPerfiles);
routePer.get('/eliminar-perfil/:id_perfil', tokenMiddleWare.verificarToken ,perfilController.eliminarPerfiles);

export { routePer }