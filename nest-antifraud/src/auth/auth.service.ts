// src/auth/auth.service.ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config'; // <-- Importa ConfigService
import { AxiosError } from 'axios'; // Importamos AxiosError para tipado de errores


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly apiUrl = 'http://10.36.132.127/apirest.php/initSession';

  // Propiedades para almacenar los valores de las variables de entorno
  // Ahora se inicializarán en el constructor usando ConfigService
  private readonly appToken: string; 
  private readonly basicAuthUsername: string; 
  private readonly basicAuthPassword: string;

  private currentSessionToken: string | null = null; // Para almacenar el session-token obtenido

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, // Inyectamos ConfigService aquí
  ) {
    // Obtenemos los valores de las variables de entorno una vez que el servicio es instanciado
    this.appToken = this.configService.get<string>('APP_TOKEN')!;
    this.basicAuthUsername = this.configService.get<string>('BASIC_AUTH_USERNAME')!;
    this.basicAuthPassword = this.configService.get<string>('BASIC_AUTH_PASSWORD')!;
  }


  async getSessionToken(): Promise<string> {
    // this.logger.log(`Intentando obtener session-token de: ${this.apiUrl}`);

    // Construir el string para Basic Auth
    // Formato: "username:password" codificado en Base64
    const credentials = `${this.basicAuthUsername}:${this.basicAuthPassword}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    const authorizationHeader = `Basic ${encodedCredentials}`;


    const headers = {
      'App-Token': this.appToken,
      'Content-Type': 'application/json', // Asegúrate de que el tipo de contenido sea el correcto si la API lo requiere
      'Authorization': authorizationHeader,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get(this.apiUrl, { headers }).pipe(
            map(res => {
                // Logs de depuración para la respuesta exitosa (código de estado 2xx)
                this.logger.debug('Respuesta completa de la API de sesión:');
                this.logger.debug('Status:', res.status);
                this.logger.debug('Data:', res.data);
                this.logger.debug('Headers:', res.headers);
                return res.data.session_token; // Retorna el objeto res completo para seguir la cadena
              }),
            catchError(error => {
                const errorMessage = error.response?.data || error.message;
                this.logger.error(`Error al obtener session-token: ${errorMessage}`);
                throw new InternalServerErrorException(`Error al comunicarse con la API de sesión: ${errorMessage}`);
            }),
        ),
      );

      if (!response) {
        throw new InternalServerErrorException('No se recibió session-token en la respuesta de la API.');
      }

      this.currentSessionToken = response as string; // Almacenamos el token para futuras solicitudes
      this.logger.log(`Session-token obtenido y almacenado exitosamente: ${this.currentSessionToken}`);
      return this.currentSessionToken!;

    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error; // Relanzar errores específicos de NestJS
      }
      //this.logger.error(`Error inesperado en getSessionToken: ${error.message}`);
      throw new InternalServerErrorException('Error genérico al intentar obtener el session-token.');
    }
  }
}