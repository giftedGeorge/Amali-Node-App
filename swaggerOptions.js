const swaggerJSDoc = require('swagger-jsdoc');
const port = process.env.PORT || 5000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Amali Mobile App',
      version: '1.0.0',
      description: 'API documentation for the Amali Mobile App project',
    },
  },
  // API routes
  servers: [`http://localhost:${port}`],
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
