import express, { ErrorRequestHandler } from 'express';
import morgan from 'morgan';

import { signIn, signUp } from './handlers/auth.js';
import { protect } from './modules/auth.js';
import router from './router.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    message: 'hello',
    routeDiagram:
      'https://www.figma.com/file/vitVh9gEJebizznm3B0SZj/express-api?type=whiteboard&node-id=0-1&t=XVxKiiprN6Qmc3Q1-0',
  });
});

app.use('/api', protect, router);
app.post('/signup', signUp);
app.post('/signin', signIn);

const errHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error(err);
  res.status(400).json({ message: 'Error caught by me', err, user: req.user });
};

app.use(errHandler);

export default app;
