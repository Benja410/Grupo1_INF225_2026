import { Router } from 'express';
import { actualizarPerfil, obtenerPerfil } from '../controllers/perfil.controller.js';

const router = Router();

router.get('/perfil', obtenerPerfil);
router.put('/perfil', actualizarPerfil);

export default router;
