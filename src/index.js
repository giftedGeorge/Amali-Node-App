const express = require('express');
const ConnectToDb = require('./database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerOptions');
const routes = require('./routes');
const logger = require('./logger');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

async function StartServer (){
    await ConnectToDb();
    logger.info('Connected to database');

    app.use(cors());
    app.use(express.json());

    app.use('/api', routes);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.listen(port, () => {
        logger.info(`Server listening at http://localhost:${port}`);
    });
}

module.exports = StartServer;