import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogSesionAdminGuard } from '../core/guards/log-sesion-admin.guard';
import { SesionGuard } from '../core/guards/sesion.guard';
import { LayoutComponent } from '../shared/layout/layout.component';
import { AraizaDiamanteComponent } from './araiza-diamante/araiza-diamante.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ImageComponent } from './image/image.component';
import { InicioComponent } from './inicio.component';
import { GaleriaMultiComponent } from './opcion-config/galeria-multi/galeria-multi.component';
import { ImagenVideoComponent } from './opcion-config/imagen-video/imagen-video.component';
import { NoticiaComponent } from './opcion-config/noticia/noticia.component';
import { OpcionMenuComponent } from './opcion-menu/opcion-menu.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children:
    [
      { path: '', canActivate: [SesionGuard], component: InicioComponent } ,
      { path: 'general', canActivate: [SesionGuard], component: InicioComponent },
      { path: 'mexicali', canActivate: [SesionGuard], component: OpcionMenuComponent },
      { path: 'calafia', canActivate: [SesionGuard], component: OpcionMenuComponent },
      { path: 'sanLuis', canActivate: [SesionGuard], component: OpcionMenuComponent },
      { path: 'palmira', canActivate: [SesionGuard], component: OpcionMenuComponent },
      { path: 'hermosillo', canActivate: [SesionGuard], component: OpcionMenuComponent },
      { path: 'bookings', canActivate: [SesionGuard], component: BookingsComponent },
      { path: 'araiza-diamante', canActivate: [SesionGuard], component: AraizaDiamanteComponent },
      //ver imagen usuarios
      { path: 'imagen-compartida', canActivate: [SesionGuard], component: ImageComponent },
      //Sesion para el admin
      { path: 'slider',canActivate: [LogSesionAdminGuard], component: ImagenVideoComponent},
      { path: 'noticias',canActivate: [LogSesionAdminGuard], component: NoticiaComponent},
      { path: 'menu',canActivate: [LogSesionAdminGuard], component: ImagenVideoComponent},
      { path: 'cumpleanos',canActivate: [LogSesionAdminGuard], component: ImagenVideoComponent},
      { path: 'aniversario',canActivate: [LogSesionAdminGuard], component: ImagenVideoComponent},
      { path: 'empleado-del-mes',canActivate: [LogSesionAdminGuard], component: ImagenVideoComponent},
      { path: 'galeriaMulti',canActivate: [LogSesionAdminGuard], component: GaleriaMultiComponent},
      { path: 'usuarios',canActivate: [LogSesionAdminGuard], component: UsuariosComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
