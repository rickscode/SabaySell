import { io as ioClient, Socket } from 'socket.io-client';
import type { MessageWithSender } from '@/lib/database.types';
import type { ServerToClientEvents, ClientToServerEvents } from './socket';

let emitterSocket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

/**
 * Get or create a Socket.IO client connection for emitting events
 * This is used by server actions to emit events to the standalone Socket.IO server
 */
const getEmitterSocket = () => {
  if (!emitterSocket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    emitterSocket = ioClient(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    emitterSocket.on('connect_error', (error) => {
      console.error('❌ Socket.IO emitter connection error:', error.message);
    });
  }

  return emitterSocket;
};

/**
 * Emit a new message event to all clients in a thread room
 * This is called from server actions after saving a message to the database
 */
export const emitNewMessage = async (threadId: string, message: MessageWithSender): Promise<void> => {
  try {
    const socket = getEmitterSocket();

    // Wait for connection if not connected
    if (!socket.connected) {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Socket.IO emitter connection timeout'));
        }, 5000);

        socket.once('connect', () => {
          clearTimeout(timeout);
          resolve();
        });

        socket.once('connect_error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });

        // If already connecting, wait for it
        if (!socket.connected) {
          socket.connect();
        }
      });
    }

    // Emit the message to the server, which will broadcast to all clients in the room
    socket.emit('server:broadcast', { threadId, message } as any);
  } catch (error) {
    console.error('❌ Failed to emit message via Socket.IO:', error);
    // Don't throw - message is already saved to DB, Socket.IO is just for real-time updates
  }
};
