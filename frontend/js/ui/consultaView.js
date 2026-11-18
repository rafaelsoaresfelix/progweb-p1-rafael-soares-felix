// Camada de UI das consultas.
// Desenha a tabela com os nomes dos pacientes, popula o <select> e captura os eventos.
const el = {
  form: document.querySelector('#form-consulta'),
  paciente: document.querySelector('#con-paciente'),
  salvar: document.querySelector('#con-salvar'),
  cancelar: document.querySelector('#con-cancelar'),
  carregando: document.querySelector('#consultas-carregando'),
  erro: document.querySelector('#consultas-erro'),
  erroMsg: document.querySelector('#consultas-erro-msg'),
  recarregar: document.querySelector('#consultas-recarregar'),
  vazio: document.querySelector('#consultas-vazio'),
  sucesso: document.querySelector('#consultas-sucesso'),
  linhas: document.querySelector('#consultas-linhas'),
};

const STATUS_ROTULO = {
  agendada: 'Agendada',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  realizada: 'Realizada',
};

// id → nome, para mostrar o nome do paciente na tabela sem requisição extra
let nomeDoPaciente = new Map();

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto ?? '—'; // textContent: NUNCA interpreta HTML
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = `btn btn-sm ${classe}`;
  b.dataset.acao = acao;
  b.dataset.id = id;
  return b;
}

function linha(consulta, editandoId) {
  const tr = document.createElement('tr');
  if (consulta.id === editandoId) tr.className = 'editando';

  const pacienteNome = nomeDoPaciente.get(consulta.pacienteId)
    ?? `paciente #${consulta.pacienteId} (removido)`;

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', consulta.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', consulta.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(consulta.id),
    celula(pacienteNome),
    celula(consulta.especialidade),
    celula(consulta.dataHora, 'numero text-nowrap'),
    celula(STATUS_ROTULO[consulta.status] ?? consulta.status),
    acoes,
  );
  return tr;
}

export const consultaView = {
  // Preenche o <select> com os pacientes atuais
  preencherPacientes(pacientes) {
    nomeDoPaciente = new Map(pacientes.map((p) => [p.id, p.nome]));
    const escolhido = el.paciente.value;

    const opcoes = pacientes.map((p) => new Option(`${p.nome} (#${p.id})`, p.id));
    el.paciente.replaceChildren(new Option('Selecione o paciente…', ''), ...opcoes);

    // Mantém a escolha anterior se o paciente ainda existir na lista
    if (nomeDoPaciente.has(Number(escolhido))) el.paciente.value = escolhido;
  },

  render({ status, consultas, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...consultas.map((c) => linha(c, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Agendar consulta';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(consulta) {
    el.form.pacienteId.value = consulta.pacienteId;
    el.form.especialidade.value = consulta.especialidade;
    el.form.dataHora.value = consulta.dataHora;
    el.form.status.value = consulta.status;
    el.form.especialidade.focus();
  },

  limparForm() {
    el.form.reset();
  },

  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },

  aoCancelar(fn) {
    el.cancelar.addEventListener('click', fn);
  },

  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },

  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id);
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};
