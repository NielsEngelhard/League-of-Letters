// SocketContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { ConnectionStatus, JoinGameRealtimeModel, RealtimeConnectedPlayer } from './realtime-models';

interface SocketContextType {
  socket: Socket | null;
  connectionStatus: ConnectionStatus;
  transport: string;

  connectedPlayers: RealtimeConnectedPlayer[];

  emitJoinGame: (data: JoinGameRealtimeModel) => void;
  initializeConnection: () => void;
  emitTestEvent: (gameId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
  serverUrl?: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ 
  children, 
  serverUrl = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_BASE_ADDRESS 
}) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("empty");
  const [transport, setTransport] = useState('N/A');
  const socketRef = useRef<Socket | null>(null);

  const [connectedPlayers, setConnectedPlayers] = useState<RealtimeConnectedPlayer[]>([]);

  const initializeConnection = () => {
    if (socketRef.current != null) {
      console.log(`Can't initializeConnection: already initialized. Status: ${connectionStatus}`);
      return;
    }

    setConnectionStatus("connecting");

    // Initialize connection on mount
    socketRef.current = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      setConnectionStatus("connected");
      setTransport(socket.io.engine.transport.name);
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      setConnectionStatus("disconnected");
      setTransport('N/A');
      console.log('Disconnected from WebSocket server');
    });

    socket.on('user-joined', (data: RealtimeConnectedPlayer) => {
      console.log("A user joined!!", data);

      setConnectedPlayers(prev => [...prev, data]);
    });

    socket.on('test', () => {
      console.log("Received test response from the socket server!");
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  };

  const emitJoinGame = (data: JoinGameRealtimeModel) => {
    socketRef.current?.emit('join-game', data);
  };

  const emitTestEvent = (gameId: string) => {
    socketRef.current?.emit('test', gameId);
  };

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      connectionStatus,
      transport,
      connectedPlayers,
      emitJoinGame,
      emitTestEvent,
	  initializeConnection
    }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};