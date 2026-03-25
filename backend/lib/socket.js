import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// ── Online Users Map { userId: socketId } ─────────────────────────────────────
const userSocketMap = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId.toString()];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    // Broadcast updated online users list to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log(`✅ User connected: ${userId} → socket: ${socket.id}`);
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      console.log(`❌ User disconnected: ${userId}`);
    }
  });
});

export { io, app, server };