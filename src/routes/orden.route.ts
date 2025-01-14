import { Router } from "express";
import OrdenController from "../controllers/orden.controller";
import TokenMiddleWare from '../middlewares/token.middleware';

const tokenMiddleWare: TokenMiddleWare = new TokenMiddleWare();
const ordenController: OrdenController = new OrdenController();
const routeOrden: Router = Router();

routeOrden.get("/obtener-ordenes", /*tokenMiddleWare.verificarToken,*/ ordenController.obtenerOrden);
routeOrden.post("/registrar-orden", /*tokenMiddleWare.verificarToken,*/ ordenController.registrarOrden);
routeOrden.post("/editar-orden", tokenMiddleWare.verificarToken, ordenController.editarOrden);
routeOrden.get("/eliminar-orden/:id_orden", tokenMiddleWare.verificarToken, ordenController.eliminarOrden);
routeOrden.post("/editar-estado-orden", tokenMiddleWare.verificarToken, ordenController.editarEstadoOrden)

export { routeOrden }