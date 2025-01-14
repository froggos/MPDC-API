import { Router } from 'express';
import TokenMiddleWare from '../middlewares/token.middleware';
import UsuarioController from '../controllers/usuario.controller';
import EstructuraMiddleware from '../middlewares/estructura.middleware';
import { usuarioRegistrar, usuarioActualizar } from '../structures/validacion.structure';

const tokenMdlwr: TokenMiddleWare = new TokenMiddleWare();

const usuarioCtrl: UsuarioController = new UsuarioController();
const routeUsu: Router = Router();

routeUsu.post('/autenticar', usuarioCtrl.login);
routeUsu.post('/registrar', [/*tokenMdlwr.verificarToken,*/ EstructuraMiddleware.validar(usuarioRegistrar)], usuarioCtrl.registrar);
routeUsu.post('/listar', /*tokenMdlwr.verificarToken,*/ usuarioCtrl.listar);
routeUsu.patch('/actualizar/:id', [/*tokenMdlwr.verificarToken,*/ EstructuraMiddleware.validar(usuarioActualizar)], usuarioCtrl.actualizar);
routeUsu.delete('/eliminar/:id', tokenMdlwr.verificarToken, usuarioCtrl.eliminar);
routeUsu.get('/solicitar-estado', /*tokenMdlwr.verificarToken,*/ usuarioCtrl.solicitarEstado)
routeUsu.get('/verificar-token', usuarioCtrl.validarAutenticacion);

export { routeUsu };