const { CallWebhook_TimerEnded } = require("./core-api-webhooks");

class OnlineGameTimerManager {
  constructor() {
    this.onlineGameTimers = new Map();
  }

  createTimer(gameId, endTime) {
    if (this.onlineGameTimers.has(gameId)) {
      return this.onlineGameTimers.get(gameId);
    }

    const game = new OnlineGameTimer(gameId, endTime);
    this.onlineGameTimers.set(gameId, game);

    return game;
  }

  updateTimer(gameId, endTime) {
    const timer = this.onlineGameTimers.get(gameId);
    if (timer) {
      timer.updateEndTime(endTime);
    }
  }

  removeTimer(gameId) {
    const timer = this.onlineGameTimers.get(gameId);
    if (timer) {
      // Clear all timer resources
      timer.clearTimer();
      // Remove from the map
      this.onlineGameTimers.delete(gameId);
      return true;
    }
    return false;
  }

  removeExpiredTimers() {
    const now = new Date();
    const twoHoursInMs = 2 * 60 * 60 * 1000; // For now hard coded 2h
    const removedGameIds = [];

    for (const [gameId, timer] of this.onlineGameTimers.entries()) {
      // Check if timer has an end time and it's more than 2 hours in the past
      if (timer.endTime) {
        const timeSinceEnd = now.getTime() - timer.endTime.getTime();
        
        if (timeSinceEnd > twoHoursInMs) {
          timer.clearTimer();
          this.onlineGameTimers.delete(gameId);
          removedGameIds.push(gameId);
        }
      }
    }

    console.log(`Removed ${removedGameIds.length} expired timers: ${removedGameIds.join(', ')}`);
    return removedGameIds;
  }

  getAllTimers() {
    const timers = [];
    
    for (const [gameId, timer] of this.onlineGameTimers.entries()) {
      timers.push({
        gameId: timer.gameId,
        endTime: timer.endTime ? timer.endTime.toISOString() : null,
        isActive: timer.isActive,
        remainingTimeSeconds: timer.getRemainingTimeSeconds(),
        elapsedTimeSeconds: timer.getElapsedTimeSeconds()
      });
    }
    
    return JSON.stringify(timers, null, 2);
  }  
}

class OnlineGameTimer {
  constructor(gameId, endTime) {
    this.gameId = gameId;
    this.endTime = null;
    this.timerId = null;
    this.isActive = false;
    this.checkIntervalId = null;
    
    // Start the timer with the provided end time
    this.updateEndTime(endTime);
  }

  updateEndTime(endTimeString) {
    // Clear any existing timer
    this.clearTimer();
    
    // Validate and store the end time
    this.endTime = new Date(endTimeString);
    this.isActive = true;
    
    const now = new Date();
    const timeUntilEnd = this.endTime.getTime() - now.getTime();
    
    if (timeUntilEnd <= 0) {
      // Already past the end time, trigger immediately
      this.onTimerExpired();
    } else {
      // Set timeout for the exact end time
      this.timerId = setTimeout(() => {
        this.onTimerExpired();
      }, timeUntilEnd);
      
      // Also set up interval check every second as a backup
      // This ensures we catch the expiration even if setTimeout drifts
      this.checkIntervalId = setInterval(() => {
        const currentTime = new Date();
        if (currentTime >= this.endTime && this.isActive) {
          this.onTimerExpired();
        }
      }, 1000);
    }
  }

  onTimerExpired() {
    if (!this.isActive) {
      return; // Timer was already handled
    }

    this.isActive = false;
    this.clearTimer();
    
    // Call webhook endpoint
    CallWebhook_TimerEnded(this.gameId)
    .finally(() => {
      console.log(`onTimerExpired called for ${this.gameId} at ${new Date().toISOString()}`);
    });
  }

  clearTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }
    this.isActive = false;
  }

  // Utility methods
  getRemainingTimeSeconds() {
    if (!this.isActive || !this.endTime) {
      return 0;
    }
    
    const now = new Date();
    const remainingMs = this.endTime.getTime() - now.getTime();
    
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }

  getElapsedTimeSeconds() {
    if (!this.endTime) {
      return 0;
    }
    
    const now = new Date();
    const elapsedMs = now.getTime() - this.endTime.getTime();
    
    // Return positive elapsed time since end time (0 if not yet reached)
    return Math.max(0, Math.floor(elapsedMs / 1000));
  }
}

module.exports = OnlineGameTimerManager;