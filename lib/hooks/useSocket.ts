import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@/lib/socket';

type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

export const useSocket = () => {
  const socketRef = useRef<SocketClient | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
        withCredentials: true,
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return socketRef.current;
};
