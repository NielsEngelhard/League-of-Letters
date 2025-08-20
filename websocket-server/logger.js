require('dotenv').config();

class Logger {
  static LogWebsocketTrigger(name, msg) {
    if (process.env.ENABLE_EXTENDED_LOGGING?.toLowerCase() != 'true') return;
    console.log(`WS_EVENT '${name}'. MSG: ${msg}`);
  }
}

module.exports = { Logger };
