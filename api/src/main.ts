import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, VersioningType } from '@nestjs/common';
import { json } from 'express';

declare const module: any;
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();

	app.enableVersioning({
		type: VersioningType.URI,
	});
	app.enableShutdownHooks();
	app.use(json({ limit: '5mb' }));

	const config = new DocumentBuilder()
		.setTitle('Crypto Portfolio API')
		.setDescription('Crypto Portfolio API')
		.setVersion('1.0')
		.addTag('crypto')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	const PORT = process.env.PORT || 3000;
	await app.listen(PORT).then(() => {
		new Logger('Bootstrap').log(`Server is running on port ${PORT}`);
	});
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap();
