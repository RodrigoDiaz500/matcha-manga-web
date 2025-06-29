// src/app/app.routes.ts
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MangasComponent } from './pages/mangas/mangas.component';
import { ComicsComponent } from './pages/comics/comics.component';
import { ProfileComponent } from './pages/profile/profile.component';

import { authGuard } from './guards/auth.guard';

import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './guards/admin.guard';
import { Routes } from '@angular/router';

import { SimulatedPaymentComponent } from './pages/simulated-payment/simulated-payment.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Tu página de inicio
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mangas', component: MangasComponent },
  { path: 'comics', component: ComicsComponent },
  { path: 'perfil', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'simulated-payment', component: SimulatedPaymentComponent },
  
  // ¡¡¡CAMBIO ABSOLUTAMENTE CRÍTICO AQUÍ!!!
  // ELIMINA la línea problemática anterior
  // Y AÑADE esta última línea para manejar rutas no encontradas de forma segura:
  { path: '**', redirectTo: '/', pathMatch: 'full' } // Redirige CUALQUIER ruta no definida a la raíz
];