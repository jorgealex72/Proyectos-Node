// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Obtiene el puerto de la variable de entorno PORT,
  // o usa 3000 si no está definida
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Aplicación ejecutándose en puerto: 4000`);
}
bootstrap();
