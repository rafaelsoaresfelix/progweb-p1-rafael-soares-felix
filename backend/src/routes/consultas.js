import { Router } from 'express';
import { consultaController } from '../controllers/consultaController.js';

const router = Router();

router.get('/', consultaController.listar);
router.get('/:id', consultaController.buscarPorId);
router.post('/', consultaController.criar);
router.put('/:id', consultaController.atualizar);
router.delete('/:id', consultaController.remover);

export default router;
