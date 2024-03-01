import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

let server: Handler;

function setupSwagger(nestApp: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Sample API')
    .setDescription('Sample API Documentation')
    .setVersion('0.0.1')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();

  const document = SwaggerModule.createDocument(nestApp, config);

  SwaggerModule.setup('/api/docs', nestApp, document, {
    customSiteTitle: 'Sample',
    swaggerOptions: {
      docExpansion: 'none',
      operationSorter: 'alpha',
      tagSorter: 'alpha',
    },
  });
}

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  setupSwagger(app);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  event.path = `${event.path}/`;
  event.path = event.path.includes('swagger-ui')
    ? `swagger${event.path}`
    : event.path;

  server = server ?? (await bootstrap());

  return server(event, context, callback);
};