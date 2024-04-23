process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const stage = process.env.STAGE || 'local';
let envConfig: object;

if (stage === 'production') {
  envConfig = (await import('./production.js')).default;
} else if (stage === 'test' || process.env.NODE_ENV === 'test') {
  envConfig = (await import('./test.js')).default;
} else {
  // stage === 'local'
  envConfig = (await import('./development.js')).default;
}

const defaultConfig = {
  stage,
  env: process.env.NODE_ENV,
  port: 3000,
  secrets: {
    dbUrl: process.env.DATABASE_URL,
    jwt: process.env.JWT_SECRET,
  },
};

const config = {
  ...defaultConfig,
  ...envConfig,
};

export default config;
