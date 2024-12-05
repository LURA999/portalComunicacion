import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAdminComponent } from './auth/login-admin/login-admin.component';
import { LoginComponent } from './auth/login/login.component';
import { InicioGuard } from './core/guards/inicio.guard';
import { ErrorComponent } from './error/error.component';
import { ComentarComidaComponent } from './comentar-comida/comentar-comida.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

const routes: Routes = [
  { path: 'menu', loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioModule) },
  { path: 'login',canActivate: [InicioGuard], component: LoginComponent },
  { path: 'login_admin',canActivate: [InicioGuard], component: LoginAdminComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'rate_food/:hotel', component: ComentarComidaComponent },
  { path: '**',canActivate: [InicioGuard], component: LoginComponent },      //
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers : [  
    { provide: LocationStrategy, useClass: PathLocationStrategy } // Usa el PathLocationStrategy
  ]

})
export class AppRoutingModule { }
