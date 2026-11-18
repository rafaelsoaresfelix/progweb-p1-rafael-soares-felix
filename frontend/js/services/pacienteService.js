import { api } from '../api.js';

function preparar({ nome, email, telefone }) {
  const dados = {
    nome: (nome ?? '').trim(),
    email: (email ?? '').trim(),
    telefone: (telefone ?? '').trim() || null,
  };
  if (!dados.nome) throw new Error('Informe o nome do paciente.');
  if (!dados.email) throw new Error('Informe o e-mail do paciente.');
  if (!dados.email.includes('@') || !dados.email.includes('.')) {
    throw new Error('Informe um e-mail válido (ex.: usuario@email.com).');
  }
  return dados;
}

export const pacienteService = {
  listar() {
    return api.get('/pacientes');
  },

  async criar(dados) {
    return api.post('/pacientes', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/pacientes/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/pacientes/${id}`);
  },
};
