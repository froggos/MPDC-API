import { Router } from "express";
import FotoController from "../controllers/foto.controller";

const fotoCtrl: FotoController = new FotoController;
const routeFoto: Router = Router();

routeFoto.post('/:id', fotoCtrl.manejaListar);
routeFoto.post('/registrar', fotoCtrl.manejarRegistrar);

export { routeFoto };