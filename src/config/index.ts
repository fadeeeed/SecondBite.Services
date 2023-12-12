import { config } from 'dotenv';

config({ path: `.env` });

export const { NODE_ENV, PORT, X_API_KEY } = process.env;

export const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } = process.env;
