import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
        <mat-checkbox color="primary" (change)="seleccionar()" formControlName="{{opc.title}}">{{opc.title}}</mat-checkbox><br>
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


  ngOnInit(): void {
    for (let i = 0; i < this.opciones.length; i++) {
      this.fb.addControl(this.opciones[i].title,  this._formBuilder.control(this.opciones[i].state))
    }
    this.mostrar = true;
  }

  seleccionar(){
    let x : number = 0;
    for(let v in this.fb.value){
      this.opciones[x].state =  this.fb.get(v)?.value
      x++;
    }
  }

}
