import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicRadioGroupComponent, opcionRadioButton } from '../../componentes/dynamic-radio-group/dynamic-radio-group.component';
import { DynamicCheckboxGroupComponent } from '../../componentes/dynamic-checkbox-group/dynamic-checkbox-group.component';
import { DynamicInputComponent } from '../../componentes/dynamic-input/dynamic-input.component';
import { cuestionario } from '../../araiza-aprende-formulario/araiza-aprende-formulario.component';

@Component({
  selector: 'app-cuestionarios-config',
  templateUrl: './cuestionarios-config.component.html',
  styleUrl: './cuestionarios-config.component.css'
})
export class CuestionariosConfigComponent {

@ViewChild('placeholder', {read: ViewContainerRef, static: true}) placeholder!: ViewContainerRef;
componentRef : any[] = [];
componentRef2 : any[] = [];
indexRadioButton :number = 0;
indexCheckBox :number = 0;


quiz : Array<cuestionario> =
  [
    {
    idCuestionario: 1,
    cuestionario: 1,
    pregunta: "Pregunta 1",
    tipoQuestion: 3, //CheckBox
    respuesta:
    [
      {
        title : "A",
        state : true,
        id: 1
      },
      {
        title : "B",
        state : false,
        id: 2
      },
      {
        title : "C",
        state : false,
        id: 3
      },
    ]
    },
    {
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "Pregunta 1",
      tipoQuestion: 3, //CheckBox
      respuesta:
      [
        {
          title : "A",
          state : true,
          id: 1
        },
        {
          title : "B",
          state : false,
          id: 2
        },
        {
          title : "C",
          state : false,
          id: 3
        },
      ]

      },
    {
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "Pregunta 2",
      tipoQuestion: 1, // Pregunta abierta
      respuesta: "HOLA"
    },{
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "Pregunta 1",
      tipoQuestion: 1,
      respuesta: "HOLA2"
    },
    {
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "Pregunta 2",
      tipoQuestion: 2, //RadioButton
      respuesta:
      [
        {
          title : "A2",
          state : false,
          id: 1
        },
        {
          title : "B2",
          state : true,
          id: 2
        },
        {
          title : "C2",
          state : false,
          id: 3
        },
      ]

      },
  ]


  crearNuevoElemento(i : number){
    switch (i) {
      case 1:
        const componentRef1 = this.placeholder.createComponent(DynamicInputComponent);
        componentRef1.instance.placeholder = 'Respuesta';
        componentRef1.changeDetectorRef.detectChanges();
        break;
      case 2:
        const componentRef2 = this.placeholder.createComponent(DynamicInputComponent);
        componentRef2.instance.placeholder = 'Respuesta';
        componentRef2.changeDetectorRef.detectChanges();
        break;
      case 3:
        const componentRef3 = this.placeholder.createComponent(DynamicInputComponent);
        componentRef3.instance.placeholder = 'Respuesta';
        componentRef3.changeDetectorRef.detectChanges();
        break;
      default:
        break;
    }
  }


}
