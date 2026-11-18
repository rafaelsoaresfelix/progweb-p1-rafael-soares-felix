import { consultaModel } from '../models/consultaModel.js';
import { pacienteModel } from '../models/pacienteModel.js';
import { erro } from '../utils/erro.js';

const STATUS_VALIDOS = ['agendada', 'confirmada', 'cancelada', 'realizada'];

export const consultaService = {
  listar(pacienteId) {
    if (pacienteId) return consultaModel.listarPorPaciente(Number(pacienteId));
    return consultaModel.listar();
  },

  buscarPorId(id) {
    const consulta = consultaModel.buscarPorId(id);
    if (!consulta) throw erro(404, 'Consulta não encontrada');
    return consulta;
  },

  criar({ pacienteId, especialidade, dataHora, status = 'agendada' } = {}) {
    if (!pacienteId || !especialidade || !dataHora) {
      throw erro(400, 'Campos "pacienteId", "especialidade" e "dataHora" são obrigatórios');
    }
    if (!STATUS_VALIDOS.includes(status)) {
      throw erro(400, `Status inválido. Deve ser um de: ${STATUS_VALIDOS.join(', ')}`);
    }
    // Regra de dependência: o paciente precisa existir
    const paciente = pacienteModel.buscarPorId(Number(pacienteId));
    if (!paciente) {
      throw erro(422, 'Paciente informado não existe');
    }
    return consultaModel.inserir({ pacienteId, especialidade, dataHora, status });
  },

  atualizar(id, dados = {}) {
    const consultaExistente = consultaModel.buscarPorId(id);
    if (!consultaExistente) throw erro(404, 'Consulta não encontrada');

    if (dados.status && !STATUS_VALIDOS.includes(dados.status)) {
      throw erro(400, `Status inválido. Deve ser um de: ${STATUS_VALIDOS.join(', ')}`);
    }
    if (dados.pacienteId !== undefined) {
      const paciente = pacienteModel.buscarPorId(Number(dados.pacienteId));
      if (!paciente) {
        throw erro(422, 'Paciente informado não existe');
      }
    }

    return consultaModel.atualizar(id, dados);
  },

  remover(id) {
    const removida = consultaModel.remover(id);
    if (!removida) throw erro(404, 'Consulta não encontrada');
  },
};
