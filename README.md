# Base project for CAP reuse PoC

This project features

- 3 entities: Orders, OrderItems and Customers
- 2 services: AdminService and CustomerService
- Security concepts: 
  - 2 roles with different capabilities
  - 3 users
    - admin: has access to the admin service, where it can READ all orders, all order items, and full CRUD on customers
    - customer1 and customer2: have access to the customer service, but are limited to their own orders
- Integration tests using Jest and Supertest
- Swagger UI for both services

## How to use

Clone this repository and `npm install`. After that:

- `npm run dev` to enter CDS watch mode
- `npm run debug` to run the app in debug mode for VSCode debugging
- `npm run start` to run in production mode
- `npm run test` for a one-off integration test with coverage
- `npm run test:watch` to run all integration tests in watch mode
- `npm build:openapi` to create new open api specs. Swagger UI can be accessed through path `/api-docs`