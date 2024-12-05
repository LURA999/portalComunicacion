import { Component, ComponentRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef, output } from '@angular/core';
import { CreateAnswerQuestionComponent } from '../create-answer-question/create-answer-question.component';
import { cuestionario } from '../../araiza-aprende-formulario/araiza-aprende-formulario.component';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css'],
})
export class CreateQuestionComponent implements OnInit {
  @Input() valorSelect: number = 0;
  @Input() id_opcion: number = 0;
  @Input() idPregunta: number = 0;
  @Input() opcion: number = -1; // Empieza desde -1 para inicializar en 0
  @Input() preguntaNombre: string = '';
  @Input() respuestasArray: any[] = [];
  @Input() cantidadRespuestas: number = 0;
  buttonEliminar : boolean = false;
  buttonAdd : boolean = false;
  @Input() arrayRespuestas: any;
  @Input() respuestaCorrecta ! : number | Array<number> | string;
  valorSelectSave : number = 0;
  controlPreguntaNombre = new FormControl('');
  controlSelect = new FormControl(0);

  eliminarRespesta : Array<number> = []

  selectedCheckboxes: number[] = [];  // To store selected checkbox IDs
  selectedRadioButton: number | null = null;  // To store the selected radio button ID

  arrayCuestionarios: cuestionario [] = [];
  componentRef : any [] = [];

  selectedValues: { id: number, type: string, selected: boolean }[] = [];  // Unified array to handle selections

  @ViewChild('answers', { read: ViewContainerRef, static: true }) answers!: ViewContainerRef;

  constructor(){

  }

  ngAfterContentInit(): void {
    
    this.valorSelectSave = this.valorSelect;
    this.controlSelect.patchValue(this.valorSelect);
    this.selectedRadioButton = this.respuestaCorrecta as number
  }

  ngOnInit(){
    if(this.cantidadRespuestas > 0){
      for(let i = 0;i <this.cantidadRespuestas;i++){
        this.rellenarCuestionario(Number(this.valorSelect));
      }
      this.controlPreguntaNombre.patchValue(
        this.preguntaNombre
      )
      
      
      if(this.valorSelect == 3 || this.valorSelect == 4){        
        this.selectedCheckboxes = this.respuestaCorrecta as Array<number>;
      }else{
        this.selectedRadioButton = this.respuestaCorrecta as number
      }
    }

  }

  // Este metodo rellena los campos del cuestionario
  rellenarCuestionario(valor: number) {
    this.opcion++; // Incremento del índice para array
    const newComponent : ComponentRef<CreateAnswerQuestionComponent>= this.answers.createComponent(CreateAnswerQuestionComponent);
    
    this.componentRef.push(newComponent);
    this.respuestasArray.push(newComponent); // Almacena el componente
    newComponent.instance.id_option = this.opcion;
    newComponent.instance.placeholder = this.getPlaceholder(valor);
    newComponent.instance.iconType = this.getPlaceholder(valor);
    newComponent.instance.valorSelect = valor;

    newComponent.instance.canDelete = this.opcion !== 0; // No mostrar botón eliminar en el primer componente

    const currentRespuestas = this.arrayRespuestas[this.opcion];

    if(typeof this.respuestaCorrecta == 'number') {
      //el id_option es la variable con la que se va a comparar para saber si es correcta o no, la respuesta
      newComponent.instance.respuestaCorrecta = newComponent.instance.id_option == this.respuestaCorrecta
      // this.selectedRadioButton = this.opcion
    }else{
      let indice : number = 0;
      //En este while se recorre hasta que se encuentra la respuesta correcta
      while( !(newComponent.instance.id_option == this.respuestaCorrecta[indice]) && indice < this.respuestaCorrecta.length-1){
        newComponent.instance.respuestaCorrecta = newComponent.instance.id_option == this.respuestaCorrecta[indice]
        indice ++;
      }
      /*
        Cuando el while se detiene, no guarda la respuesta realmente si es false o true,
        por lo tanto se accede a la ultima posicion que recorrio el while, y de alli sabremos si es true o false
      */
      newComponent.instance.respuestaCorrecta = newComponent.instance.id_option == this.respuestaCorrecta[indice]
    }

    newComponent.instance.respuesta = currentRespuestas?.title || '';

    newComponent.changeDetectorRef.detectChanges();

    newComponent.instance.buttonClicked.subscribe((id: number) => {
      this.buttonEliminar = true;
      this.removeComponent(newComponent);
      this.actualizarIdOption();     


      // Adjust indices of selected checkboxes even if the deleted option was unselected      
      const index = this.selectedCheckboxes.indexOf(id);
      
      if (index != -1) {
        // If the deleted option was selected, remove it from the array
        this.selectedCheckboxes.splice(index, 1);
      }

      // Adjust the indices of selected checkboxes after the deleted option
      for (let i = 0; i < this.selectedCheckboxes.length; i++) {
        if (this.selectedCheckboxes[i] > id) {
          this.selectedCheckboxes[i]--;
        }
      }

       console.log('Selected Checkboxes:', this.selectedCheckboxes);
    });

    newComponent.instance.selectionChanged.subscribe((change: { id: number, type: string, selected: boolean }) => {
      this.handleSelectionChange(change);  // Handle the change
    });
   }

