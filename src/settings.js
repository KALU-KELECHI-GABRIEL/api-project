import dotenv from 'dotenv';

dotenv.config();
export const testEnvironmentVariable = process.env.TEST_ENV_VARIABLE;
export const connectionString = process.env.CONNECTION_STRING;
export const secret = process.env.SECRET;
export const email = process.env.EMAIL;
export const password = process.env.PASSWORD;
export const emailGmail = process.env.EMAIL_GMAIL;
export const passwordGmail = process.env.PASSWORD_GMAIL;
