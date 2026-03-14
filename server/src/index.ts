import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import scriptsRouter from './routes/scripts';
import practiceRouter from './routes/practice';

const app = express();
const PORT = process.env.PORT ?? 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl in dev)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10kb' }));

// Rate limiting: 30 requests per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api/', apiLimiter);

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
