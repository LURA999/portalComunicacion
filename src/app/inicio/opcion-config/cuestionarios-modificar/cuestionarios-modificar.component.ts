import { Component, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuestionariosService } from 'src/app/core/services/cuestionarios.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { CreateQuestionComponent } from '../../componentes/create-question/create-question.component';
import { cuestionario } from '../../araiza-aprende-formulario/araiza-aprende-formulario.component';
import { opcionRadioButton } from '../../componentes/dynamic-radio-group/dynamic-radio-group.component';
import { forkJoin, Observable } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';

@Component({
  selector: 'app-cuestionarios-modificar',
  templateUrl: './cuestionarios-modificar.component.html',
  styleUrl: './cuestionarios-modificar.component.css'
})
export class CuestionariosModificarComponent implements OnInit{
  paramUrl : string = this.route.url.split("/")[2];
  id: number = 0;
  cuestionarioTitulos: any;

  observables : Array<Observable<ResponseInterfaceTs>> = []

  //Con este podemos acceder a todos los componetes createQuestion
  @ViewChildren(CreateQuestionComponent) hijos!: QueryList<CreateQuestionComponent>;

  cuestionarioPreguntas: Array<cuestionario> = [/* {idCuestionario: 1,idPregunta: 1, pregunta: '', respuesta: [], tipoQuestion: 1} */];
  cuestionarioPreguntasModificado : Array<cuestionario> = [];
  @ViewChild('createQuestion', {read: ViewContainerRef, static: true}) createQuestion!: ViewContainerRef;
  createQuestionArray : any [] = [];
  contadorPreguntas : number = 0;

  tipoQuestion : number = 0;
  respuesta : any [] = [] ;
  idCuestionario : number = this.id;
  idPregunta : number = 1;
  pregunta : string = '';

  constructor(private DataService : DataNavbarService, public route : Router, private routeA: ActivatedRoute,private cuestionarioService: CuestionariosService){}

  ngOnInit(): void {
    this.id = Number(this.routeA.snapshot.paramMap.get('id'));
    this.getCuestionario(this.id);
  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

  getCuestionario(id: number): void {
    this.cuestionarioService.getCuestionarioTituloById(id).subscribe(
      (data) => {
        this.cuestionarioTitulos = data.container[0];
      },
      (error) => {
        console.error('Error agarrando titulos:', error);
      }
    );

    this.cuestionarioService.getCuestionarioPreguntasById(id).subscribe(
      (data) => {
        this.cuestionarioPreguntas = data.container;

        this.cuestionarioPreguntas.forEach((pregunta: any) => {
          pregunta.respuesta = JSON.parse(pregunta.respuestas);
          pregunta.tipoQuestion = pregunta.tipoPregunta
        });
        this.contadorPreguntas = this.cuestionarioPreguntas.length
      },
      (error) => {
        console.error('Error agarrando preguntas:', error);
      }
    );

  }


  agregarPregunta(){

    this.cuestionarioPreguntas.push({
      tipoQuestion : this.tipoQuestion,
      respuesta : this.respuesta,
      idCuestionario : this.idCuestionario,
      idPregunta : this.idPregunta,
      pregunta : this.pregunta
    });

    for (let z = 0; z < this.cuestionarioPreguntas.length; z++) {
      this.cuestionarioPreguntas[z].idPregunta = 1+z;
    }
  }

  eliminarPregunta(valor : number){
    this.cuestionarioPreguntas.splice(valor, 1)

    for (let z = 0; z < this.cuestionarioPreguntas.length; z++) {
      this.cuestionarioPreguntas[z].idPregunta = 1+z;
    }

  }


  regresarMenu(){
    this.route.navigate(["/general/cuestionarios-menu"]);
  }

  // form submit
  updateCuestionario(){
    // this.cuestionarioService.enviarCuestionario(y.enviarDatos()).subscribe()
    for ( let y of this.hijos) {
      let cues : cuestionario = y.enviarDatos()
      cues.idCuestionario = this.id
      this.observables.push(this.cuestionarioService.enviarCuestionario(cues))

    }
    forkJoin(this.observables).subscribe()
  }

  handleEliminarPregunta(index: any) {
    // Handle the elimination logic
  }
}
