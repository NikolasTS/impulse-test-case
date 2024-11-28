import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

/**
 * @description Main configuration for the application
 */
export async function mainConfig(app: INestApplication) {
  app.use(helmet());

  app.enableCors({
    origin: '*',
    methods: 'GET',
    allowedHeaders: ['Content-Type'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableShutdownHooks();
}
