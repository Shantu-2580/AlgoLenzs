require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const recognizeRoute = require('./routes/recognize');
const statsRoute = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3001;

function safeEqual(a, b) {
  const aBuf = Buffer.from(String(a), 'utf8');
  const bBuf = Buffer.from(String(b), 'utf8');
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '50kb' }));

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin auth not configured' });
  }

  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!safeEqual(password, adminPassword)) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  return res.json({ ok: true });
});

// ── Routes ─────────────────────────────────────────────────
app.use('/api', recognizeRoute);
app.use('/api', statsRoute);

// ── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ AlgoLens backend running on port ${PORT}`);
});
