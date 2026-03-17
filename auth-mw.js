import swaggerJSDoc from "swagger-jsdoc";
import { components } from "./components/index.js";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Todo API",
      version: "1.0.0",
      description: "Todo API Documentation",
    },
    servers: [{ url: process.env.BASE_URL }],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Todos", description: "Todo endpoints" },
    ],
    components: {
      ...components,
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // trỏ tới nơi có JSDoc @openapi
  apis: [
    "./routers/*.js",
    "./routers/**/*.js",
  ],
};

export function buildOpenApiSpec() {
  return swaggerJSDoc(options);
}