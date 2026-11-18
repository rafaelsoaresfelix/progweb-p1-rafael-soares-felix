import { pacienteService } from '../services/pacienteService.js';

export const pacienteController = {
  listar(req, res) {
    res.json(pacienteService.listar());
  },

  buscarPorId(req, res) {
    res.json(pacienteService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = pacienteService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(pacienteService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    pacienteService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
