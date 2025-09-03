const { CallWebhook_RemoveExpiredRecords } = require("../league-of-letters-api-webhooks");

const cron = require('node-cron');

function initializeScheduler() {
  console.log('Initializing scheduler...');
  
  // Run at midnight every day (0 0 * * *)
  cron.schedule('0 0 * * *', async () => {
    console.log('Midnight task started at:', new Date().toISOString());
    
    try {
      await executeMidnightTask();
      console.log('Midnight task completed successfully');
    } catch (error) {
      console.error('Error in midnight task:', error);
    }
  }, {
    timezone: "Europe/Amsterdam" // Adjust to your timezone
  });
  
  console.log('Midnight cron job scheduled');
}

async function executeMidnightTask() {
  console.log('Executing CallWebhook_RemoveExpiredRecords');
  
  try {
    await CallWebhook_RemoveExpiredRecords();
    
    if (response.ok) {
      console.log('Successfully called webhook endpoint CallWebhook_RemoveExpiredRecords');
    } else {
      console.error(`Failed to trigger webhook 'CallWebhook_RemoveExpiredRecords'`, response.status);
    }
  } catch (error) {
    console.error('Error triggering webhook CallWebhook_RemoveExpiredRecords:', error);
  }
}

module.exports = { initializeScheduler };