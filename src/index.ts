import * as dotenv from 'dotenv';

import config from './config/index.js';
import app from './server.js';
dotenv.config();

app.listen(config.port, () => {
  console.log(`NODE_ENV`, process.env.NODE_ENV);
  console.log(`Hello on http://localhost:${config.port}`);
});
