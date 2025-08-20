const express = require('express');
const router = express.Router();

// Define routes
module.exports = (io) => {
  // POST: Emit to a specific room
  router.post('/emit-to-room', (req, res) => {
    const { room, event, data } = req.body;

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
