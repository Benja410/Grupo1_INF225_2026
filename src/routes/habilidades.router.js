import { Router } from 'express';
import { obtenerHabilidades } from '../controllers/habilidades.controller.js';

const router = Router();

router.get('/habilidades', obtenerHabilidades);

export default router;
