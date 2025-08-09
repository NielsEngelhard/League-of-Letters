// lib/socket-client.ts
import { io, Socket } from 'socket.io-client';

let serverSocket: Socket | null = null;

export function getServerSocketClient() {
  if (!serverSocket) {
    const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_BASE_ADDRESS;
    serverSocket = io(socketUrl, {
      autoConnect: true,
    });
    
    serverSocket.on('connect', () => {
      console.log('Server connected to Socket.IO server');
    });
  }
  return serverSocket;
}

// Emit to a specific room
export function serverEmitToRoom(room: string, event: string, data: any) {
  const socket = getServerSocketClient();
  socket.emit('emitToRoom', {
    room,
    event,
    data
  });
}

// Emit to all clients
export function serverEmitToAll(event: string, data: any) {
  const socket = getServerSocketClient();
  socket.emit('emitToAll', {
    event,
    data
  });
}

// Specific game functions
export function serverEmitPlayerReconnected(gameId: string, playerId: string) {
  serverEmitToRoom(`game:${gameId}`, 'playerReconnected', { playerId });
}

export function serverEmitGameStateUpdate(gameId: string, gameState: any) {
  serverEmitToRoom(`game:${gameId}`, 'gameStateUpdate', gameState);
}