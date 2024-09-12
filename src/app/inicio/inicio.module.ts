import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { EliminarComponent } from './popup/eliminar/eliminar.component';
import { EditarSliderComponent } from './popup/editar-slider/editar-slider.component';
import { EditarNoticiaComponent }from './popup/editar-noticia/editar-noticia.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
import { EditarxHotelAutocapacComponent } from './popup/editar-autocapac-x-hotel/editar-autocapac-x-hotel.component';
import { EmpleadoMesComponent } from './empleado-mes/empleado-mes.component';
import { TodoNoticiasComponent } from './opcion-config/galeria-multi-config/componentes/todo-noticias/todo-noticias.component';
import { LazyLoadImageModule } from "ng-lazyload-image";
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ProgressModule } from '@coreui/angular';
import { AraizaAprendeComponent } from './araiza-aprende/araiza-aprende.component';
import { AraizaAprendeConfigComponent } from './opcion-config/araiza-aprende-config/araiza-aprende-config.component';
import { AddAraizaAprendeComponent } from './popup/add-araiza-aprende/add-araiza-aprende.component';
import { RestAraizaAprendeComponent } from './popup/rest-araiza-aprende/rest-araiza-aprende.component';
import { VideoImgAraizaAprComponent } from './opcion-config/galeria-multi-config/componentes/video-img-araiza-apr/video-img-araiza-apr.component';
import { EditarVideoComponent } from './popup/editar-video/editar-video.component';
import { ThanksComponent } from './popup/thanks/thanks.component';
import { EliminarDepartamentoComponent } from './popup/eliminar-departamento/eliminar-departamento.component';
import { AgregarDepartamentoComponent } from './popup/agregar-departamento/agregar-departamento.component';
import { EditarDepartamentoComponent } from './popup/editar-departamento/editar-departamento.component';
import { CrearAutocapacComponent } from './popup/crear-autocapac/crear-autocapac.component';
import { AsignarAutocapacComponent } from './popup/asignar-autocapac/asignar-autocapac.component';
import { EliminarAutocapacComponent } from './popup/eliminar-autocapac/eliminar-autocapac.component';
import { AraizaAprendeClickComponent } from './araiza-aprende-click/araiza-aprende-click.component';
import { AraizaAprendeFormularioComponent } from './araiza-aprende-formulario/araiza-aprende-formulario.component';
import { VotacionesConfigComponent } from './opcion-config/votaciones-config/votaciones-config.component';
import { CuestionariosConfigComponent } from './opcion-config/cuestionarios-config/cuestionarios-config.component';
import { CrearCompetenciaComponent } from './popup/crear-competencia/crear-competencia.component';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { DynamicInputComponent } from './componentes/dynamic-input/dynamic-input.component';
import { PasswordPopupComponent } from './popup/password-popup/password-popup.component';
import { ExamenEnviadoComponent } from './popup/examen-enviado/examen-enviado.component';
import { EditarVotarCompetenciaComponent } from './popup/editar-votar-competencia/editar-votar-competencia.component';
import { EliminarCompetenciaComponent } from './popup/eliminar-competencia/eliminar-competencia.component';
import { EliminarCompetenciaSeguridadComponent } from './popup/eliminar-competencia-seguridad/eliminar-competencia-seguridad.component';
import { CreateQuestionComponent } from './componentes/create-question/create-question.component';
import { CreateAnswerQuestionComponent } from './componentes/create-answer-question/create-answer-question.component';


@NgModule({ declarations: [
        InicioComponent,
        OpcionMenuComponent,
        FooterComponent,
        EditarVotarCompetenciaComponent,
        ImagenVideoComponent,
        NoticiaComponent,
        GaleriaMultiComponent,
        SliderComponent,
        BookingsComponent,
        AraizaDiamanteComponent,
        EliminarComponent,
        EditarSliderComponent,
        EditarNoticiaComponent,
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
        TodoNoticiasComponent,
        AraizaAprendeComponent,
        AraizaAprendeConfigComponent,
        AddAraizaAprendeComponent,
        RestAraizaAprendeComponent,
        VideoImgAraizaAprComponent,
        EditarVideoComponent,
        ThanksComponent,
        EliminarDepartamentoComponent,
        AgregarDepartamentoComponent,
        EditarDepartamentoComponent,
        CrearAutocapacComponent,
        AsignarAutocapacComponent,
        EditarxHotelAutocapacComponent,
        EliminarAutocapacComponent,
        AraizaAprendeClickComponent,
        AraizaAprendeFormularioComponent,
        VotacionesConfigComponent,
        CrearCompetenciaComponent,
        DynamicInputComponent,
        CuestionariosConfigComponent,
        PasswordPopupComponent,
        ExamenEnviadoComponent,
        EliminarCompetenciaComponent,
        EliminarCompetenciaSeguridadComponent,
        CreateQuestionComponent,
        CreateAnswerQuestionComponent,
    ],
    imports: [
        CommonModule,
        NgxPaginationModule,
        SharedModule,
        InicioRoutingModule,
        NgImageSliderModule,
        NgImageSliderModule,
        NgbModule,
        CustomMaterialModule,
        LazyLoadImageModule,
        SlickCarouselModule,
        MatIconModule,
        MatAutocompleteModule,
        MatChipsModule,
        ProgressModule
      ],
      providers: [
        {
          provide: [
            CUSTOM_ELEMENTS_SCHEMA, MAT_DIALOG_DEFAULT_OPTIONS
          ],
          useValue: { hasBackdrop: false }
        },
        provideHttpClient(withInterceptorsFromDi())
      ] })
export class InicioModule { }
