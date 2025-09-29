const express = require('express');
const router = express.Router();
const { Logger } = require("./logger");

// Define routes
module.exports = (io, onlineGameTimerManager) => {
  // POST: Emit any event to a specific room
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

  router.post('/start-game', (req, res) => {
    // Api key auth
    const apiKey = req.headers['api-key'];
    if (apiKey != process.env.API_KEY) throw Error("404 Unauthenticated");

    const { room, event, data } = req.body;

    // LOGIC
    Logger.LogWebsocketTrigger("start-game", `GameId/Room: '${data.gameId}' with time = ${data.withTimer}`);
    
    if (data.withTimer && data.guessEndDateTime) {
      onlineGameTimerManager.createTimer(data.gameId, data.guessEndDateTime);
    }
    
    io.to(data.gameId).emit('start-game-transition', data.gameId);
    // LOGIC

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

  // GET Active timers
  router.get('/timers', (req, res) => {
    const timersJSON = onlineGameTimerManager.getAllTimers();

    res.json(timersJSON);
  });  

  return router;
};
