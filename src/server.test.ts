import request from 'supertest';
import { expect, test } from 'vitest';

import app from './server.js';

test('baseUrl return message and figjam url', async () => {
  const res = await request(app).get('/');

  expect(res.status).toEqual(200);
  expect(res.headers['content-type']).toMatch(/json/);

  expect(res.body).toMatchObject({
    message: 'hello',
    routeDiagram: expect.stringMatching(/figma/),
  });
});
