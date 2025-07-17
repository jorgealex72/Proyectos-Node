// src/app.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config' ;
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AntifraudService } from './antifraud/antifraud.service';

@Module({
  imports: [
    // Configura ConfigModule para cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible globalmente
      envFilePath: '.env', // Especifica la ruta de tu archivo .env
    }),
    HttpModule.register({
      // Puedes configurar opciones globales para todas las solicitudes HTTP aquí si es necesario
      timeout: 5000, // Ejemplo: tiempo de espera de 5 segundos
      maxRedirects: 5, // Ejemplo: máximo de 5 redirecciones
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, AntifraudService],
  exports: [AuthService, AntifraudService], // Si otros módulos necesitarán estos servicios
})
export class AppModule {}
