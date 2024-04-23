import request from 'supertest';
import { afterAll, beforeAll, expect, test, vi } from 'vitest';

import resetDb from '../db/resetDb.js';
import app from '../server.js';

let token: string;
let productId: string;
let updateId: string;
const productName = 'Product 1';
const newUpdateTitle = 'Whazzapp';

const updateCreateInput = {
  title: 'Add gels',
  body: '3 different kinds of gels: bouncy gel (blue), speed gel (orange), portal gel (white).',
  status: 'IN_PROGRESS',
  version: '0.1.0',
};

beforeAll(async () => {
  await resetDb();

  const signUpRes = await request(app).post('/signup').send({
    email: 'test@gmail.com',
    password: '1',
  });

  token = signUpRes.body.token;

  const createProductRes = await request(app)
    .post('/api/product')
    .send({ name: productName })
    .set('Authorization', `Bearer ${token}`);

  productId = createProductRes.body.data.id;
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(async () => {
  await resetDb();
  vi.restoreAllMocks();
});

test('create update', async () => {
  const res = await request(app)
    .post('/api/update')
    .send({ ...updateCreateInput, productId })
    .set('Authorization', `Bearer ${token}`);

  updateId = res.body.data.id;
  expect(res.status).toEqual(200);
  expect(res.body.data).toMatchObject(updateCreateInput);
});

test('create update without title should error', async () => {
  const res = await request(app)
    .post('/api/update')
    .send({})
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(400);

  expect(res.body.errors[0]).toEqual({
    type: 'field',
    msg: 'Invalid value',
    path: 'title',
    location: 'body',
  });
});

test('read updates', async () => {
  const res = await request(app)
    .get('/api/update')
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(200);
  expect(res.body.data.length).toBeGreaterThanOrEqual(1);
});

test('read update by id', async () => {
  const res = await request(app)
    .get(`/api/update/${updateId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(200);

  expect(res.body.data).toMatchObject({
    ...updateCreateInput,
    productId,
  });
});

test('update update', async () => {
  const res = await request(app)
    .put(`/api/update/${updateId}`)
    .send({ title: newUpdateTitle })
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(200);

  expect(res.body.data).toMatchObject({
    ...updateCreateInput,
    title: newUpdateTitle,
    productId,
  });
});

test('update update without any field should error', async () => {
  const res = await request(app)
    .put(`/api/update/${updateId}`)
    .send({})
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(400);

  expect(res.body).toEqual({
    message: 'Have to specify an update field',
  });
});

test('update update with invalid status should error', async () => {
  const res = await request(app)
    .put(`/api/update/${updateId}`)
    .send({ status: 'Hey' })
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(400);

  expect(res.body).toEqual({
    errors: [
      {
        type: 'field',
        value: 'Hey',
        msg: 'Invalid value',
        path: 'status',
        location: 'body',
      },
    ],
  });
});

test('delete update', async () => {
  const res = await request(app)
    .delete(`/api/update/${updateId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toEqual(200);

  expect(res.body.data).toMatchObject({
    ...updateCreateInput,
    title: newUpdateTitle,
    productId,
  });

  // read attempt should return null
  const readRes = await request(app)
    .get(`/api/update/${updateId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(readRes.body.data).toBeNull();
});
