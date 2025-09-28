const { CallWebhook_TimerEnded } = require("./core-api-webhooks");


class OnlineGameTimerManager {
  constructor() {
    this.onlineGameTimers = new Map();
  }

  createTimer(gameId, secondsPerGuess) {
    if (this.onlineGameTimers.has(gameId)) {
      return this.onlineGameTimers.get(gameId);
    }

    const game = new OnlineGameTimer(gameId, secondsPerGuess);
    this.onlineGameTimers.set(gameId, game);
    console.log(`OnlineGameTimer created for game ${gameId}`);
    return game;
  }

  resetTimer(gameId) {
    const timer = this.onlineGameTimers.get(gameId);
    if (timer) {
      timer.resetTimer();
    }
  }
}

class OnlineGameTimer {
  constructor(gameId, secondsPerGuess) {
    this.gameId = gameId;
    this.secondsPerGuess = secondsPerGuess;
    this.timerId = null;
    this.turnStartTime = null;
    this.isActive = false;
    
    // Start the first turn immediately
    this.startNewTurn();
  }

  startNewTurn() {
    // Clear any existing timer
    this.clearTimer();
    
    // Record when this turn started
    this.turnStartTime = new Date();
    this.isActive = true;
    
    const timeoutMs = this.secondsPerGuess * 1000;
    
    console.log(`Game ${this.gameId}: Starting new turn, ${this.secondsPerGuess}s timer set`);
    
    this.timerId = setTimeout(() => {
      this.onTimerExpired();
    }, timeoutMs);
  }

  onTimerExpired() {
    if (!this.isActive) {
      return; // Timer was already handled
    }

    this.isActive = false;
    
    // Call webhook endpoint
    CallWebhook_TimerEnded(this.gameId)
    .finally(() => {
      console.log(`onTimerExpired called for ${this.gameId}`);
    });
  }

  resetTimer() {
    // Reset means start a new turn with the same time limit
    this.startNewTurn();
  }

  clearTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.isActive = false;
  }

  // Utility methods
  getRemainingTimeSeconds() {
    if (!this.isActive || !this.turnStartTime) {
      return 0;
    }
    
    const now = new Date();
    const elapsedMs = now - this.turnStartTime;
    const remainingMs = (this.secondsPerGuess * 1000) - elapsedMs;
    
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }

  getElapsedTimeSeconds() {
    if (!this.turnStartTime) {
      return 0;
    }
    
    const now = new Date();
    const elapsedMs = now - this.turnStartTime;
    
    return Math.floor(elapsedMs / 1000);
  }

  updateSecondsPerGuess(newSecondsPerGuess) {
    this.secondsPerGuess = newSecondsPerGuess;
    console.log(`Game ${this.gameId}: Updated to ${newSecondsPerGuess}s per guess`);
    
    // If a turn is active, restart with new timing
    if (this.isActive) {
      this.startNewTurn();
    }
  }
}

module.exports = OnlineGameTimerManager;