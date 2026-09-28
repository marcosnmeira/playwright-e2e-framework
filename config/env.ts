import dotenv from 'dotenv';

dotenv.config();

export const env = {
  baseUrl: process.env.BASE_URL ?? 'http://127.0.0.1:3000',
  defaultUserEmail: process.env.DEFAULT_USER_EMAIL ?? 'qa@example.com',
  defaultUserPassword: process.env.DEFAULT_USER_PASSWORD ?? 'Secret123!',
} as const;