  //  Este metodo agrega preguntas nuevas
   procesoSeleccion(valor: number,  newC : boolean, respuesta? : string) {
    this.opcion++;
    const newComponent : ComponentRef<CreateAnswerQuestionComponent> = this.answers.createComponent(CreateAnswerQuestionComponent);    
    this.componentRef.push(newComponent);
    this.respuestasArray.push(newComponent);

    this.buttonAdd = true;
    
    // Aplicar las propiedades necesarias
    newComponent.instance.id_option = this.opcion;
    newComponent.instance.placeholder = this.getPlaceholder(valor);
    newComponent.instance.iconType = this.getPlaceholder(valor);

    newComponent.instance.valorSelect = valor;

    // No mostrar el botón de eliminar en el primer componente
    newComponent.instance.canDelete = this.opcion !== 0;

    // Actualizar las respuestas actuales en caso de haberlas
    
    if(typeof this.respuestaCorrecta == 'number') {
      //el id_option es la variable con la que se va a comparar para saber si es correcta o no, la respuesta
      newComponent.instance.respuestaCorrecta = !newC ? newComponent.instance.id_option == this.respuestaCorrecta : false
      // this.selectedRadioButton = this.opcion
    }else{
      let indice : number = 0;
      //En este while se recorre hasta que se encuentra la respuesta correcta
      while( !(newComponent.instance.id_option == this.respuestaCorrecta[indice]) && indice < this.respuestaCorrecta.length-1){
        newComponent.instance.respuestaCorrecta = !newC ? newComponent.instance.id_option == this.respuestaCorrecta[indice] : false
        indice ++;
      }
      /*
        Cuando el while se detiene, no guarda la respuesta realmente si es false o true,
        por lo tanto se accede a la ultima posicion que recorrio el while, y de alli sabremos si es true o false
      */
      newComponent.instance.respuestaCorrecta = !newC ? newComponent.instance.id_option == this.respuestaCorrecta[indice] : false
    }

    newComponent.instance.respuesta = respuesta || '';
    
    newComponent.changeDetectorRef.detectChanges();


    //Reacciona cuando queires eliminar un elemento del checkbox
    newComponent.instance.buttonClicked.subscribe((id: number) => {
      this.buttonEliminar = true;
      this.removeComponent(newComponent);
      
      this.actualizarIdOption();
      
      // Adjust indices of selected checkboxes
      const index = this.selectedCheckboxes.indexOf(id);
      console.log("indice: ", index);
      
      if (index !== -1) {
        // If the deleted option was selected, remove it from the array
        this.selectedCheckboxes.splice(index, 1);
      }
      
      // Adjust the indices of selected checkboxes after the deleted option
      for (let i = 0; i < this.selectedCheckboxes.length; i++) {
        if (this.selectedCheckboxes[i] > id) {
          this.selectedCheckboxes[i]--;
        }
      }

      // Log the updated array of selected checkboxes
      console.log('Selected Checkboxes (after deletion):', this.selectedCheckboxes);
    });

    newComponent.instance.selectionChanged.subscribe((change: { id: number, type: string, selected: boolean }) => {
      this.handleSelectionChange(change);  // Handle the change
    });
  }

  // Este metodo actualiza los id por si se llega a borrar una pregunta o respuesta
   actualizarIdOption() {
    // Actualizar los ids de todos los componentes después de cambios
    for (let v = 0; v < this.componentRef.length; v++) {
      this.componentRef[v].instance.id_option = v;
    }
  }

