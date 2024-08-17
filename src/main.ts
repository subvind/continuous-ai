import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './logger/custom-logger';

async function bootstrap() {
  const logger = new CustomLogger();
  const app = await NestFactory.create(AppModule, { logger });

  await app.listen(3000);
  logger.log('Application is running on: http://localhost:3000');

  process.on('SIGINT', async () => {
    CustomLogger.clearSTDOUT();
    process.exit();
  });
}
bootstrap();