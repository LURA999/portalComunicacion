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
import { InicioComponent } from './inicio.component';
import { MenuComponent } from './menu/menu.component';
import { EmpleadoDelMesComponent } from './opcion-config/empleado-mes-config/empleado-del-mes.component';
import { GaleriaMultiComponent } from './opcion-config/galeria-multi-config/galeria-multi.component';
import { ImagenVideoComponent } from './opcion-config/imagen-video-config/imagen-video.component';
import { MenuConfigComponent } from './opcion-config/menu-config/menu-config.component';
import { NoticiaComponent } from './opcion-config/noticia-config/noticia.component';
import { OpcionMenuComponent } from './principal/opcion-menu.component';
import { UsuariosComponent } from './opcion-config/usuarios-config/usuarios.component';
import { AutoCapacConfigComponente } from './opcion-config/autocapac-config/autocapac-config.component';
import { EmpleadoMesComponent } from './empleado-mes/empleado-mes.component';

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
      { path: 'araiza-diamante', canActivate: [SesionGuard], component: AraizaDiamanteComponent },
      { path: 'cumpleaneros',canActivate: [SesionGuard], component: CumpleanerosComponent},
      { path: 'aniversarios',canActivate: [SesionGuard], component: AniversariosComponent},
      { path: 'menu',canActivate: [SesionGuard], component: MenuComponent},
      { path: 'historial-noticias',canActivate: [SesionGuard], component: HistorialNoticiasComponent},
      { path: 'empleado-mes',canActivate: [SesionGuard], component: EmpleadoMesComponent},
      //Sesion para el admin
      { path: 'slider-config',canActivate: [LogSesionAdminGuard], component: ImagenVideoComponent},
      { path: 'noticias-config',canActivate: [LogSesionAdminGuard], component: NoticiaComponent},
      { path: 'menu-config',canActivate: [LogSesionAdminGuard], component: MenuConfigComponent},
      { path: 'empleado-mes-config',canActivate: [LogSesionAdminGuard], component: EmpleadoDelMesComponent},
      { path: 'galeriaMulti-config',canActivate: [LogSesionAdminGuard], component: GaleriaMultiComponent},
      { path: 'usuarios-config',canActivate: [LogSesionAdminGuard], component: UsuariosComponent },
      { path: 'autocapac-config',canActivate: [LogSesionAdminGuard], component: AutoCapacConfigComponente },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
