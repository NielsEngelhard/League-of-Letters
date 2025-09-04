"use client"

import React, { createContext, useContext, useRef, useState, ReactNode, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ConnectionStatus, JoinGameRealtimeModel } from './realtime-models';
import { useRouter } from 'next/navigation';
import { JOIN_GAME_ROUTE, LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE, PLAY_ONLINE_GAME_ROUTE } from '@/app/routes';
import { useActiveGame } from '../game/components/active-game-context';
import { GuessWordResponse } from '../game/actions/command/guess-word-command';
import { useAuth } from '../auth/AuthContext';
import { GamePlayerModel } from '../game/game-models';
import { RealtimeLogger } from './realtime-logger';
import { DefaultLanguage, SupportedLanguage } from '../i18n/languages';
import { useMessageBar } from '@/components/layout/MessageBarContext';

interface SocketContextType {
  socket: Socket | null;
  connectionStatus: ConnectionStatus;
  transport: string;

  initializeConnection: () => void;
  disconnectConnection: () => void;

  emitJoinGame: (data: JoinGameRealtimeModel) => void;
  emitTestEvent: (gameId: string) => void;
  emitHostCreatedNewLobby: (oldGameId: string, newLobbyId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  lang: SupportedLanguage;
  children: ReactNode;
  serverUrl?: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ 
  children, 
  serverUrl,
  lang
}) => {
  const activeGameContext = useActiveGame();
  const { account } = useAuth();
  const { pushErrorMsg } = useMessageBar();

  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("empty");
  const [transport, setTransport] = useState('N/A');
  const socketRef = useRef<Socket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxRetries = 3;
  const retryDelay = 2000;

  const handleConnectionFailure = () => {
    pushErrorMsg("Realtime error");
    router.push(LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE));
  };

  const attemptConnection = () => {
    if (socketRef.current != null) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setConnectionStatus("connecting");

    RealtimeLogger.Log(`Connection attempt ${retryCountRef.current + 1}/${maxRetries}`);

    // Initialize connection
    socketRef.current = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      timeout: 4000,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      RealtimeLogger.Log("connected (this client)");
      setConnectionStatus("connected");      
      setTransport(socket.io.engine.transport.name);
      console.log('Connected to WebSocket server');
      
      // Reset retry count on successful connection
      retryCountRef.current = 0;
      
      // Clear any pending retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    });

    socket.on('connect_error', (error) => {
      RealtimeLogger.Log(`Connection error: ${error.message}`);
      console.log('Connection error:', error);
      
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        RealtimeLogger.Log(`Retrying in ${retryDelay}ms... (attempt ${retryCountRef.current}/${maxRetries})`);
        
        retryTimeoutRef.current = setTimeout(() => {
          attemptConnection();
        }, retryDelay);
      } else {
        RealtimeLogger.Log(`Max retries (${maxRetries}) reached. Connection failed.`);
        setConnectionStatus("disconnected");
        handleConnectionFailure();
        
        // Clean up the socket
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      }
    });

    socket.on('disconnect', (reason) => {
      RealtimeLogger.Log(`disconnect: ${reason}`);
      setConnectionStatus("disconnected");
      setTransport('N/A');      
      activeGameContext.clearGameState();
      
      // Only retry if it was an unexpected disconnection and we haven't exceeded max retries
      if (reason === 'io server disconnect' || reason === 'transport close' || reason === 'transport error') {
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          RealtimeLogger.Log(`Unexpected disconnect. Retrying in ${retryDelay}ms... (attempt ${retryCountRef.current}/${maxRetries})`);
          
          retryTimeoutRef.current = setTimeout(() => {
            attemptConnection();
          }, retryDelay);
        } else {
          RealtimeLogger.Log(`Max retries (${maxRetries}) reached after disconnect.`);
          handleConnectionFailure();
        }
      }
    });

    socket.on('user-joined', (player: GamePlayerModel) => {
      RealtimeLogger.Log(`user-joined ${player.username} joined`);
      activeGameContext.addOrReconnectPlayer(player);      
    });

    socket.on('user-disconnected', (disconnectedUserId: string) => {
      RealtimeLogger.Log(`user-disconnected ${disconnectedUserId} disconnected`);
      activeGameContext.disconnectPlayer(disconnectedUserId);
    });
    
    socket.on('start-game-transition', (gameId: string) => {
      RealtimeLogger.Log(`start-game-transition ${gameId}`);
      router.push(LANGUAGE_ROUTE(lang, PLAY_ONLINE_GAME_ROUTE(gameId)));
    });

    socket.on('guess-word', (response: GuessWordResponse) => {
      RealtimeLogger.Log(`guess-word ${response.guessResult.evaluatedLetters.map(el => el.letter)}`);
      if (response.accountId == account?.id) return;
      activeGameContext.handleWordGuess(response);
    });

    socket.on('host-created-new-lobby', (newLobbyId) => {
      RealtimeLogger.Log(`host-created-new-lobby ${newLobbyId}`);
      router.push(LANGUAGE_ROUTE(account?.language ?? DefaultLanguage, JOIN_GAME_ROUTE(newLobbyId)));
    });
    
    socket.on('player-guess-changed', (guess: string) => {
      RealtimeLogger.Log(`player-guess-changed ${guess}`);
      activeGameContext.setCurrentGuess(guess);
    });
  };

  const initializeConnection = () => {
    if (socketRef.current != null) {
      console.log(`SOCKET: Can't initializeConnection: already initialized. Status: ${connectionStatus}`);
      return;
    }

    // Reset retry count when manually initializing
    retryCountRef.current = 0;
    
    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    attemptConnection();
  };

  const disconnectConnection = () => {
    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // Reset retry count
    retryCountRef.current = 0;
    
    if (socketRef.current) {
      RealtimeLogger.Log("manually disconnecting socket");
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnectionStatus("empty");
      setTransport('N/A');
      RealtimeLogger.Log("manually disconnected socket");
    }
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

  const emitHostCreatedNewLobby = (oldGameId: string, newLobbyId: string) => {
    socketRef.current?.emit('host-created-new-lobby', {
      oldGameId: oldGameId,
      newLobbyId: newLobbyId,
    });
  };  

  // When the user's currentGuess changes "locally", other players should see that
  useEffect(() => {    
    // Prevent infinite loop by only doing this for the person who's turn it is
    if (activeGameContext.currentGuess == undefined || !activeGameContext.isThisPlayersTurn) {
      return;
    }
    emitGuessChangedEvent(activeGameContext.currentGuess);    
  }, [activeGameContext.currentGuess, activeGameContext.isThisPlayersTurn]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      connectionStatus,
      transport,
      emitJoinGame,
      emitTestEvent,
      emitHostCreatedNewLobby,
	    initializeConnection,
      disconnectConnection
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