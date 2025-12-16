import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { MessageWithSender } from '@/lib/database.types';

export type ServerToClientEvents = {
  'message:new': (data: MessageWithSender) => void;
  'message:read': (data: { threadId: string; userId: string }) => void;
};

export type ClientToServerEvents = {
  'thread:join': (threadId: string) => void;
  'thread:leave': (threadId: string) => void;
};

let io: SocketIOServer<ClientToServerEvents, ServerToClientEvents>;

export const getSocketIO = () => {
  if (!io) {
    const httpServer = createServer();
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log('🟢 Socket.IO client connected:', socket.id);

      socket.on('thread:join', (threadId: string) => {
        socket.join(`thread:${threadId}`);
        console.log(`🟢 Socket ${socket.id} joined thread:${threadId}`);
      });

      socket.on('thread:leave', (threadId: string) => {
        socket.leave(`thread:${threadId}`);
        console.log(`🔴 Socket ${socket.id} left thread:${threadId}`);
      });

      socket.on('disconnect', () => {
        console.log('🔴 Socket.IO client disconnected:', socket.id);
      });
    });

    const port = process.env.SOCKET_IO_PORT || 3001;
    httpServer.listen(port);
    console.log(`✅ Socket.IO server listening on port ${port}`);
  }

  return io;
};

export const emitNewMessage = (threadId: string, message: MessageWithSender) => {
  const io = getSocketIO();
  io.to(`thread:${threadId}`).emit('message:new', message);
  console.log(`📤 Emitted message to thread:${threadId}`, message.id);
};

// Initialize Socket.IO server when this module is loaded
getSocketIO();
