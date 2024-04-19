import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Prisma } from '@prisma/client';
import { test, expect } from 'vitest';
import app from '../server.js';
import request from 'supertest';
import { createUser, signIn } from '../handlers/user.js';

test('GET / should send back data', async () => {
  const res = await request(app).get('/');
  expect(res.body.message).toBe('hello');
});
