const { CallWebhook_UpdatePlayerConnectionStatus } = require("./letter-league-api-webhooks");
const { Logger } = require("./logger");

module.exports = (io, socket) => {
  Logger.LogWebsocketTrigger("initializing-connection", socket.id);

  // USER ACTIONS --------------------------------------------------------------------
  socket.on('join-game', ({ gameId, username, accountId, isHost }) => {
    // TODO: check in back-end if this lobby does exist

    // Set user specific data
    socket.accountId = accountId;
    socket.gameId = gameId;

    socket.join(gameId);
    Logger.LogWebsocketTrigger("join-room", `User: '${username}' Room/gameid: '${gameId}'`);

    CallWebhook_UpdatePlayerConnectionStatus(socket.gameId, socket.accountId, "connected")
      .finally(() => {
        io.to(gameId).emit('user-joined', { 
          accountId, username, isHost, connectionStatus: "connected" 
        });
      });
  });

  // TODO: Create a back-end endpoint that disposes the whole room when the game is deleted CLEAN UP

  socket.on('leave-game', (gameId) => {
    Logger.LogWebsocketTrigger("leave-game", `AccountId: '${socket.accountId}' Room/gameid: '${gameId}'`);    
    socket.leave(gameId);
    socket.in(gameId).emit('user-left', { accountId: socket.accountId, room: gameId });
  });

  socket.on('player-guess-changed', (guess) => {
    Logger.LogWebsocketTrigger("player-guess-changed", `GameId/Room: '${socket.gameId}' Guess: '${guess}'`);  
    socket.broadcast.to(socket.gameId).emit('player-guess-changed', guess);
  });

  socket.on('guess-word', (guessWordResponse) => {
    Logger.LogWebsocketTrigger("guess-word", `GameId/Room: '${socket.gameId}'`);  
    socket.broadcast.to(socket.gameId).emit('guess-word', guessWordResponse);
  });

  socket.on('kick-player', ({ accountId, gameId }) => {
    Logger.LogWebsocketTrigger("kick-player", `GameId/Room: '${gameId}' AccountId: '${accountId}'`);
    io.to(gameId).emit('kick-player', accountId);
  });
  // END USER ACTIONS --------------------------------------------------------------------

  // SERVER ACTIONS ---------------------------------------------------------------------
  socket.on('start-game-transition', (gameId) => {
    Logger.LogWebsocketTrigger("start-game-transition", `GameId/Room: '${gameId}'`);
    socket.in(gameId).emit('start-game', { gameId });
  });
  // END SERVER ACTIONS -----------------------------------------------------------------

  // GENERAL ACTIONS --------------------------------------------------------------------
  socket.on('disconnect', () => {
    Logger.LogWebsocketTrigger("disconnect", `GameId/Room: '${socket.gameId} AccountId: ${socket.accountId}'`);
    CallWebhook_UpdatePlayerConnectionStatus(socket.gameId, socket.accountId, "disconnected")
      .finally(() => {
        socket.broadcast.to(socket.gameId).emit('user-disconnected', socket.accountId);
      });
  });

  socket.on('error', (error) => {
    Logger.LogWebsocketTrigger(`Socket error for ${socket.id}:`, error);
  });

  socket.on('test', (gameId) => {
    Logger.LogWebsocketTrigger('test', `test even triggered for gameId ${gameId}`);
    io.to(gameId).emit('test');
  });

  socket.on('delete-game', (gameId) => {
    Logger.LogWebsocketTrigger('delete-game', `GameId: '${gameId}'`);
    socket.broadcast.to(gameId).emit('delete-game');
  });
  // END GENERAL ACTIONS ----------------------------------------------------------------
};
