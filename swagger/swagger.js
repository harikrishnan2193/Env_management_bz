const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0", // OpenAPI version
  info: {
    title: "My API", // API title
    version: "1.0.0", // API version
    description: "API documentation for my project", // API description
  },
  servers: [
    {
      url: "http://localhost:3000", // API server
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to your API routes
};

// Generate Swagger spec
const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerUi };
