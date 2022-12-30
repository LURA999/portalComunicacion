import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';
import { OpcionMenuComponent } from './opcion-menu/opcion-menu.component';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './componentes/footer/footer.component';
import { ImagenVideoComponent } from './opcion-config/imagen-video/imagen-video.component';
import { NoticiaComponent } from './opcion-config/noticia/noticia.component';
import { GaleriaMultiComponent } from './opcion-config/galeria-multi/galeria-multi.component';
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
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioFormComponent } from './popup/usuario-form/usuario-form.component';
import { EmpleadoDelMesComponent } from './opcion-config/empleado-del-mes/empleado-del-mes.component';
import { CumpleanosComponent } from './cumpleanos/cumpleanos.component';
import { CumpleanerosComponent } from './cumpleaneros/cumpleaneros.component';
import { AniversariosComponent } from './aniversarios/aniversarios.component';
import { MenuComponent } from './menu/menu.component';

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
    CumpleanosComponent,
    CumpleanerosComponent,
    AniversariosComponent,
    MenuComponent

  ],
  imports: [
    HttpClientModule,
    CommonModule,
    SharedModule,
    InicioRoutingModule,
    NgImageSliderModule,
    CarouselModule,
    NgImageSliderModule,
    IvyCarouselModule,
    NgbModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})
export class InicioModule { }
