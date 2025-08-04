import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { JoinGameRealtimeModel, LeaveGameRealtimeModel } from './realtime-models';

export const useSocket = (serverUrl = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_BASE_ADDRESS) => {
	const [isConnected, setIsConnected] = useState(false);
	const [transport, setTransport] = useState('N/A');
	const socketRef = useRef<Socket>(null);
	
	const initializeConnection = () => {
		// TODO: if already connected, dont connect

		socketRef.current = io(serverUrl, {
			withCredentials: true,
			transports: ['websocket', 'polling']
		});

		const socket = socketRef.current;

		// Connection event handlers
		socket.on('connect', () => {
			setIsConnected(true);
			setTransport(socket.io.engine.transport.name);
			console.log('Connected to WebSocket server');
		});

		socket.on('disconnect', () => {
			setIsConnected(false);
			setTransport('N/A');
			console.log('Disconnected from WebSocket server');
		});
	}


	// useEffect(() => {
	// // Create socket connection
	// socketRef.current = io(serverUrl, {
	// 	withCredentials: true,
	// 	transports: ['websocket', 'polling']
	// });

	// const socket = socketRef.current;

	// // Connection event handlers
	// socket.on('connect', () => {
	// 	setIsConnected(true);
	// 	setTransport(socket.io.engine.transport.name);
	// 	console.log('Connected to WebSocket server');
	// });

	// socket.on('disconnect', () => {
	// 	setIsConnected(false);
	// 	setTransport('N/A');
	// 	console.log('Disconnected from WebSocket server');
	// });

	// // Cleanup on unmount
	// return () => {
	// 	socket.disconnect();
	// };
	// }, [serverUrl]);

	// // Helper functions
	// const joinGame = (data: JoinGameRealtimeModel) => {
	// socketRef.current?.emit('join-game', data);
	// };

	// const leaveGame = (data: LeaveGameRealtimeModel) => {
	// socketRef.current?.emit('leave-game', data);
	// };

	return {
		socket: socketRef.current,
		isConnected,
		transport,
		initializeConnection,
	};
};