  // Este metodo se utiliza en el select dentro del componente de create question para cambiar el tipo de pregunta y asi mandar al
  // componente hijo (create-answer-question) el tipo de respuesta,input y icono que ocupa, tambien resetea todos los inputs
  onChange(valor: number) {
    const confirmReset = confirm("Are you sure you want to change the type of response?, You will Lose your changes");
    if (confirmReset) {
      this.answers.remove();
      this.answers.clear();
      
      this.cantidadRespuestas = 0;
      this.respuestaCorrecta = 0;
        // This clears all dynamically added components
      this.respuestasArray = [];  // Clear the array holding the components' state
      this.arrayRespuestas = [];
      this.componentRef.forEach(comp => {
        comp.instance.respuesta = '';  // Clear the input for each component
        comp.instance.iconType = '';  // Reset the input type
        comp.instance.placeholder = '';  // Clear the placeholder if needed
        comp.changeDetectorRef.detectChanges();  // Apply the changes
      });
      this.componentRef = [];  // Clear component references

      // Reset the options and counters
      this.opcion = -1;
      this.id_opcion = 0;

      let  type : string  = ''
      switch(valor) {
        case 2:
          type = 'radio'
          break;
        case 3:
          type = 'checkbox'
          break;
        case 4:
          type = 'dragdrop'
          break;
      }
      this.handleSelectionChange({id: this.id_opcion, type: type, selected: true});
      this.controlSelect.patchValue(valor); // Set the new selected value
      this.valorSelectSave = valor;

      // If the new type of question is valid, create the first empty answer input
      if (valor > 1) {
        const currentRespuestas = this.arrayRespuestas[this.opcion];
        this.procesoSeleccion(valor, false, currentRespuestas);  // Create the first answer input for the new type
      }
    } else {
      this.controlSelect.patchValue(this.valorSelectSave);
      
    }
  } 


  // Handle the selection change
  handleSelectionChange(change: { id: number, type: string, selected: boolean }) {
    const { id, type, selected } = change;
    if (type === 'checkbox' || type === 'checkbox') {
      if (selected) {
        this.selectedCheckboxes.push(id);  // Add to selected checkboxes array
      } else {
        this.selectedCheckboxes = this.selectedCheckboxes.filter(item => item !== id);  // Remove from array
      }
      console.log('Selected Checkboxes:', this.selectedCheckboxes);
    }

    if (type === 'radio') {
      this.selectedRadioButton = id;  // Set the selected radio button ID
      console.log('Selected Radio Button:', this.selectedRadioButton);
    }

  }


  // Placeholde para saber que tipo de input es
  getPlaceholder(valor: number): string {
    const numValor = Number(valor);
    switch (numValor) {
      case 1: return "Texto";
      case 2: return "Radio Button";
      case 3: return "Checkbox";
      case 4: return "Dragdrop";
      default: return "Unknown";
    }
  }


  // Este componente destruye las preguntas y actualiza los indices
  removeComponent(componentRef: ComponentRef<CreateAnswerQuestionComponent>) {
    const index = this.respuestasArray.indexOf(componentRef);

    if (index > -1) {
      // Destruir el componente
      componentRef.destroy();
      componentRef.hostView.detach();       

      // Remover del array respuestasArray y componentRef
      this.respuestasArray.splice(index, 1);
      this.componentRef.splice(index, 1);

      // Actualizar los índices después de eliminar
      for (let v = 0; v < this.componentRef.length; v++) {
        this.componentRef[v].instance.id_option = v;
      }

      this.opcion = this.componentRef.length - 1;
    }
  }


  // Este metodo manda los datos al componente padre (cuestionarios-modificar)
  enviarDatos() : cuestionario {
    const respuestasArray2 = this.respuestasArray.map(component => ({
      id: component.instance.id_option,
      title: component.instance.respuesta,
    }));

    let respuestaCorrecta: number[] | number | null;
    let cantidadRespuestas: number;
    
    // Check if it's a checkbox or radio question
    if (this.controlSelect.value == 3) { // Checkbox (multiple answers)
      respuestaCorrecta = this.selectedCheckboxes;
      cantidadRespuestas = respuestasArray2.length;
    } else if (this.controlSelect.value == 2) { // Radio (single answer)
      respuestaCorrecta = this.selectedRadioButton;
      cantidadRespuestas = this.selectedRadioButton ? 1 : 0;
    }else if(this.controlSelect.value == 4) { // dragDrop
      respuestaCorrecta = Array.from({ length: respuestasArray2.length }, (_, i) => 1+ i );;
      cantidadRespuestas = respuestasArray2.length;
    }
    
    return {
      idPregunta: this.idPregunta,
      pregunta: this.controlPreguntaNombre.value,
      respuesta: respuestasArray2,
      tipoQuestion: this.controlSelect.value,
      respuestaCorrecta: this.controlSelect.value == 3 || this.controlSelect.value == 4 ? "["+respuestaCorrecta!.toString()+"]" : respuestaCorrecta!.toString(),
      cantidadRespuestas: cantidadRespuestas!

    } as cuestionario;
  }

}
