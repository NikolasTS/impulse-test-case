import { registerAs } from '@nestjs/config';

/**
 * @description - Configuration for Database.
 */
export default registerAs('database', () => {
  const dbUrl = process.env.DB_URL;

  if (!dbUrl) {
    throw new Error('DB_URL is not set');
  }

  return {
    url: dbUrl,
  };
});
