const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./gen/OpenAPI.json");


cds.on("bootstrap", async (app) => {
  // Swagger / OpenAPI

  app.get("/api/api-docs.json", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  app.use(
    "/api/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
    })
  );
});

module.exports = cds.server; // > delegate to default server.js