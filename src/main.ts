import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // To validate incoming request body
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

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
