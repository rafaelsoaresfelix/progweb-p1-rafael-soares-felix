import express from 'express';
import pacientesRouter from './routes/pacientes.js';
import consultasRouter from './routes/consultas.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// --- Middleware global (antes das rotas) ---
app.use(express.json()); // lê o body JSON para req.body
app.use(logger);         // loga toda requisição

// --- Health check ---
app.get('/', (req, res) => {
  res.json({
    api: 'Clínica Ágil — API de Agendamento',
    versao: '1.0.0',
    rotas: ['/pacientes', '/consultas'],
  });
});

// --- Rotas ---
app.use('/pacientes', pacientesRouter);
app.use('/consultas', consultasRouter);

// --- 404 para rotas que não existem ---
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

// --- Tratador de erro: SEMPRE o último ---
app.use(errorHandler);

export default app;
