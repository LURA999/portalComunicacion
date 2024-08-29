import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

export interface opcionRadioButton {
    title : string,
    state? : boolean,
    stateDrag? : number,
    id: number
}

@Component({
  selector: 'app-dynamic-radio-group',
  standalone: true,
  imports: [MatRadioModule, FormsModule],
  template: `
  <mat-radio-group
  aria-labelledby="example-radio-group-label"
  class="example-radio-group"
  [ngModel]="true">
    @for (opc of opciones; track opc; let idx = $index) {
      <mat-radio-button class="example-radio-button" (change)="seleccionar(idx)" color="primary" [value]="opc.state">{{opc.title}}</mat-radio-button><br>
    }
  </mat-radio-group>
  `,
  styles: ['.example-full-width { width: 100%; }']
})
export class DynamicRadioGroupComponent {
  @Input() opciones: Array<opcionRadioButton> = [];

  seleccionar(index : number){
    this.opciones[index].state = true;
    for (let x = 0; x < this.opciones.length; x++) {
      if (x !== index) {
        this.opciones[x].state = false;
      }
    }

  }
}
