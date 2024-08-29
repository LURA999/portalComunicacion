import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { opcionRadioButton } from '../dynamic-radio-group/dynamic-radio-group.component';

export interface opcionCheckBoxButton {
  title : string,
  state : boolean,
  id: number
}

@Component({
  selector: 'app-dynamic-checkbox-group',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  @if (mostrar) {
    <section class="example-section" [formGroup]="fb">
      @for (opc of opciones; track opc; let idx = $index) {
        <mat-checkbox
        color="primary"
        (change)="seleccionar($event)"
        formControlName="{{opc.title}}">
          {{opc.title}}

        </mat-checkbox>
        <br>
      }

    </section>
  }
`,
  styles: []
})
export class DynamicCheckboxGroupComponent {
  private readonly _formBuilder = inject(FormBuilder);
  @Input() opciones: Array<opcionRadioButton> = [];
  mostrar : boolean = false;
  fb = this._formBuilder.group({});
  contador :number = 0;
  arrayBool : Array<boolean> = [];
  maximoRespuestas : number = 6;

  constructor(){
  }

  ngOnInit(): void {
    this.arrayBool = Array.from({ length: this.opciones.length }, (_, i) => false);

    for (let i = 0; i < this.opciones.length; i++) {
      if(this.opciones[i].state as boolean){
        this.contador = this.contador + 1;
      }

      this.fb.addControl(this.opciones[i].title,  this._formBuilder.control(this.opciones[i].state))
    }

    this.mostrar = true;

  }

  seleccionar(e : MatCheckboxChange){
    if((this.maximoRespuestas > this.contador) || this.contador == this.maximoRespuestas && !e.checked){
      if(e.checked){
        this.contador = this.contador + 1;
      }else{
        this.contador = this.contador - 1;
      }
    }else{
      e.source.checked = false;
    }
  }

}
