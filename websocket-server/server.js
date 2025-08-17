require('dotenv').config();

const { CallWebhook_UpdatePlayerConnectionStatus } = require("./letter-league-api-webhooks");

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);

// Configure CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Your Next.js app URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.post('/emit-to-room', (req, res) => {
  const { room, event, data } = req.body;
  
  // Emit to specific room
  io.to(room).emit(event, data);
  
  res.json({ success: true, message: `Event ${event} sent to room ${room}` });
});

// Basic HTTP endpoint for health checks
app.get('/health', (req, res) => {
  res.json({ status: 'WebSocket server is running', timestamp: new Date().toISOString() });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // USER ACTIONS --------------------------------------------------------------------
  socket.on('join-game', ({ gameId, username, accountId, isHost}) => {    
    // TODO: check in back-end if this lobby does exist
    
    // Set user specific data
    socket.accountId = accountId;
    socket.gameId = gameId;

    socket.join(gameId);
    console.log(`User ${username} joined room: ${gameId}`);    

    CallWebhook_UpdatePlayerConnectionStatus(socket.gameId, socket.accountId, "connected")
    .finally(() => {
      io.to(gameId).emit('user-joined', { accountId: accountId, username: username, isHost: isHost, connectionStatus: "connected" });
    });      
  });

  // TODO: Create a back-end endpoint that disposes the whole room when the game is deleted CLEAN UP

  socket.on('leave-game', (gameId) => {
    socket.leave(gameId);
    console.log(`User ${socket.id} left room: ${gameId}`);
    socket.in(gameId).emit('user-left', { accountId: socket.id, room });
  });

  socket.on('player-guess-changed', (guess) => {
    console.log("player-guess-changed " + guess);
    socket.broadcast.to(socket.gameId).emit('player-guess-changed', guess);
  });

  socket.on('guess-word', (guessWordResponse) => {
    console.log("guess-word triggered");
    // TODO: WHEN THIS MEANS GAME OVER, UNSUBSCRIBE FROM THIS GAME
    // TODO SET SOMETHING so that disconnect wont trigger server call (disconnect status should not be updated when game is not more)
    socket.broadcast.to(socket.gameId).emit('guess-word', guessWordResponse);
  });  

  socket.on('kick-player', ({ accountId, gameId }) => {
    console.log("kick-player triggered");
    io.to(gameId).emit('kick-player', accountId);
  });    
  // END USER ACTIONS --------------------------------------------------------------------

  // (external) SERVER ACTIONS 

  // Transition from lobby to playing game
  socket.on('start-game-transition', (gameId) => {
    console.log("start game transition triggered " + gameId);
    socket.in(gameId).emit('start-game', { gameId: gameId });
  });

  // END SERVER ACTIONS

  // GENERAL ACTIONS ----------------------------------------------------------------------
  socket.on('disconnect', () => {
    console.log(`User '${socket.accountId}' disconnected from game: '${socket.gameId}'`);

    CallWebhook_UpdatePlayerConnectionStatus(socket.gameId, socket.accountId, "disconnected")
    .finally(() => {
      socket.broadcast.to(socket.gameId).emit('user-disconnected', socket.accountId);   
    });     
  });

  socket.on('reconnect', () => {
    console.log(`User '${socket.accountId}' reconnected'`);
  });  

  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });

  socket.on('test', (gameId) => {
    console.error(`Emitting test event to room '${gameId}'`);
    io.to(gameId).emit('test');
    console.error(`Emitted test event to room '${gameId}'`);
  });  

  socket.on('delete-game', (gameId) => {
    // TODO SET SOMETHING so that disconnect wont trigger server call (disconnect status should not be updated when game is not more)
    console.log(`delete-game '${gameId}'`);
    socket.broadcast.to(gameId).emit('delete-game');
  });

  // END GENERAL ACTIONS -------------------------------------------------------------------
});

// Error handling for the server
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});