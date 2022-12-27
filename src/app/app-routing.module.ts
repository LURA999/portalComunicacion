import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAdminComponent } from './auth/login-admin/login-admin.component';
import { LoginComponent } from './auth/login/login.component';
import { InicioGuard } from './core/guards/inicio.guard';

const routes: Routes = [
  { path: 'general', loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioModule) },
  { path: 'login',canActivate: [InicioGuard], component: LoginComponent },
  { path: 'login_admin',canActivate: [InicioGuard], component: LoginAdminComponent },
  { path: '**',canActivate: [InicioGuard], component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
