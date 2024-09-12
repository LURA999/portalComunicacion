import { Component, EventEmitter, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { CreateAnswerQuestionComponent } from '../create-answer-question/create-answer-question.component';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css'],
})
export class CreateQuestionComponent {
  valorSelect: number = 1;
  id_opcion: number = 0;
  opcion: number = -1; // Empieza desde -1 para inicializar en 0
  respuestasArray: any[] = [];
  @Output() buttonEliminar = new EventEmitter<number>();

  @ViewChild('answers', { read: ViewContainerRef, static: true }) answers!: ViewContainerRef;

  onChange(valor: MatSelectChange) {
    this.answers.clear(); // Vaciar todos los componentes dinamicos de tipo create-answer-question
    this.valorSelect = valor.value;
    this.id_opcion = 0;
    this.opcion = -1; 
    this.respuestasArray = []; // Vaciar el array cada que refresca el select
    this.procesoSeleccion(Number(valor.value));
  }

  procesoSeleccion(valor: number) {
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

  agregarOpcion() {
    this.procesoSeleccion(Number(this.valorSelect));
  }

  eliminarPregunta(){
    this.buttonEliminar.emit(1);
  }


}
