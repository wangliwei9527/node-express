const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'House API Documentation',
      version: '1.0.0',
      description: 'API Documentation for the house management system',
    },
  },
  apis: ['./routes/*.js'], // 指向路由文件位置
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
