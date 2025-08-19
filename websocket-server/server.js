require('dotenv').config();

const { CallWebhook_UpdatePlayerConnectionStatus } = require("./letter-league-api-webhooks");
const { Logger } = require("./logger");

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

const httpRoutes = require('./httpRoutes')(io);
const socketHandlers = require('./socketHandlers');

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// PUBLIC HTTP ROUTES
app.use('/', httpRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  socketHandlers(io, socket);
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