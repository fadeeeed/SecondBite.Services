/**
 * Imports dotenv and configures it to load environment variables from .env file.
 * Exports environment variables from process.env as constants.
 */
import { config } from 'dotenv';

config({ path: `.env` });

export const { NODE_ENV, PORT, X_API_KEY } = process.env;

export const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } = process.env;
