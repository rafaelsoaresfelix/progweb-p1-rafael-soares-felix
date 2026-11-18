let consultas = [];
let proximoId = 1;

export const consultaModel = {
  listar() {
    return consultas;
  },

  listarPorPaciente(pacienteId) {
    return consultas.filter((c) => c.pacienteId === pacienteId);
  },

  buscarPorId(id) {
    return consultas.find((c) => c.id === id) ?? null;
  },

  inserir({ pacienteId, especialidade, dataHora, status }) {
    const nova = {
      id: proximoId++,
      pacienteId: Number(pacienteId),
      especialidade,
      dataHora,
      status: status ?? 'agendada',
      criadaEm: new Date().toISOString(),
    };
    consultas.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const i = consultas.findIndex((c) => c.id === id);
    if (i === -1) return null;
    const pacienteId = dados.pacienteId !== undefined ? Number(dados.pacienteId) : consultas[i].pacienteId;
    consultas[i] = { ...consultas[i], ...dados, pacienteId, id };
    return consultas[i];
  },

  remover(id) {
    const antes = consultas.length;
    consultas = consultas.filter((c) => c.id !== id);
    return consultas.length < antes;
  },
};
