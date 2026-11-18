import { api } from '../api.js';

const STATUS_VALIDOS = ['agendada', 'confirmada', 'cancelada', 'realizada'];

function preparar({ pacienteId, especialidade, dataHora, status }) {
  if (!pacienteId) throw new Error('Selecione o paciente.');
  const esp = (especialidade ?? '').trim();
  if (!esp) throw new Error('Informe a especialidade médica.');
  const dh = (dataHora ?? '').trim();
  if (!dh) throw new Error('Informe a data e hora da consulta.');
  const st = (status ?? 'agendada').trim();
  if (!STATUS_VALIDOS.includes(st)) {
    throw new Error('Status da consulta inválido.');
  }

  return {
    pacienteId: Number(pacienteId),
    especialidade: esp,
    dataHora: dh,
    status: st,
  };
}

export const consultaService = {
  listar() {
    return api.get('/consultas');
  },

  async criar(dados) {
    return api.post('/consultas', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/consultas/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/consultas/${id}`);
  },
};
