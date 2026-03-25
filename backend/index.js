import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

// ✅ Fix __dirname for ES Modules
const __dirname = path.resolve();

// ── Middlewares ─────────────────────────
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// ── Routes ─────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);


if (process.env.NODE_ENV === 'production') {

  const frontendPath = path.join(__dirname, '../frontend/chat-app/dist');

  app.use(express.static(frontendPath));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ── Start Server ───────────────────────
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  connectDB();
});