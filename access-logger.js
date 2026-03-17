import swaggerUi from "swagger-ui-express";
import { buildOpenApiSpec } from "./swagger.js";

export function mountSwagger(app) {
  // OpenAPI JSON
  app.get("/openapi.json", (req, res) => {
    const spec = buildOpenApiSpec();
    res.json(spec);
  });

  // Swagger UI
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(buildOpenApiSpec(), {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
}