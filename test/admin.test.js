const request = require('supertest')
const cds = require('@sap/cds')
const { readCSV, setup } = require('./utils')


const HTTP_SUCCESS = 200
const HTTP_CREATED = 201
const HTTP_NO_CONTENT = 204
const HTTP_FORBIDDEN = 403
const HTTP_UNAUTHORIZED = 401

const get = (path) => request(app).get(path).auth('admin', '')
const post = (path) => request(app).post(path).auth('admin', '')
const put = (path) => request(app).put(path).auth('admin', '')
const del = (path) => request(app).delete(path).auth('admin', '')

beforeAll(async () => {
  await setup()
})

afterAll(async () => {
  const files = await readCSV()
  await Promise.all(files.map(async (f) => cds.run(DELETE.from(f.table))))
  await cds.disconnect()
})

beforeEach(async () => {
  const files = await readCSV()
  await Promise.all(files.map(async (f) => cds.run(DELETE.from(f.table))))
  await Promise.all(files.map(async (f) => cds.run(INSERT.into(f.table).columns(f.columns).rows(f.rows))))
})

describe('AdminService', () => {
  describe('GET /$metadata', () => {
    test('contains exactly 5 services', async () => {
      return get('/admin')
        .expect('Content-Type', /^application\/json/)
        .expect(HTTP_SUCCESS)
        .then((response) => {
          expect(response.body.value.length).toEqual(5)
          expect(response.body.value).toContainEqual({ name: 'Orders', url: 'Orders' })
          expect(response.body.value).toContainEqual({ name: 'OrderItems', url: 'OrderItems' })
          expect(response.body.value).toContainEqual({ name: 'Orders', url: 'Orders' })
        })
    })

    test('contains metadata for oData V4', async () => {
      return get('/admin/$metadata')
        .expect('Content-Type', /^application\/xml/)
        .expect(HTTP_SUCCESS)
        .then((response) => {
          expect(response.text).toMatch(/version="4\.0"/i)
        })
    })
  })

  describe('Orders entity', () => {
    describe('GET /Orders', () => {
      const fields = 'ID;customer_ID;description;createdAt;createdBy;modifiedAt;modifiedBy'

      test(`returns SUCCESS (${HTTP_SUCCESS}) for someone who is logged on and has the "admin" role`, async () => {
        return get('/admin/Orders').expect(HTTP_SUCCESS)
      })

      test(`returns UNAUTHORIZED (${HTTP_UNAUTHORIZED}) for someone who is not logged in`, async () => {
        return request(app).get('/admin/Orders').expect(HTTP_UNAUTHORIZED)
      })

      test(`returns FORBIDDEN (${HTTP_FORBIDDEN}) for someone who is logged in and does not have the "admin" role`, async () => {
        return request(app).get('/admin/Orders').auth('customer1', '').expect(HTTP_FORBIDDEN)
      })

      test(`contains only fields: ${fields}`, async () => {
        return get('/admin/Orders')
          .expect('Content-Type', /^application\/json/)
          .expect(HTTP_SUCCESS)
          .then((response) => {
            expect(Object.keys(response.body.value[0]).sort()).toEqual(fields.split(';').sort())
          })
      })

      test(`returns all rows for an admin`, async () => {
        return get('/admin/Orders')
          .expect('Content-Type', /^application\/json/)
          .expect(HTTP_SUCCESS)
          .then((response) => {
            expect(response.body.value.length).toEqual(8)
          })
      })
    })

    describe('GET /Orders(<id>)', () => {
      test(`returns an entry by key`, async () => {
        return get('/admin/Orders(485a13bb-a707-4454-9514-3678ef03a332)')
          .expect('Content-Type', /^application\/json/)
          .expect(HTTP_SUCCESS)
          .then((response) => {
            expect(response.body).toEqual({
              '@odata.context': '$metadata#Orders/$entity',
              ID: '485a13bb-a707-4454-9514-3678ef03a332',
              createdAt: '2021-01-01T00:00:00.000Z',
              createdBy: 'admin',
              modifiedAt: '2021-01-01T00:00:00.000Z',
              modifiedBy: 'admin',
              description: 'Another order 6',
              customer_ID: 'fc2888ac-81f8-480a-a4d2-f66276e8aea5'
            })
          })
      })

      test(`can expand on "items" and "customer"`, async () => {
        return get('/admin/Orders(485a13bb-a707-4454-9514-3678ef03a332)?$expand=items,customer')
          .expect('Content-Type', /^application\/json/)
          .expect(HTTP_SUCCESS)
          .then((response) => {
            expect(response.body).toEqual(
              expect.objectContaining({
                '@odata.context': '$metadata#Orders(items(),customer())/$entity',
                customer: expect.any(Object),
                items: expect.any(Array)
              })
            )
          })
      })
    })

    describe('CREATE /Orders', () => {
      test(`returns FORBIDDEN (${HTTP_FORBIDDEN}) when an admin tries to create an entry`, async () => {
        return post('/admin/Orders')
          .send({
            customer_ID: 'fc2888ac-81f8-480a-a4d2-f66276e8aea5',
            description: 'One more for testing'
          })
          .expect(HTTP_FORBIDDEN)
      })
    })

    describe('UPDATE /Orders(<id>)', () => {
      test(`returns FORBIDDEN (${HTTP_FORBIDDEN}) when an admin tries to update an entry`, async () => {
        return put('/admin/Orders(485a13bb-a707-4454-9514-3678ef03a332)')
          .send({
            description: 'One more for testing 2'
          })
          .expect(HTTP_FORBIDDEN)
      })
    })

    describe('DELETE /Orders(<id>)', () => {
      test(`returns FORBIDDEN (${HTTP_FORBIDDEN}) when an admin tries to delete an entry`, async () => {
        return del('/admin/Orders(485a13bb-a707-4454-9514-3678ef03a332)').expect(HTTP_FORBIDDEN)
      })
    })
  })

  describe('OrderItems entity', () => {
    describe('GET /OrderItems', () => {
      const fields = 'ID;order_ID;item;quantity;price;currency_code;createdAt;createdBy;modifiedAt;modifiedBy;customer_ID'

      test(`returns SUCCESS (${HTTP_SUCCESS}) for someone who is logged on and has the "admin" role`, async () => {
        return get('/admin/OrderItems').expect(HTTP_SUCCESS)
      })

      test(`returns UNAUTHORIZED (${HTTP_UNAUTHORIZED}) for someone who is not logged in`, async () => {
        return request(app).get('/admin/OrderItems').expect(HTTP_UNAUTHORIZED)
      })

      test(`returns FORBIDDEN (${HTTP_FORBIDDEN}) for someone who is logged in and does not have the "admin" role`, async () => {
        return request(app).get('/admin/OrderItems').auth('customer1', '').expect(HTTP_FORBIDDEN)
      })

      test(`contains only fields: ${fields}`, async () => {
        return get('/admin/OrderItems')
          .expect('Content-Type', /^application\/json/)
          .expect(HTTP_SUCCESS)
          .then((response) => {
            expect(Object.keys(response.body.value[0]).sort()).toEqual(fields.split(';').sort())
          })
      })

      test(`returns all rows for an admin`, async () => {
        return get('/admin/OrderItems')
          .expect('Content-Type', /^application\/json/)
          .expect(HTTP_SUCCESS)
          .then((response) => {
            expect(response.body.value.length).toEqual(31)
          })
      })
    })

    describe('GET /OrderItems(<id>)', () => {
      test(`returns an entry by key`, async () => {
        return get('/admin/OrderItems(13fba18a-8bce-497a-aa4a-7e9b8ccf9b58)')
          .expect('Content-Type', /^application\/json/)
          .expect(HTTP_SUCCESS)
          .then((response) => {
            expect(response.body).toEqual({
              '@odata.context': '$metadata#OrderItems/$entity',
              ID: '13fba18a-8bce-497a-aa4a-7e9b8ccf9b58',
              createdAt: '2021-01-01T00:00:00.000Z',
              createdBy: 'admin',
              modifiedAt: '2021-01-01T00:00:00.000Z',
              modifiedBy: 'admin',
              order_ID: '53fba18a-8bce-497a-aa4a-7e9b8ccf9b58',
              item: 'Cucumbers',
              quantity: 1,
              price: 3.99,
              currency_code: 'AUD',
              customer_ID: 'fc2888ac-81f8-480a-a4d2-f66276e8aea5'
            })
          })
      })

      test(`can expand on "order", "currency" and "customer"`, async () => {
        return get('/admin/OrderItems(13fba18a-8bce-497a-aa4a-7e9b8ccf9b58)?$expand=order,customer,currency')
          .expect('Content-Type', /^application\/json/)
          .expect(HTTP_SUCCESS)
          .then((response) => {
            expect(response.body).toEqual(
              expect.objectContaining({
                '@odata.context': '$metadata#OrderItems(order(),customer(),currency())/$entity',
                customer: expect.any(Object),
                order: expect.any(Object)
              })
            )
          })
      })
    })

    describe('CREATE /OrderItems', () => {
      test(`returns FORBIDDEN (${HTTP_FORBIDDEN}) when an admin tries to create an entry`, async () => {
        return post('/admin/OrderItems').send({}).expect(HTTP_FORBIDDEN)
      })
    })

    describe('UPDATE /OrderItems(<id>)', () => {
      test(`returns FORBIDDEN (${HTTP_FORBIDDEN}) when an admin tries to update an entry`, async () => {
        return put('/admin/OrderItems(13fba18a-8bce-497a-aa4a-7e9b8ccf9b58)').send({}).expect(HTTP_FORBIDDEN)
      })
    })

    describe('DELETE /OrderItems(<id>)', () => {
      test(`returns FORBIDDEN (${HTTP_FORBIDDEN}) when an admin tries to delete an entry`, async () => {
        return del('/admin/OrderItems(13fba18a-8bce-497a-aa4a-7e9b8ccf9b58)').expect(HTTP_FORBIDDEN)
      })
    })
  })

  describe('Customers entity', () => {
    describe('GET /Customers', () => {
      const fields = 'ID;name;createdAt;createdBy;modifiedAt;modifiedBy'

      test(`returns SUCCESS (${HTTP_SUCCESS}) for someone who is logged on and has the "admin" role`, async () => {
        return get('/admin/Customers').expect(HTTP_SUCCESS)
      })

      test(`returns UNAUTHORIZED (${HTTP_UNAUTHORIZED}) for someone who is not logged in`, async () => {
        return request(app).get('/admin/Customers').expect(HTTP_UNAUTHORIZED)
      })

      test(`returns FORBIDDEN (${HTTP_FORBIDDEN}) for someone who is logged in and does not have the "admin" role`, async () => {
        return request(app).get('/admin/Customers').auth('customer1', '').expect(HTTP_FORBIDDEN)
      })

      test(`contains only fields: ${fields}`, async () => {
        return get('/admin/Customers')
          .expect('Content-Type', /^application\/json/)
          .expect(HTTP_SUCCESS)
          .then((response) => {
            expect(Object.keys(response.body.value[0]).sort()).toEqual(fields.split(';').sort())
          })
      })

      test(`returns all rows for an admin`, async () => {
        return get('/admin/Customers')
          .expect('Content-Type', /^application\/json/)
          .expect(HTTP_SUCCESS)
          .then((response) => {
            expect(response.body.value.length).toEqual(2)
          })
      })
    })

    describe('GET /Customers(<id>)', () => {
      test(`returns an entry by key`, async () => {
        return get('/admin/Customers(fc2888ac-81f8-480a-a4d2-f66276e8aea5)')
          .expect('Content-Type', /^application\/json/)
          .expect(HTTP_SUCCESS)
          .then((response) => {
            expect(response.body).toEqual({
              '@odata.context': '$metadata#Customers/$entity',
              ID: 'fc2888ac-81f8-480a-a4d2-f66276e8aea5',
              createdAt: '2021-01-01T00:00:00.000Z',
              createdBy: 'admin',
              modifiedAt: '2021-01-01T00:00:00.000Z',
              modifiedBy: 'admin',
              name: 'Veggies Inc'
            })
          })
      })

      test(`can expand on "orders"`, async () => {
        return get('/admin/Customers(fc2888ac-81f8-480a-a4d2-f66276e8aea5)?$expand=orders')
          .expect('Content-Type', /^application\/json/)
          .expect(HTTP_SUCCESS)
          .then((response) => {
            expect(response.body).toEqual(
              expect.objectContaining({
                '@odata.context': '$metadata#Customers(orders())/$entity',
                orders: expect.any(Array)
              })
            )
          })
      })
    })

    describe('CREATE /Customers', () => {
      test(`returns CREATED (${HTTP_CREATED}) when an admin tries to create an entry`, async () => {
        return post('/admin/Customers')
          .send({
            name: 'One more for testing'
          })
          .expect(HTTP_CREATED)
      })
    })

    describe('UPDATE /Customers(<id>)', () => {
      test(`returns SUCCESS (${HTTP_SUCCESS}) when an admin tries to update an entry`, async () => {
        return put('/admin/Customers(fc2888ac-81f8-480a-a4d2-f66276e8aea5)')
          .send({
            name: 'One more for testing 2'
          })
          .expect(HTTP_SUCCESS)
      })
    })

    describe('DELETE /Customers(<id>)', () => {
      test(`returns NO CONTENT (${HTTP_NO_CONTENT}) when an admin tries to delete an entry`, async () => {
        return del('/admin/Customers(fc2888ac-81f8-480a-a4d2-f66276e8aea5)').expect(HTTP_NO_CONTENT)
      })
    })
  })
})
