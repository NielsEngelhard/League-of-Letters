async function CallWebhook(webhookPath, data) {   
  const url = `${process.env.WEBHOOK_URL}/${webhookPath}`;

  console.log(`Calling webhook with url '${url}'`);

  try {     
    const response = await fetch(url, {       
      method: 'POST',       
      headers: {         
        'Content-Type': 'application/json',         
        'API-KEY': process.env.WEBHOOK_API_KEY,       
      },       
      body: JSON.stringify(data),
    });          
    
    return response.ok;   
  } catch (error) {     
    console.log(`error calling webhook ` + error);
    return false;   
  } 
}  

async function CallWebhook_UpdatePlayerConnectionStatus(gameId, userId, connectionStatus) {     
  await CallWebhook("update-player-connection-status", {             
      gameId: gameId,             
      userId: userId,
      connectionStatus: connectionStatus      
    }); 
} 

// Export using CommonJS
module.exports = {
  CallWebhook_UpdatePlayerConnectionStatus
};