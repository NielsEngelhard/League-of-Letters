const express = require('express');
const router = express.Router();

// Define routes
module.exports = (io) => {
  // POST: Emit to a specific room
  router.post('/emit-to-room', (req, res) => {
    // Api key auth
    const apiKey = req.headers['api-key'];
    if (apiKey != process.env.API_KEY) throw Error("404 Unauthenticated");

    const { room, event, data } = req.body;

    // Emit websocket request to room
    io.to(room).emit(event, data);

    res.json({ 
      success: true, 
      message: `Event ${event} sent to room ${room}` 
    });
  });

  // GET: Health check
  router.get('/health', (req, res) => {
    res.json({ 
      status: 'WebSocket server is running', 
      timestamp: new Date().toISOString() 
    });
  });

  return router;
};
