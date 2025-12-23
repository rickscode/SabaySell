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
  'server:broadcast': (data: { threadId: string; message: MessageWithSender }) => void;
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

      // Server-side broadcast from Next.js server actions
      socket.on('server:broadcast', (data: { threadId: string; message: MessageWithSender }) => {
        console.log(`📡 Server broadcast request for thread:${data.threadId}`);
        io.to(`thread:${data.threadId}`).emit('message:new', data.message);
        console.log(`📤 Broadcasted message to thread:${data.threadId}`, data.message.id);
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

// For backward compatibility - but this should not be used anymore
// Use lib/socket-emitter.ts from server actions instead
export const emitNewMessage = (threadId: string, message: MessageWithSender) => {
  console.warn('⚠️ Direct emitNewMessage is deprecated. Socket.IO server should be standalone.');
  // Don't call getSocketIO() here - will cause EADDRINUSE error
};

// Initialize server when this file is run as standalone server
// This is called by: npm run socket
getSocketIO();
