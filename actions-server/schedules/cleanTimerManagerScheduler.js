const cron = require('node-cron');

function initCleanTimersScheduler(onlineGameTimerManager) {
  console.log('Initializing scheduler for cleaning timers...');
  
  // Run at midnight every day (0 0 * * *)
  cron.schedule('0 0 * * *', async () => {
    console.log('Midnight task started at:', new Date().toISOString());
    
    try {
      onlineGameTimerManager.removeExpiredTimers();
      console.log('Clean timers task completed successfully');
    } catch (error) {
      console.error('Error in clean timers task:', error);
    }
  }, {
    timezone: "Europe/Amsterdam" // Adjust to your timezone
  });
  
  console.log('Clean timers cron job scheduled');
}

module.exports = { initCleanTimersScheduler };