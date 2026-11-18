import { consultaService } from '../services/consultaService.js';

export const consultaController = {
  listar(req, res) {
    res.json(consultaService.listar(req.query.pacienteId));
  },

  buscarPorId(req, res) {
    res.json(consultaService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const nova = consultaService.criar(req.body);
    res.status(201).json(nova);
  },

  atualizar(req, res) {
    res.json(consultaService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    consultaService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
