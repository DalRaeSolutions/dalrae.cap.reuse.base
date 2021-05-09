const swaggerUi = require("swagger-ui-express");
const admin = require("./gen/admin.json");
const customer = require("./gen/customer.json");


cds.on("bootstrap", async (app) => {
  // Swagger / OpenAPI

  app.get("/api/admin.json", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(admin);
  });
  app.get("/api/customer.json", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(customer);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {
    explorer: true,
    swaggerOptions: {
      urls: [
        {
          url: '/api/admin.json',
          name: 'Admin'
        },
        {
          url: 'api/customer.json',
          name: 'Customer'
        }
      ]
    }
  }));
});

module.exports = cds.server; // > delegate to default server.js