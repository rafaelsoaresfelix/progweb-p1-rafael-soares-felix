# Testes da API — Projeto 1 (S3)

API: Clínica Ágil — Agendamento de Consultas · Entidades: Paciente e Consulta · Servidor: `npm run dev` em http://localhost:3000

| # | Método | URL | Body | Status obtido | Observação |
|---|---|---|---|---|---|
| 1 | GET | / | — | 200 | Health check com lista de rotas |
| 2 | POST | /pacientes | `{"nome":"Maria Santos","email":"maria@email.com","telefone":"83999990001"}` | 201 | Criação de paciente com sucesso |
| 3 | POST | /pacientes | `{"nome":"Carlos Lima","email":"carlos@email.com","telefone":"83999990002"}` | 201 | Criação de segundo paciente |
| 4 | GET | /pacientes | — | 200 | Listagem de todos os pacientes |
| 5 | GET | /pacientes/1 | — | 200 | Busca de paciente por ID existente |
| 6 | GET | /pacientes/99 | — | 404 | Busca de paciente inexistente |
| 7 | POST | /pacientes | `{"nome":"Outra Maria","email":"maria@email.com"}` | 409 | Regra: e-mail já cadastrado (único) |
| 8 | POST | /pacientes | `{"email":"semnome@email.com"}` | 400 | Regra: campos obrigatórios ausentes |
| 9 | POST | /pacientes | `{"nome":"Joao","email":"email-invalido"}` | 400 | Regra: validação de formato de e-mail |
| 10 | PUT | /pacientes/1 | `{"telefone":"83988887777"}` | 200 | Atualização de dados de paciente |
| 11 | POST | /consultas | `{"pacienteId":1,"especialidade":"Cardiologia","dataHora":"2026-12-01T14:00:00Z"}` | 201 | Agendamento de consulta para paciente existente |
| 12 | POST | /consultas | `{"pacienteId":2,"especialidade":"Dermatologia","dataHora":"2026-12-02T10:30:00Z"}` | 201 | Agendamento de consulta para o paciente 2 |
| 13 | GET | /consultas?pacienteId=1 | — | 200 | Listagem com filtro 1:N por paciente |
| 14 | GET | /consultas/1 | — | 200 | Busca de consulta por ID existente |
| 15 | GET | /consultas/99 | — | 404 | Busca de consulta inexistente |
| 16 | POST | /consultas | `{"pacienteId":999,"especialidade":"Neurologia","dataHora":"2026-12-03T09:00:00Z"}` | 422 | Regra de dependência: paciente pai não existe |
| 17 | POST | /consultas | `{"pacienteId":1,"especialidade":"Ortopedia","dataHora":"2026-12-04T15:00:00Z","status":"invalido"}` | 400 | Regra: status deve ser um dos valores permitidos |
| 18 | PUT | /consultas/1 | `{"status":"confirmada"}` | 200 | Atualização de status da consulta |
| 19 | DELETE | /consultas/2 | — | 204 | Remoção de consulta por ID |
| 20 | GET | /consultas/2 | — | 404 | Confirmação de consulta removida |
| 21 | DELETE | /pacientes/2 | — | 204 | Remoção de paciente por ID |
| 22 | GET | /pacientes/2 | — | 404 | Confirmação de paciente removido |
