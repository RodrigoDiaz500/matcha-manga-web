// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MangasComponent } from './pages/mangas/mangas.component';
import { ComicsComponent } from './pages/comics/comics.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth.guard'; // Asegúrate de tener este guard
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component'; // Asegúrate de tener este componente
import { adminGuard } from './guards/admin.guard'; // Asegúrate de tener este guard
import { SimulatedPaymentComponent } from './pages/simulated-payment/simulated-payment.component'; // Asegúrate de tener este componente

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Página de inicio por defecto
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mangas', component: MangasComponent },
  { path: 'comics', component: ComicsComponent },
  { path: 'perfil', component: ProfileComponent, canActivate: [authGuard] }, // Protegida por authGuard
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] }, // Protegida por ambos guards
  { path: 'simulated-payment', component: SimulatedPaymentComponent },
  // Ruta comodín para cualquier URL no definida, redirige a la página de inicio
  { path: '**', redirectTo: '' }
];