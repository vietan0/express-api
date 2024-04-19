import app from './server.js';
import config from './config/index.js';
import * as dotenv from 'dotenv';
dotenv.config();

app.listen(config.port, () => {
  console.log(`NODE_ENV`, process.env.NODE_ENV);
  console.log(`Hello on http://localhost:${config.port}`);
});
