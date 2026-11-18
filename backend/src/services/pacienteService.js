import { pacienteModel } from '../models/pacienteModel.js';
import { erro } from '../utils/erro.js';

function validarEmail(email) {
  return typeof email === 'string' && email.includes('@') && email.includes('.');
}

export const pacienteService = {
  listar() {
    return pacienteModel.listar();
  },

  buscarPorId(id) {
    const paciente = pacienteModel.buscarPorId(id);
    if (!paciente) throw erro(404, 'Paciente não encontrado');
    return paciente;
  },

  criar({ nome, email, telefone } = {}) {
    if (!nome || !email) {
      throw erro(400, 'Campos "nome" e "email" são obrigatórios');
    }
    if (!validarEmail(email)) {
      throw erro(400, 'Formato de e-mail inválido');
    }
    if (pacienteModel.existeEmail(email)) {
      throw erro(409, 'Já existe um paciente cadastrado com este e-mail');
    }
    return pacienteModel.inserir({ nome, email, telefone });
  },

  atualizar(id, dados = {}) {
    const pacienteExistente = pacienteModel.buscarPorId(id);
    if (!pacienteExistente) throw erro(404, 'Paciente não encontrado');

    if (dados.email) {
      if (!validarEmail(dados.email)) {
        throw erro(400, 'Formato de e-mail inválido');
      }
      if (
        dados.email.toLowerCase() !== pacienteExistente.email.toLowerCase() &&
        pacienteModel.existeEmail(dados.email)
      ) {
        throw erro(409, 'Já existe um paciente cadastrado com este e-mail');
      }
    }

    return pacienteModel.atualizar(id, dados);
  },

  remover(id) {
    const removido = pacienteModel.remover(id);
    if (!removido) throw erro(404, 'Paciente não encontrado');
  },
};
