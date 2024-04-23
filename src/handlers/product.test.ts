import request from 'supertest';
import { afterAll, beforeAll, expect, test, vi } from 'vitest';

import resetDb from '../db/resetDb.js';
import app from '../server.js';

let token: string;
let productId: string;
const productName = 'Hey';
const newProductName = 'Whazzapp';

beforeAll(async () => {
  await resetDb();

  const res = await request(app).post('/signup').send({
    email: 'test@gmail.com',
    password: '1',
  });

  token = res.body.token;
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(async () => {
  await resetDb();
  vi.restoreAllMocks();
});

test('create product', async () => {
  const res = await request(app)
    .post('/api/product')
    .send({ name: productName })
    .set('Authorization', `Bearer ${token}`);

  productId = res.body.data.id;
  expect(res.status).toEqual(200);

  expect(res.body.data).toEqual({
    id: expect.any(String),
    createdAt: expect.any(String),
    name: productName,
    belongsToId: expect.any(String),
  });
});

test('create product without name should error', async () => {
  const res = await request(app)
    .post('/api/product')
    .send({})
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(400);

  expect(res.body.errors[0]).toEqual({
    type: 'field',
    msg: 'Invalid value',
    path: 'name',
    location: 'body',
  });
});

test('read products', async () => {
  const res = await request(app)
    .get('/api/product')
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(200);
  expect(res.body.data.products.length).toBeGreaterThanOrEqual(1);
});

test('read product by id', async () => {
  const res = await request(app)
    .get(`/api/product/${productId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(200);

  expect(res.body).toEqual({
    data: {
      id: expect.any(String),
      createdAt: expect.any(String),
      name: productName,
      belongsToId: expect.any(String),
    },
  });
});

test('update product', async () => {
  const res = await request(app)
    .put(`/api/product/${productId}`)
    .send({ name: newProductName })
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(200);

  expect(res.body).toEqual({
    data: {
      id: expect.any(String),
      createdAt: expect.any(String),
      name: newProductName,
      belongsToId: expect.any(String),
    },
  });
});

test('update product without name should error', async () => {
  const res = await request(app)
    .put(`/api/product/${productId}`)
    .send({})
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(400);

  expect(res.body.errors[0]).toEqual({
    type: 'field',
    msg: 'Invalid value',
    path: 'name',
    location: 'body',
  });
});

test('delete product', async () => {
  const res = await request(app)
    .delete(`/api/product/${productId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(200);

  expect(res.body).toEqual({
    data: {
      id: expect.any(String),
      createdAt: expect.any(String),
      name: newProductName,
      belongsToId: expect.any(String),
    },
  });

  // read attempt should return null
  const readRes = await request(app)
    .get(`/api/product/${productId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(readRes.body.data).toBeNull();
});
