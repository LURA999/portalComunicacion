import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';
import { OpcionMenuComponent } from './principal/opcion-menu.component';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './componentes/footer/footer.component';
import { ImagenVideoComponent } from './opcion-config/imagen-video-config/imagen-video.component';
import { NoticiaComponent } from './opcion-config/noticia-config/noticia.component';
import { GaleriaMultiComponent } from './opcion-config/galeria-multi-config/galeria-multi.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { SliderComponent } from './componentes/slider/slider.component';
import { BookingsComponent } from './bookings/bookings.component';
import { AraizaDiamanteComponent } from './araiza-diamante/araiza-diamante.component';
import { RecargarDirective } from '../directives/recargar.directive';
import { CarouselModule } from '@coreui/angular';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { EliminarComponent } from './popup/eliminar/eliminar.component';
import { EditarSliderComponent } from './popup/editar-slider/editar-slider.component';
import { EditarNoticiaComponent }from './popup/editar-noticia/editar-noticia.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { HttpClientModule } from '@angular/common/http';
import { ImageComponent } from './image/image.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UsuariosComponent } from './opcion-config/usuarios-config/usuarios.component';
import { UsuarioFormComponent } from './popup/editar-usuario/usuario-form.component';
import { EmpleadoDelMesComponent } from './opcion-config/empleado-mes-config/empleado-del-mes.component';
import { CustomMaterialModule } from '../custom-material/custom-material.module';
import { CumpleanerosComponent } from './cumpleaneros/cumpleaneros.component';
import { AniversariosComponent } from './aniversarios/aniversarios.component';
import { MenuComponent } from './menu/menu.component';
import { HistorialNoticiasComponent } from './historial-noticias/historial-noticias.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MenuConfigComponent } from './opcion-config/menu-config/menu-config.component';
import { ComidaFormComponent } from './popup/editar-comida/comida-form.component';
import { EditarMesEmpleadoComponent } from './popup/editar-mes-empleado/editar-mes-empleado.component';
import { AutoCapacConfigComponente } from './opcion-config/autocapac-config/autocapac-config.component';
import { EditarAutocapacComponent } from './popup/editar-autocapac/editar-autocapac.component';
import { EmpleadoMesComponent } from './empleado-mes/empleado-mes.component';
import { TodoNoticiasComponent } from './opcion-config/galeria-multi-config/componentes/todo-noticias/todo-noticias.component';


@NgModule({
  declarations: [
    InicioComponent,
    OpcionMenuComponent,
    FooterComponent,
    ImagenVideoComponent,
    NoticiaComponent,
    GaleriaMultiComponent,
    SliderComponent,
    BookingsComponent,
    AraizaDiamanteComponent,
    RecargarDirective,
    EliminarComponent,
    EditarSliderComponent,
    EditarNoticiaComponent,
    ImageComponent,
    UsuariosComponent,
    UsuarioFormComponent,
    EmpleadoDelMesComponent,
    CumpleanerosComponent,
    AniversariosComponent,
    MenuComponent,
    HistorialNoticiasComponent,
    MenuConfigComponent,
    ComidaFormComponent,
    EditarMesEmpleadoComponent,
    AutoCapacConfigComponente,
    EditarAutocapacComponent,
    EmpleadoMesComponent,
    TodoNoticiasComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    NgxPaginationModule,
    SharedModule,
    InicioRoutingModule,
    NgImageSliderModule,
    CarouselModule,
    NgImageSliderModule,
    IvyCarouselModule,
    NgbModule,
    CustomMaterialModule,

  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})
export class InicioModule { }
