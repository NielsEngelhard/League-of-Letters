// SocketContext.tsx
import React, { createContext, useContext, useRef, useState, ReactNode, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ConnectionStatus, JoinGameRealtimeModel } from './realtime-models';
import { useRouter } from 'next/navigation';
import { MULTIPLAYER_GAME_ROUTE, PLAY_GAME_ROUTE } from '@/app/routes';
import { useMessageBar } from '@/components/layout/MessageBarContext';
import { useActiveGame } from '../game/components/active-game-context';
import { GuessWordResponse } from '../game/actions/command/guess-word-command';
import { useAuth } from '../auth/AuthContext';
import { GamePlayerModel } from '../game/game-models';

interface SocketContextType {
  socket: Socket | null;
  connectionStatus: ConnectionStatus;
  transport: string;

  initializeConnection: () => void;

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
  const { pushMessage } = useMessageBar();
  const activeGameContext = useActiveGame();
  const { account } = useAuth();

  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("empty");
  const [transport, setTransport] = useState('N/A');
  const socketRef = useRef<Socket | null>(null);

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
      activeGameContext.clearGameState();
    });

    socket.on('user-joined', (player: GamePlayerModel) => {
      console.log(`REALTIME: User ${player.username} joined`);
      
      activeGameContext.addOrReconnectPlayer(player);
    });

    socket.on('user-disconnected', (disconnectedUserId: string) => {
      console.log(`REALTIME: User ${disconnectedUserId} disconnected`);

      activeGameContext.disconnectPlayer(disconnectedUserId);
    });    

    socket.on('test', () => {
      console.log("Received test response from the socket server!");
    });
    
    socket.on('start-game-transition', (gameId: string) => {
      console.log("START GAME HAS BEEN TRIGGERED " + gameId);
      router.push(PLAY_GAME_ROUTE(gameId));
    });

    socket.on('guess-word', (response: GuessWordResponse) => {
      if (response.accountId == account?.id) return;

      console.log("GUESS WORD HAS BEEN TRIGGERED");
      activeGameContext.handleWordGuess(response);
    });    

    socket.on('delete-game', (gameId: string) => {
      pushMessage({
        msg: "Game abandoned",
        type: "information"
      });
      router.push(MULTIPLAYER_GAME_ROUTE);
    });
    
    socket.on('player-guess-changed', (guess: string) => {
      console.log("player guess changed!! " + guess);
      activeGameContext.setCurrentGuess(guess);
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

  const emitGuessChangedEvent = (guess: string) => {
    socketRef.current?.emit('player-guess-changed', guess);
  };

  // When the user's currentGuess changes "locally", other players should see that
  useEffect(() => {    
    // Prevent infinite loop by only doing this for the person who's turn it is
    if (activeGameContext.currentGuess == undefined || !activeGameContext.isThisPlayersTurn) {
      return;
    }
    emitGuessChangedEvent(activeGameContext.currentGuess);    
  }, [activeGameContext.currentGuess]);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      connectionStatus,
      transport,
      emitJoinGame,
      emitTestEvent,
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