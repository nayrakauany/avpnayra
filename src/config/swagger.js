const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Cadastro de Aviões',
      version: '1.0.0',
      description: 'API para cadastro de usuários, autenticação, CRUD de aviões e upload de imagens.'
    },
    servers: [{ url: 'http://localhost:3000' }]
  },
  apis: ['./src/**/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec
};
