declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string | undefined;
    PORT: string | undefined;
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}
