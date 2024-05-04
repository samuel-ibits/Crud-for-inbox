const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const options = {
  explorer: true,
};

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
};

module.exports = swaggerDocs;