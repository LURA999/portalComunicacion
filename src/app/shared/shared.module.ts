import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';
import { CustomMaterialModule } from '../custom-material/custom-material.module';
import { BuzonSugerenciaComponent } from './buzon-sugerencia/buzon-sugerencia.component';
import { LineaDeAyudaComponent } from './linea-de-ayuda/linea-de-ayuda.component';
import { VotarPopupComponent } from './votar-popup/votar-popup.component';
import { AraizaEnCamerinoComponent } from './araiza-en-camerino/araiza-en-camerino.component';
import {CdkDrag, CdkDragHandle}  from '@angular/cdk/drag-drop';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CustomMaterialModule,
    CdkDrag,
    CdkDragHandle,
  ],
  providers:[  ],
  declarations: [
    LayoutComponent,
    BuzonSugerenciaComponent,
    LineaDeAyudaComponent,
    VotarPopupComponent,
    AraizaEnCamerinoComponent,
  ],
  exports: [
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatGridListModule

  ]
})
export class SharedModule { }
