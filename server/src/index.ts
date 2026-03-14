import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import scriptsRouter from './routes/scripts';
import practiceRouter from './routes/practice';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/scripts', scriptsRouter);
app.use('/api/practice', practiceRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
