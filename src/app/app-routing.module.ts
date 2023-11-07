import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAdminComponent } from './auth/login-admin/login-admin.component';
import { LoginComponent } from './auth/login/login.component';
import { InicioGuard } from './core/guards/inicio.guard';
import { ErrorComponent } from './error/error.component';
import { ComentarComidaComponent } from './comentar-comida/comentar-comida.component';

const routes: Routes = [
  { path: 'general', loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioModule) },
  { path: 'login',canActivate: [InicioGuard], component: LoginComponent },
  { path: 'login_admin',canActivate: [InicioGuard], component: LoginAdminComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'rate_food/:hotel', component: ComentarComidaComponent },
  { path: '**',canActivate: [InicioGuard], component: LoginComponent },      //
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule],

})
export class AppRoutingModule { }
