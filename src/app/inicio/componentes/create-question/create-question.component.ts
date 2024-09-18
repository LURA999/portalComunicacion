import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { CreateAnswerQuestionComponent } from '../create-answer-question/create-answer-question.component';
import { cuestionario } from '../../araiza-aprende-formulario/araiza-aprende-formulario.component';


@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css'],
})
export class CreateQuestionComponent implements OnInit {
  @Input() valorSelect: number = 0;
  @Input() id_opcion: number = 0;
  @Input() opcion: number = -1; // Empieza desde -1 para inicializar en 0
  @Input() preguntaNombre: string = '';
  @Input() respuestasArray: any[] = [];
  @Input() cantidadRespuestas: number = 0;
  @Output() buttonEliminar = new EventEmitter<number>();
  @Input() arrayRespuestas: any;
  arrayCuestionarios: cuestionario [] = [];

  @ViewChild('answers', { read: ViewContainerRef, static: true }) answers!: ViewContainerRef;

  constructor(){}

  ngOnInit(){
    if(this.cantidadRespuestas > 0){
      for(let i = 0;i <this.cantidadRespuestas;i++){
        this.rellenarCuestionario(Number(this.valorSelect));
      }
    }

  }

  rellenarCuestionario(valor: number){
    this.opcion++; // Variable de incremento para array
    const componentRef = this.answers.createComponent(CreateAnswerQuestionComponent);
    this.respuestasArray.push(componentRef); // Almacena en array el componente

    // Aplicar las propiedades
    componentRef.instance.id_option = this.id_opcion++;
    componentRef.instance.placeholder = this.getPlaceholder(valor);
    componentRef.instance.iconType = this.getPlaceholder(valor);
    
    // No mostrar el boton de eliminar cuando solamente es un componente de question-answer
    componentRef.instance.canDelete = this.opcion !== 0;
    const currentRespuestas = this.arrayRespuestas[this.opcion];
    componentRef.instance.respuesta = currentRespuestas?.title || '';

    componentRef.changeDetectorRef.detectChanges();

    componentRef.instance.buttonClicked.subscribe((id: number) => {
      this.removeComponent(componentRef);
    });
  }


  onChange(valor: number) {
    this.answers.clear(); // Vaciar todos los componentes dinamicos de tipo create-answer-question
    this.valorSelect = valor;
    this.id_opcion = 0;
    this.opcion = -1; 
    this.respuestasArray = []; // Vaciar el array cada que refresca el select
    this.procesoSeleccion(valor);
  }

  procesoSeleccion(valor: number) {
    valor = Number(this.valorSelect);
    this.opcion++; // Variable de incremento para array
    const componentRef = this.answers.createComponent(CreateAnswerQuestionComponent);
    this.respuestasArray.push(componentRef); // Almacena en array el componente

    // Aplicar las propiedades
    componentRef.instance.id_option = this.id_opcion++;
    componentRef.instance.placeholder = this.getPlaceholder(valor);
    componentRef.instance.iconType = this.getPlaceholder(valor);
    
    // No mostrar el boton de eliminar cuando solamente es un componente de question-answer
    componentRef.instance.canDelete = this.opcion !== 0;


    componentRef.changeDetectorRef.detectChanges();

    componentRef.instance.buttonClicked.subscribe((id: number) => {
      this.removeComponent(componentRef);
    });
  }

  getPlaceholder(valor: number): string {
    switch (valor) {
      case 1: return "Texto";
      case 2: return "Radio Button";
      case 3: return "Checkbox";
      case 4: return "Dragdrop";
      default: return "Unknown";
    }
  }

  removeComponent(componentRef: any) {
    const index = this.respuestasArray.indexOf(componentRef);
    if (index > -1) {
      componentRef.destroy(); // Quitar de array el componente
      this.respuestasArray.splice(index, 1);
    }
  }

  eventEliminar() {
    this.buttonEliminar.emit(1);
  }


}
