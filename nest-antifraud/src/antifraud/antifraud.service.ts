// src/antifraud/antifraud.service.ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config'; // <-- Importa ConfigService

@Injectable()
export class AntifraudService {
  private readonly logger = new Logger(AntifraudService.name);
  private readonly apiUrl = 'http://10.36.132.127/apirest.php/antifraud_token';
  private readonly appToken: string; 

  // Tu App-Token. Considera usar variables de entorno para esto.
  //private readonly appToken = 'ozEPkUSZlHH9YZCDzrm2kJIjIAjLT7P7PJj6Tab0'; 
   
  // Ya no se necesitan las propiedades basicAuthUsername y basicAuthPassword aquí,
  // porque el endpoint antifraud_token es GET y se autentica con los tokens en el header.
  
  constructor(
    private readonly configService: ConfigService , // Inyectamos ConfigService aquí
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {
    this.appToken = this.configService.get<string>('APP_TOKEN')!;
  }

  /**
   * Obtiene el token antifraude de la API externa usando un método GET.
   * Requiere el session-token y el app-token en los encabezados.
   */
  async getAntifraudToken(): Promise<string> {
    this.logger.log(`Intentando obtener antifraud_token de: ${this.apiUrl} con método GET`);

    let sessionToken: string;
    try {
      sessionToken = await this.authService.getSessionToken();
      this.logger.debug(`Session-token obtenido para antifraud: ${sessionToken.substring(0, 5)}...`);
    } catch (error) {
      throw new InternalServerErrorException('No se pudo obtener un session-token válido para la validación antifraude.');
    }

    // Definimos los encabezados que se enviarán con la solicitud GET
    const headers = {
      'App-Token': this.appToken,       
      'Session-Token': sessionToken,     
      'Content-Type': 'application/json', 
    };

    try {
      // *** CAMBIO CLAVE: Usamos this.httpService.get en lugar de .post ***
      const antifraudToken = await firstValueFrom(
        this.httpService.get(this.apiUrl, { headers }).pipe( // Las llamadas GET no llevan cuerpo en el segundo parámetro
          map(res => {
            return res.data.token; 
          }),
          catchError((error: AxiosError) => {
            this.logger.error(`Error al obtener antifraud_token:`);
            if (error.response) {
              this.logger.error(`Status: ${error.response.status}`);
              this.logger.error(`Data: ${JSON.stringify(error.response.data)}`);
              this.logger.error(`Headers: ${JSON.stringify(error.response.headers)}`);
            } else if (error.request) {
              this.logger.error(`No se recibió respuesta del servidor. Request: ${error.request}`);
            } else {
              this.logger.error(`Error de configuración de la solicitud: ${error.message}`);
            }
            throw new InternalServerErrorException(`Error al comunicarse con la API antifraude: ${error.message}`);
          }),
        ),
      );

      if (!antifraudToken) {
        throw new InternalServerErrorException('No se recibió antifraud_token en la respuesta de la API.');
      }

      this.logger.log(`Antifraud token obtenido exitosamente: ${antifraudToken}`);
      return antifraudToken;

    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      this.logger.error(`Error inesperado en getAntifraudToken: ${error.message}`);
      throw new InternalServerErrorException('Error genérico al intentar obtener el antifraud_token.');
    }
  }
}