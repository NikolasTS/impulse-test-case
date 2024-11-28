import { registerAs } from '@nestjs/config';

/**
 * @description - Configuration for Probation API.
 */
export default registerAs('probationApi', () => {
  const probationApiUrl = process.env.PROBATION_API_URL;
  const probationApiKey = process.env.PROBATION_API_KEY;

  if (!probationApiUrl || !probationApiKey) {
    throw new Error('PROBATION_API_URL or PROBATION_API_KEY is not set');
  }

  return {
    url: probationApiUrl,
    key: probationApiKey,
  };
});
