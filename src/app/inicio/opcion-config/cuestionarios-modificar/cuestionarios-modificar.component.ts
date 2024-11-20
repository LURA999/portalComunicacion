import { Component, inject, input, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuestionariosService } from 'src/app/core/services/cuestionarios.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { CreateQuestionComponent } from '../../componentes/create-question/create-question.component';
import { cuestionario } from '../../araiza-aprende-formulario/araiza-aprende-formulario.component';
import { concatMap, forkJoin, Observable, of } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar } from '@angular/material/snack-bar';
import { MensajeSnackBarComponent } from '../../shared/custom-snack-bar/custom-snack-bar.component';

export interface cuestionarioTitulos  {
  idFormulario : number,
  titulo : string,
  descripcion : string
}

@Component({
  selector: 'app-cuestionarios-modificar',
  templateUrl: './cuestionarios-modificar.component.html',
  styleUrl: './cuestionarios-modificar.component.css',
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ]
})
export class CuestionariosModificarComponent implements OnInit{
  paramUrl : string = this.route.url.split("/")[2];
  id: number = 0;
  cuestionarioTitulos!: cuestionarioTitulos;
  private _snackBar = inject(MatSnackBar);

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

  constructor(
    private DataService : DataNavbarService, 
    public route : Router,
    private routeA: ActivatedRoute,
    private cuestionarioService: CuestionariosService
  ){}

  ngOnInit(): void {
    this.id = Number(this.routeA.snapshot.paramMap.get('id'));
    this.getCuestionario(this.id);
  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

  getCuestionario(id: number): void {

    this.cuestionarioService.getCuestionarioTituloById(id).subscribe(
      (data : ResponseInterfaceTs) => {
        this.cuestionarioTitulos = data.container[0];
      },
      (error) => {
        console.error('Error agarrando titulos:', error);
      }
    );

    this.cuestionarioService.getCuestionarioPreguntasById(id).subscribe(
      (data : ResponseInterfaceTs) => {
        this.cuestionarioPreguntas = data.container;
        this.cuestionarioPreguntas.forEach((pregunta: any) => {
          pregunta.respuesta = JSON.parse(pregunta.respuestas);
          pregunta.tipoQuestion = pregunta.tipoPregunta;
          pregunta.respuestaCorrecta = this.arrayONumber(pregunta.respuestaCorrecta)
          ? JSON.parse(pregunta.respuestaCorrecta)
          : Number(pregunta.respuestaCorrecta);
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
    let cues : Array<cuestionario> = []
    for (let j = 0; j < this.hijos.length; j++) {
      cues.push(this.hijos.get(j)!.enviarDatos());
      cues[j].respuesta = JSON.stringify(cues[j].respuesta);
      cues[j].idCuestionario = this.id;
      cues[j].respuestaCorrecta = cues[j].respuestaCorrecta?.toString();
      this.observables.push(this.cuestionarioService.enviarCuestionario(cues[j]))
    }

    this.cuestionarioTitulos = {
      descripcion: this.cuestionarioTitulos.descripcion,
      idFormulario: this.id,
      titulo: this.cuestionarioTitulos.titulo
    };



    forkJoin(this.observables).pipe(
      concatMap((resp: Array<ResponseInterfaceTs>) => {
        return this.cuestionarioService.actualizarModDesc(this.cuestionarioTitulos).
        pipe(
          concatMap((resp:ResponseInterfaceTs) => {
            this.id = Number(this.routeA.snapshot.paramMap.get('id'));
            this.getCuestionario(this.id);


            this._snackBar.openFromComponent(MensajeSnackBarComponent, {
              duration: 2500,
              data: 'El exámen se ha guardado con éxito',
              panelClass: ['custom-snackbar']
            });
            return of('')
          })
        )
        }
      )
    ).subscribe()
  }

  handleEliminarPregunta(index: any) {
    // Handle the elimination logic
  }


  arrayONumber(str : string) : boolean{
    // let arrayONumber : boolean = false;
    //Para saber si es array
      try {
        const arr = JSON.parse(str);
        Array.isArray(arr);
        return true;
      } catch (e) {
        //Si no es array, es number
        return false
      }
      // !isNaN(Number(str)) && !isNaN(parseFloat(str))
  }
}
