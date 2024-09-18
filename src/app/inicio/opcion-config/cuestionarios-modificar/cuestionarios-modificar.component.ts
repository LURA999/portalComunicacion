import { Component, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuestionariosService } from 'src/app/core/services/cuestionarios.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { CreateQuestionComponent } from '../../componentes/create-question/create-question.component';
import { cuestionario } from '../../araiza-aprende-formulario/araiza-aprende-formulario.component';
import { opcionRadioButton } from '../../componentes/dynamic-radio-group/dynamic-radio-group.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-cuestionarios-modificar',
  templateUrl: './cuestionarios-modificar.component.html',
  styleUrl: './cuestionarios-modificar.component.css'
})
export class CuestionariosModificarComponent implements OnInit{
  paramUrl : string = this.route.url.split("/")[2];
  id: number = 0;
  cuestionarioTitulos: any;
  cuestionarioPreguntas: any;
  keyCuestionarios: string[] = [];
  respuestasArray: opcionRadioButton[] = [];


  @ViewChild('createQuestion', {read: ViewContainerRef, static: true}) createQuestion!: ViewContainerRef;
  
  createQuestionArray : any [] = [];
  cuestionarioActualizadas : Array<cuestionario> = []
  arrayPreguntas : any[] = [];
  contadorPreguntas : number = 0;
  constructor(private DataService : DataNavbarService,
    private rend : Renderer2, 
    public route : Router, private routeA: ActivatedRoute,private cuestionarioService: CuestionariosService){}

  ngOnInit(): void {
    this.id = Number(this.routeA.snapshot.paramMap.get('id'));
    
    this.getCuestionario(this.id);
    // console.log('Received ID:', this.id);
  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);


  }

  getCuestionario(id: number): void {
    this.cuestionarioService.getCuestionarioTituloById(id).subscribe(
      (data) => {
        this.cuestionarioTitulos = data.container[0];
        // console.log('Cuestionario data:', this.cuestionarioTitulos);
      },
      (error) => {
        console.error('Error agarrando titulos:', error);
      }
    );

    this.cuestionarioService.getCuestionarioPreguntasById(id).subscribe(
      (data) => {
        this.cuestionarioPreguntas = data.container;

        this.cuestionarioPreguntas.forEach((pregunta: any) => {
          pregunta.respuestas = JSON.parse(pregunta.respuestas);
        });

        for (let index = 0; index < this.cuestionarioPreguntas.length; index++) {
          
          
          const componentRef2 = this.createQuestion.createComponent(MatButton);

          const componentRef = this.createQuestion.createComponent(CreateQuestionComponent);
          
        
          // Detectar cambios para reflejar el botón dinámico en el DOM
          
          // Aplicar las propiedades
          componentRef.instance.valorSelect = this.cuestionarioPreguntas[index].tipoPregunta;
          componentRef.instance.preguntaNombre = this.cuestionarioPreguntas[index].pregunta;
          componentRef.instance.arrayRespuestas = this.cuestionarioPreguntas[index].respuestas;
          componentRef.instance.cantidadRespuestas = this.cuestionarioPreguntas[index].respuestas.length;
          // No mostrar el boton de eliminar cuando solamente es un componente de question-answer
          this.createQuestionArray.push(componentRef); // Almacena en array el componente
          componentRef.changeDetectorRef.detectChanges();
          componentRef.instance.buttonEliminar.subscribe((id: number) => {
            componentRef.destroy();
          });

          // Asignar propiedades o clases al botón dinámico
          componentRef2.instance.color = 'primary';  // Cambiar el color

          componentRef2.instance.disabled = false;   // Habilitar o deshabilitar el botón
          // Añadir texto al botón
          componentRef2.instance._elementRef.nativeElement.textContent = 'Clic Aquí';
          componentRef2.instance._elementRef.nativeElement.addEventListener('click', () => {
            componentRef.destroy()
            componentRef2.destroy()
          });
          this.rend.addClass(componentRef2.instance._elementRef.nativeElement, 'mat-raised-button');

          componentRef2.changeDetectorRef.detectChanges();

          
        }

        // console.log('Cuestionario data:', this.cuestionarioPreguntas);
      },
      (error) => {
        console.error('Error agarrando preguntas:', error);
      }
    );
  }



  agregarPregunta(){
    const componentRef  = this.createQuestion.createComponent(CreateQuestionComponent);
    console.log(componentRef);
    
    // this.cuestionarioActualizadas.push({
    //   idCuestionario: 2,
    //   idPregunta:2,
    //   pregunta:'',
    //   respuesta: [],
    //   tipoQuestion : 1
    // });
    
    this.contadorPreguntas++;

    componentRef.instance.buttonEliminar.subscribe((id: number) => {
      this.contadorPreguntas--;
      console.log(this.contadorPreguntas);
      componentRef.destroy();
    });

  }


  regresarMenu(){
    this.route.navigate(["/general/cuestionarios-menu"]);
  }

  // form submit
  updateCuestionario(){
    // console.log(this.createQuestion.length);

    for (let x = 0; x < this.createQuestion.length; x++) {
      console.log(this.createQuestion.length);
      for (let y = 0; y < this.createQuestionArray[x].instance.arrayRespuestas.length; y++) {
      //  console.log(this.createQuestionArray[x].instance.arrayRespuestas[y].title);
      //  console.log(this.createQuestionArray[x].instance.valorSelect);
      //  console.log(this.createQuestionArray[x].instance.preguntaNombre);
      //  console.log(this.createQuestionArray[x].instance.respuestasArray);
       this.respuestasArray = [];
       for (let o = 0; o < this.createQuestionArray[x].instance.respuestasArray.length; o++) {        
          this.respuestasArray.push({
            id: this.createQuestionArray[x].instance.respuestasArray[o].instance.id_option,
            title: this.createQuestionArray[x].instance.respuestasArray[o].instance.respuesta,
          });
        
       }
      }

      this.cuestionarioActualizadas.push({
        tipoQuestion : this.createQuestionArray[x].instance.valorSelect,
        respuesta : this.respuestasArray ,
        idCuestionario : this.id,
        idPregunta : 1,
        pregunta : this.createQuestionArray[x].instance.preguntaNombre

      });
 
    }

    console.log(this.cuestionarioActualizadas);
    
    this.cuestionarioActualizadas = [];

    
  }

  eliminarPregunta(valor : number){
    this.cuestionarioPreguntas.splice(valor, 1)

    for (let z = 0; z < this.cuestionarioPreguntas.length; z++) {
      this.cuestionarioPreguntas[z].idPregunta = 1+z;
      
    }

  }


}
