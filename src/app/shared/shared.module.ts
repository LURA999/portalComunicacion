import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';
import { CustomMaterialModule } from '../custom-material/custom-material.module';
import { BuzonSugerenciaComponent } from './buzon-sugerencia/buzon-sugerencia.component';

@NgModule({
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CustomMaterialModule
  ],
  declarations: [
    LayoutComponent,
    BuzonSugerenciaComponent
  ],
  exports: [
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule

  ]
})
export class SharedModule { }
