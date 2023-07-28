// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Your Express API Documentation",
      version: "1.0.0",
      description:
        "A comprehensive API documentation for your Node.js Express app",
    },
    servers: [
      {
        url: "http://localhost:5000", // Replace with your API base URL
      },
    ],
  },
  apis: ["./routers/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
