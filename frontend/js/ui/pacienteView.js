// Camada de UI dos pacientes.
// Não faz fetch e não decide regras: apenas desenha o estado e captura eventos do DOM.
const el = {
  form: document.querySelector('#form-paciente'),
  salvar: document.querySelector('#pac-salvar'),
  cancelar: document.querySelector('#pac-cancelar'),
  carregando: document.querySelector('#pacientes-carregando'),
  erro: document.querySelector('#pacientes-erro'),
  erroMsg: document.querySelector('#pacientes-erro-msg'),
  recarregar: document.querySelector('#pacientes-recarregar'),
  vazio: document.querySelector('#pacientes-vazio'),
  sucesso: document.querySelector('#pacientes-sucesso'),
  linhas: document.querySelector('#pacientes-linhas'),
};

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto ?? '—'; // textContent: NUNCA interpreta HTML (proteção contra XSS)
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

function linha(paciente, editandoId) {
  const tr = document.createElement('tr');
  if (paciente.id === editandoId) tr.className = 'editando';

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', paciente.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', paciente.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(paciente.id),
    celula(paciente.nome),
    celula(paciente.email),
    celula(paciente.telefone ?? '—', 'numero text-nowrap'),
    acoes,
  );
  return tr;
}

export const pacienteView = {
  render({ status, pacientes, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...pacientes.map((p) => linha(p, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar paciente';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(paciente) {
    el.form.nome.value = paciente.nome;
    el.form.email.value = paciente.email;
    el.form.telefone.value = paciente.telefone ?? '';
    el.form.nome.focus();
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
