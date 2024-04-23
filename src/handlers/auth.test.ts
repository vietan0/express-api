import request from 'supertest';
import { afterAll, beforeAll, expect, test, vi } from 'vitest';

import resetDb from '../db/resetDb.js';
import app from '../server.js';

beforeAll(async () => {
  await resetDb();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(async () => {
  await resetDb();
  vi.restoreAllMocks();
});

const credentials = {
  email: 'test@gmail.com',
  password: '1',
};

async function sendSignUpRequest() {
  return await request(app).post('/signup').send(credentials);
}

test('sign up should create new user', async () => {
  const signUpRes = await sendSignUpRequest();

  expect(signUpRes.body).toEqual({
    token: expect.any(String),
  });
});

test('sign up should error if user exists', async () => {
  let res;
  res = await sendSignUpRequest();
  res = await sendSignUpRequest();
  expect(res.status).toEqual(400);

  expect(res.body).toMatchObject({
    message: 'Error caught by me',
    err: {
      code: 'P2002',
    },
  });
});

test('sign in should work with existing user', async () => {
  await sendSignUpRequest();
  const res = await request(app).post('/signin').send(credentials);
  expect(res.status).toEqual(200);

  expect(res.body).toEqual({
    token: expect.any(String),
  });
});

test('sign in should error if password is incorrect', async () => {
  await sendSignUpRequest();

  const res = await request(app)
    .post('/signin')
    .send({
      ...credentials,
      password: '2',
    });

  expect(res.status).toEqual(401);
  expect(res.body).toEqual({ message: 'Incorrect password' });
});

test('sign in should error if user not exist', async () => {
  const res = await request(app)
    .post('/signin')
    .send({
      ...credentials,
      email: 'notexist@gmail.com',
    });

  expect(res.status).toEqual(401);
  expect(res.body).toEqual({ message: "Email doesn't exist" });
});
