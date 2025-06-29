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

// IMPORTANT: Ensure you have a component for simulated-payment.html.
// Assuming it's in src/app/components/simulated-payment/simulated-payment.component.ts
import { SimulatedPaymentComponent } from './pages/simulated-payment/simulated-payment.component'; // <--- IMPORT THIS!



export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mangas', component: MangasComponent },
  { path: 'comics', component: ComicsComponent },
  { path: 'perfil', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'simulated-payment', component: SimulatedPaymentComponent }, // <--- ADD THIS ROUTE!
  // Fallback routes
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' }, // Redirect to catalog by default
  { path: '**', redirectTo: '/catalogo' } // Wildcard for any unmatched routes
];

