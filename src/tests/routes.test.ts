import request from 'supertest';
import { expect, test } from 'vitest';

import app from '../server.js';

test('GET / should send back data', async () => {
  const res = await request(app).get('/');
  expect(res.body.message).toBe('hello');
});
