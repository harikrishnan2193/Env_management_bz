const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
    description: "API documentation for my project",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
};

// options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

// generate Swagger spec
const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerUi };
