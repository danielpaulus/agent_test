import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { app } from './slackbot/app';
async function bootstrap() {
  app.error(async (error) => {
    // Check the details of the error to handle cases where you should retry sending a message or stop the app
    console.error(error);
  });
  console.log(process.env.NODE_ENV);
  (async () => {
    if (process.env.SLACKBOT_ENABLE === 'true') {
      await app.start();
      console.log('⚡️ Bolt app is running!');
    } else {
      console.log('Slackbot not started in production');
    }
  })();

  const app1 = await NestFactory.create(AppModule);
  app1.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to match DTO types
      whitelist: true, // Remove properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw error when unknown properties are found
      transformOptions: {
        enableImplicitConversion: true, // This allows automatic type conversion
      },
    }),
  );
  app1.useGlobalFilters(new HttpExceptionFilter());
  await app1.listen(3000);
}
bootstrap();
