import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { json } from 'express';
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)
	
	app.use(json({ limit: '10mb' }));

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Authentication endpoints')
    .setVersion('1.0')
	.addBearerAuth()
    .build();

  	const document = SwaggerModule.createDocument(app, swaggerConfig);
  	SwaggerModule.setup('api', app, document);

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});

