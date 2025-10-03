import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()) || '*'
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'ZodError') {
    return res.status(400).json({ errors: err.errors });
  }
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`EdgeCity API listening on port ${port}`);
});
