const pino = require('pino');
const logger = pino({
    timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;