import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from './swagger';
import { mainConfig } from './main.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await mainConfig(app);
  await swagger(app);

  await app.listen(3000);
}
bootstrap();
