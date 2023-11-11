import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { Logger, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // For Headers
  app.enableCors();
  app.use(helmet());

  // For Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix('api');

  const PORT = config.get('PORT');
  await app.listen(PORT);
  logger.log(`Listening at Port ${PORT}`);
}
bootstrap();
