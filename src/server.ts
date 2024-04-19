import morgan from 'morgan';
import express, { ErrorRequestHandler } from 'express';
import router from './router.js';
import { protect } from './modules/auth.js';
import { createUser, signIn } from './handlers/user.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});
app.use('/api', protect, router);
app.post('/user', createUser);
app.post('/signin', signIn);

const errHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log('Caught by me:', err);
  res.status(400).json({ message: 'Error Caught by Me!', err, user: req.user });
};
app.use(errHandler);

export default app;
