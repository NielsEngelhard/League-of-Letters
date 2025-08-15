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
      body: JSON.stringify(data), // Fixed: was using 'request' instead of the actual data    
    });          
    
    return response.ok;   
  } catch (error) {     
    console.log(`error calling webhook ` + error);
    return false;   
  } 
}  

async function CallWebhook_PlayerDisconnected(gameId, userId) {     
  await CallWebhook("player-disconnected", {             
      gameId: gameId,             
      userId: userId         
    }); 
} 

// Export using CommonJS
module.exports = {
  CallWebhook_PlayerDisconnected
};