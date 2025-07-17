import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { AuthService } from './auth/auth.service' ;
import { AntifraudService } from './antifraud/antifraud.service'; // <--- Importa el nuevo servicio

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly authService: AuthService,
    private readonly antifraudService: AntifraudService, 
  ) {}

  async onModuleInit() {
    try {
      //const sessionToken = await this.authService.getSessionToken();
      //this.logger.debug('🎉 Sesión iniciada y session-token obtenido:', sessionToken);
      
      // Aquí puedes guardar el sessionToken para futuros usos
      // Por ejemplo, en una variable de clase o un servicio de estado

      // --- Ahora llamamos al AntifraudService ---
      const antifraudToken = await this.antifraudService.getAntifraudToken();
      //this.logger.debug('✅ Antifraud Token obtenido exitosamente:', antifraudToken);
      // Aquí puedes almacenar este antifraudToken para futuras operaciones de análisis.
      // Puedes añadir una propiedad a AntifraudService de forma similar a como lo hicimos con AuthService.

    } catch (error) {
        console.error('❌ Error al iniciar la sesión:', error.message);
    }
  
  }


  getHello(): string {
    return 'Hello World!';
  }
}
