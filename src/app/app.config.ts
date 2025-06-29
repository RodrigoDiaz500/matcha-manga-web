// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // ¡IMPORTANTE: Añadir si haces llamadas HTTP!
// import { provideForms } from '@angular/forms'; // YA NO ES NECESARIO para componentes standalone

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), // Habilita el módulo HttpClient
    // provideForms() // Ya no es necesario, FormsModule se importa en los componentes
  ]
};