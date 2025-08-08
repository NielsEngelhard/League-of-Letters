// SocketContext.tsx
import React, { createContext, useContext, useRef, useState, ReactNode, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ConnectionStatus, JoinGameRealtimeModel } from './realtime-models';
import { GamePlayerModel } from '../game/game-models';

interface SocketContextType {
  socket: Socket | null;
  connectionStatus: ConnectionStatus;
  transport: string;

  initializeConnection: () => void;

  connectedPlayers: GamePlayerModel[];
  addPlayerIfNotExists: (players: GamePlayerModel) => void;

  emitJoinGame: (data: JoinGameRealtimeModel) => void;
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

  const [connectedPlayers, setConnectedPlayers] = useState<GamePlayerModel[]>([]);

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
      setConnectedPlayers([]);
      console.log('Disconnected from WebSocket server');
    });

    socket.on('user-joined', (player: GamePlayerModel) => {
      console.log(`REALTIME: User ${player.username} joined`);
      addPlayerIfNotExists(player);
    });

    socket.on('user-disconnected', (disconnectedUserId: string) => {
      console.log(`REALTIME: User ${disconnectedUserId} disconnected`);

      setConnectedPlayers(prev => {
        var userToDelete = prev.find(p => p.userId == disconnectedUserId);

        console.log("userToDelete:");
        console.log(userToDelete);
        console.log("playerlist:");
        console.log(prev);

        return prev.map(player => player.userId == disconnectedUserId ? {...player, connectionStatus: "disconnected"} : player);
      });
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

  const addPlayerIfNotExists = (player: GamePlayerModel) => {
    setConnectedPlayers(prev => {
      const playerExists = prev.some(p => p.userId === player.userId);

      if (playerExists) {
        return prev;
      }

      return [...prev, player];
    });
  };

    // LOG the connectedPlayers list for DEV reasons
    useEffect(() => {
      if (!connectedPlayers) return;
      
      console.log(connectedPlayers);
    }, [connectedPlayers])  

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      connectionStatus,
      transport,
      connectedPlayers,
      emitJoinGame,
      emitTestEvent,
      addPlayerIfNotExists,
	    initializeConnection,
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