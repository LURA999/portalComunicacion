import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-input',
  template: `
    <mat-form-field class="example-full-width">
      <input matInput [placeholder]="placeholder" [(ngModel)]="respuesta" [value]="respuesta">
    </mat-form-field>
  `,
  styles: ['.example-full-width { width: 100%; }']
})
export class DynamicInputComponent {
  @Input() placeholder: string = 'Enter value';
  @Input() respuesta: string = '';
  textoDeInput :string = '';

  constructor(){

  }

  cambio(){

  }

}
