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

// ¡NUEVAS IMPORTACIONES!
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mangas', component: MangasComponent },
  { path: 'comics', component: ComicsComponent },
  { path: 'perfil', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'simulated-payment', component: SimulatedPaymentComponent },
  // ¡NUEVAS RUTAS!
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent }, // Esta ruta esperará un queryParam 'email'

  // Si no tienes una página de catálogo dedicada, 'home' puede ser el catálogo principal
  // { path: 'catalogo', component: HomeComponent }, // Si usas una ruta /catalogo
  // { path: '', redirectTo: '/catalogo', pathMatch: 'full' }, // Si Home es el catálogo y quieres redirigir
  { path: '**', redirectTo: '' } // Ruta comodín para cualquier otra URL no definida, redirige al inicio
];