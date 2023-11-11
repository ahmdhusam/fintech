import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors();
  app.use(
    helmet({
      xPoweredBy: false,
    }),
  );

  const PORT = config.get('PORT');
  await app.listen(PORT);

  logger.log(`Listening at Port ${PORT}`);
}
bootstrap();
