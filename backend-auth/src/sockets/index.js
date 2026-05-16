import { Server } from 'socket.io';
import logger from '../config/logger.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 Socket connected: ${socket.id}`);

    // Join a specific room (e.g. project room or team room)
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      logger.info(`User ${socket.id} joined room: ${roomId}`);
    });

    // Handle typing indicators
    socket.on('typing', ({ roomId, user }) => {
      socket.to(roomId).emit('userTyping', { user });
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};
