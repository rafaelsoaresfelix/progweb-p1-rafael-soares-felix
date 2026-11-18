# Telas do Projeto 1 (S4) — Clínica Ágil

Front: `npx http-server -p 5500 -c-1` em `frontend/` · API: `npm run dev` em `backend/` (http://localhost:3000)

## Estados das Telas e Regras de Negócio

| Lista | Estado | Como provocar | O que aparece na tela |
|---|---|---|---|
| Pacientes | Carregando | Network → throttling 3G → F5 | Bloco `#pacientes-carregando` visível com spinner e mensagem "Carregando pacientes…" |
| Pacientes | Vazio | Iniciar a API limpa (sem dados cadastrados) | Bloco `#pacientes-vazio` com texto "Nenhum paciente cadastrado ainda. Preencha o formulário para adicionar o primeiro." |
| Pacientes | Erro de conexão | Derrubar o backend (`Ctrl+C`) e recarregar (F5) | Bloco `#pacientes-erro` com alerta vermelho "Não consegui falar com a API. Ela está rodando?" e botão "Tentar de novo" |
| Pacientes | Sucesso | Cadastrar paciente "Maria Santos" (`maria@email.com`) | Bloco `#pacientes-sucesso` com tabela preenchida com a linha do paciente e faixa verde de aviso "Paciente cadastrado com sucesso." |
| Pacientes | Erro de validação (Front) | Deixar campo Nome em branco e submeter | Aviso em vermelho "Informe o nome do paciente." sem disparar requisição HTTP |
| Pacientes | Erro de regra (Backend 409) | Cadastrar outro paciente com o mesmo e-mail `maria@email.com` | Aviso em vermelho com a mensagem do backend: "Já existe um paciente cadastrado com este e-mail" (Status 409) |
| Consultas | Carregando | Network → throttling 3G → F5 | Bloco `#consultas-carregando` visível com spinner e mensagem "Carregando consultas…" |
| Consultas | Vazio | Sem consultas cadastradas | Bloco `#consultas-vazio` com mensagem "Nenhuma consulta cadastrada ainda. Cadastre um paciente e agende a primeira." |
| Consultas | Sucesso | Selecionar "Maria Santos" no `<select>`, especialidade "Cardiologia", dataHora e submeter | Bloco `#consultas-sucesso` com tabela exibindo o nome do paciente (resolvido via Map), dados e faixa verde "Consulta agendada com sucesso." |
| Consultas | Erro de validação (Front) | Tentar agendar sem selecionar o paciente no `<select>` | Aviso em vermelho "Selecione o paciente." |
| Consultas | Erro de regra (Backend 422) | Enviar requisição com `pacienteId: 999` (inexistente) | Aviso em vermelho com mensagem do backend: "Paciente informado não existe" (Status 422) |
| Consultas | Erro de regra (Backend 400) | Enviar status diferente dos permitidos | Aviso em vermelho com mensagem do backend: "Status inválido. Deve ser um de: agendada, confirmada, cancelada, realizada" (Status 400) |

## Arquitetura em Camadas

- **Camada HTTP (`js/api.js`):** Centraliza as chamadas `fetch`, configuração de cabeçalhos (`Content-Type: application/json`), tratamento de resposta `204 No Content` e normalização de mensagens de erro `{ "erro": "..." }`.
- **Camada de Serviços (`js/services/`):**
  - `pacienteService.js`: Limpa entradas (`trim`), valida campos obrigatórios e formato de e-mail no cliente antes de despachar a requisição.
  - `consultaService.js`: Converte identificadores para `Number`, valida campos obrigatórios e integridade das opções selecionadas.
- **Camada de Estado (`js/state/store.js`):** Implementa o padrão Observer com `criarStore`, garantindo fonte única da verdade para cada recurso e disparando renderizações reativas (`assinar`).
- **Camada de UI (`js/ui/`):**
  - `aviso.js`: Faixa dinâmica de alertas de sucesso e erro.
  - `pacienteView.js` e `consultaView.js`: Manipulam exclusivamente o DOM utilizando `textContent` (proteção rigorosa contra ataques XSS), delegação de eventos nos botões de ação e alternância estrita entre os 4 estados através de classes utilitárias (`d-none`).
- **Orquestrador (`js/main.js`):** Conecta stores, views e services, coordenando a reatividade entre o cadastro de pacientes e a atualização dinâmica das opções do `<select>` de consultas.
