import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogSesionAdminGuard } from '../core/guards/log-sesion-admin.guard';
import { SesionGuard } from '../core/guards/sesion.guard';
import { LayoutComponent } from '../shared/layout/layout.component';
import { AniversariosComponent } from './aniversarios/aniversarios.component';
import { AraizaDiamanteComponent } from './araiza-diamante/araiza-diamante.component';
import { BookingsComponent } from './bookings/bookings.component';
import { CumpleanerosComponent } from './cumpleaneros/cumpleaneros.component';
import { HistorialNoticiasComponent } from './historial-noticias/historial-noticias.component';
import { ImageComponent } from './image/image.component';
import { InicioComponent } from './inicio.component';
import { MenuComponent } from './menu/menu.component';
import { EmpleadoDelMesComponent } from './opcion-config/empleado-del-mes/empleado-del-mes.component';
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
      //para usuarios
      { path: '', canActivate: [SesionGuard], component: InicioComponent } ,
      { path: 'general', canActivate: [SesionGuard], component: InicioComponent },
      { path: 'mexicali', canActivate: [SesionGuard], component: OpcionMenuComponent },
      { path: 'calafia', canActivate: [SesionGuard], component: OpcionMenuComponent },
      { path: 'sanLuis', canActivate: [SesionGuard], component: OpcionMenuComponent },
      { path: 'palmira', canActivate: [SesionGuard], component: OpcionMenuComponent },
      { path: 'hermosillo', canActivate: [SesionGuard], component: OpcionMenuComponent },
      { path: 'bookings', canActivate: [SesionGuard], component: BookingsComponent },
      { path: 'imagen-compartida', canActivate: [SesionGuard], component: ImageComponent },
      { path: 'araiza-diamante', canActivate: [SesionGuard], component: AraizaDiamanteComponent },
      { path: 'cumpleaneros',canActivate: [SesionGuard], component: CumpleanerosComponent},
      { path: 'aniversarios',canActivate: [SesionGuard], component: AniversariosComponent},
      { path: 'menu',canActivate: [SesionGuard], component: MenuComponent},
      { path: 'historial-noticias',canActivate: [SesionGuard], component: HistorialNoticiasComponent},

      //Sesion para el admin
      { path: 'slider',canActivate: [LogSesionAdminGuard], component: ImagenVideoComponent},
      { path: 'noticias',canActivate: [LogSesionAdminGuard], component: NoticiaComponent},
      { path: 'menu',canActivate: [LogSesionAdminGuard], component: ImagenVideoComponent},
     /* { path: 'cumpleanos',canActivate: [LogSesionAdminGuard], component: ImagenVideoComponent},
      { path: 'aniversario',canActivate: [LogSesionAdminGuard], component: ImagenVideoComponent},*/
      { path: 'empleado-del-mes',canActivate: [LogSesionAdminGuard], component: EmpleadoDelMesComponent},
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
