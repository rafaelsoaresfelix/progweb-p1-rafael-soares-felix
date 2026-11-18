import { Router } from 'express';
import { pacienteController } from '../controllers/pacienteController.js';

const router = Router();

router.get('/', pacienteController.listar);
router.get('/:id', pacienteController.buscarPorId);
router.post('/', pacienteController.criar);
router.put('/:id', pacienteController.atualizar);
router.delete('/:id', pacienteController.remover);

export default router;
