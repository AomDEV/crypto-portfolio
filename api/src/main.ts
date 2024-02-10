import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();

	app.enableVersioning({
		type: VersioningType.URI,
	});

	const config = new DocumentBuilder()
		.setTitle('Crypto Portfolio API')
		.setDescription('Crypto Portfolio API')
		.setVersion('1.0')
		.addTag('crypto')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(3000);
}
bootstrap();
