import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './_guards/auth.guard';
import { LoginGuard } from './_guards/login.guard';

export const routes: Routes = [
  { path: 'home', loadChildren: './home/home.module#HomeModule', canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './login/login.module#LoginModule', canActivate: [LoginGuard] },
  { path: '', redirectTo: '/home/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/home/dashboard', pathMatch: 'full' },
  // { path: '', redirectTo: '/auth/welcome', pathMatch: 'full' },


];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
