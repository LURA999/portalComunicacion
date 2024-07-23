import { Component, Input, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-dynamic-input',
  template: `
    <mat-form-field class="example-full-width">
      <input matInput [placeholder]="placeholder" [value]="respuesta">
    </mat-form-field>
  `,
  styles: ['.example-full-width { width: 100%; }']
})
export class DynamicInputComponent {

  @Input() placeholder: string = 'Enter value';
  @Input() respuesta: string = 'Respuesta';

  constructor(){
  }

}
