import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as fs from 'fs';

/**
 * @description Swagger configuration
 */
export async function swagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Impulse Test Case API')
    .setDescription('Tsarev Mykola Test Case API for Impulse')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    deepScanRoutes: true,
  });
  // fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('/api/docs', app, document);
}
