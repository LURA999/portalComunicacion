import { Component, inject, input, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuestionariosService } from 'src/app/core/services/cuestionarios.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { CreateQuestionComponent } from '../../componentes/create-question/create-question.component';
import { cuestionario } from '../../araiza-aprende-formulario/araiza-aprende-formulario.component';
import { catchError, concatMap, forkJoin, lastValueFrom, Observable, of } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar } from '@angular/material/snack-bar';
import { MensajeSnackBarComponent } from '../../shared/custom-snack-bar/custom-snack-bar.component';
import { E } from '@angular/cdk/keycodes';

export interface cuestionarioTitulos  {
  idFormulario? : number,
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
  cuestionarioTitulos?: cuestionarioTitulos = {
    descripcion : '',
    titulo: ''
  };
  private _snackBar = inject(MatSnackBar);
  observables : Array<Observable<ResponseInterfaceTs>> = []

  //Con este podemos acceder a todos los componetes createQuestion
  @ViewChildren(CreateQuestionComponent) hijos!: QueryList<CreateQuestionComponent>;
  cuestionarioPreguntas: Array<cuestionario> = [
  { idCuestionario: 1,
    idPregunta: 1,
    pregunta: '', 
    respuesta: [
      {id: 0, title: ''} 
    ], 
    tipoQuestion: 2,
    cantidadRespuestas: 2,
    respuestaCorrecta: 0
   } 
  ];
  cuestionarioPreguntasResp : Array<cuestionario> = [];
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
    if (this.paramUrl === "questionnaires-modify") {
      //En este caso se refleja si se esta accediendo a una cuestionario, rempalzando los valores de la variable "cuestionarioPreguntas"
      this.id = Number(this.routeA.snapshot.paramMap.get('id'));
      this.getCuestionario(this.id);
    } 
  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

  getCuestionario(id: number): void {
    this.cuestionarioPreguntasResp = []
    this.cuestionarioService.getCuestionarioTituloById(id).pipe(
      catchError(e => {
        throw 'Error'
      })
    ).subscribe(
      (data : ResponseInterfaceTs) => {     
          
        this.cuestionarioTitulos = data.container[0];
      }
    );

    this.cuestionarioService.getCuestionarioPreguntasById(id).pipe(
      catchError( e => { throw "Server error" } )
    ).subscribe(
      (data : ResponseInterfaceTs) => {
        this.cuestionarioPreguntas = data.container;
        console.log(this.cuestionarioPreguntas);
        
        this.cuestionarioPreguntas.forEach((pregunta: any) => {   
          //it will created a backup       
          this.cuestionarioPreguntasResp.push(pregunta)

          pregunta.respuesta = JSON.parse(pregunta.respuestas);

          pregunta.tipoQuestion = pregunta.tipoPregunta;
          pregunta.respuestaCorrecta = this.arrayONumber(pregunta.respuestaCorrecta)
          ? JSON.parse(pregunta.respuestaCorrecta)
          : Number(pregunta.respuestaCorrecta);
        });
        this.contadorPreguntas = this.cuestionarioPreguntas.length
      }
    );
  }

 // HAY QUE  CHECAR ESTA FUNCION
  agregarPregunta(){
    this.cuestionarioPreguntas.push({
      idCuestionario: this.idCuestionario,
        idPregunta: this.idPregunta,
        pregunta: '', 
        respuesta: [
          {id: 0, title: ''} 
        ], 
        tipoQuestion: 2,
        cantidadRespuestas: 2,
        respuestaCorrecta: 0  
    });
    //here there is noise
    /* for (let z = 0; z < this.cuestionarioPreguntas.length; z++) {
      this.cuestionarioPreguntas[z].idPregunta = 1+z;
    } */
    
  }

  eliminarPregunta(valor : number){
    this.cuestionarioPreguntas.splice(
      this.cuestionarioPreguntas.findIndex(e =>e.idPregunta === Number(valor))
      , 1);
  }


  regresarMenu(){
    this.route.navigate(["/menu/questionnaires-menu"]);
  }

  // form submit
  async updateCuestionario(){
    let cues : Array<cuestionario> = []
    
    
  //updated old answers with values 
  for (let j = 0; j < this.hijos.length; j++) {
      
    /**
     * En este apartado se tiene que eliminar la respuesta que tienen los usuarios registrados, si se 
     *  eliminacia o agrega una respuesta de cualquier pregunta, 
     * ya que no se puede tener un control completo del campo en la base de datos.
     */

    cues.push(this.hijos.get(j)!.enviarDatos());
    console.log(this.hijos.get(j)!.enviarDatos());
    
    console.log(cues[j]);
    
    cues[j].respuesta = JSON.stringify(cues[j].respuesta);
    
    if(this.hijos.get(j)!.buttonEliminar) {
      // console.log(this.hijos.get(j)!.buttonEliminar);
      // console.log(cues[j].idPregunta);
      await lastValueFrom(this.cuestionarioService.eliminarRespuesta(cues[j].idPregunta ))
    }
    cues[j].idCuestionario = this.id;
    cues[j].respuestaCorrecta = cues[j].respuestaCorrecta?.toString();
    await lastValueFrom(this.cuestionarioService.enviarCuestionario(cues[j]))
  }

    //removed old questions that there isn't in our main quiz
    for (let x = 0; x < this.cuestionarioPreguntasResp.length; x++) {
      if(!cues.find((e : cuestionario) => e.idPregunta == this.cuestionarioPreguntasResp[x].idPregunta)){
        await lastValueFrom(this.cuestionarioService.eliminarPregunta(this.cuestionarioPreguntasResp[x].idPregunta))
      }
    }

    //inserted new questions to our quiz if there is
    for (let x = 0; x < cues.length; x++) {
      if(!this.cuestionarioPreguntasResp.find((e : cuestionario) => e.idPregunta == cues[x].idPregunta)){  
       await lastValueFrom(this.cuestionarioService.insertarCuestionario(cues[x]))
      }
    }
    this.cuestionarioTitulos = {
      descripcion: this.cuestionarioTitulos ? this.cuestionarioTitulos.descripcion : '',
      idFormulario: this.id,
      titulo: this.cuestionarioTitulos ? this.cuestionarioTitulos.titulo : ''
    };

    lastValueFrom(this.cuestionarioService.actualizarModDesc(this.cuestionarioTitulos!)).
    then( (resp:ResponseInterfaceTs) => {
      this.id = Number(this.routeA.snapshot.paramMap.get('id'));
      this.getCuestionario(this.id);


      this._snackBar.openFromComponent(MensajeSnackBarComponent, {
        duration: 2500,
        data: 'The exam has been saved successfully',
        panelClass: ['custom-snackbar']
      });
    })
  }

  sendCuestionario()  { 
    
    let cues : Array<cuestionario> = []
    this.cuestionarioTitulos = {
      descripcion: this.cuestionarioTitulos ? this.cuestionarioTitulos.descripcion : '',
      idFormulario: this.id,
      titulo: this.cuestionarioTitulos ? this.cuestionarioTitulos.titulo : ''
    };
   

    this.cuestionarioService.insertarModDesc(this.cuestionarioTitulos).pipe( 
      catchError(err => {
        throw 'Error al insertar el custionario' // Retorna un valor por defecto en caso de error
      }),
      concatMap(async (obs0 :ResponseInterfaceTs) =>  {     
        this.idCuestionario = Number(obs0.container[0]["ultimoId"])        
        for (let j = 0; j < this.hijos.length; j++) {
          cues.push(this.hijos.get(j)!.enviarDatos());
          cues[j].respuesta = JSON.stringify(cues[j].respuesta);
          cues[j].idCuestionario = this.idCuestionario;
          cues[j].respuestaCorrecta = cues[j].respuestaCorrecta?.toString(); 
          await lastValueFrom(this.cuestionarioService.insertarCuestionario(cues[j]))
        }                
        return of('') 
      })
    ).subscribe(() => {      
      this.route.navigateByUrl("/menu/questionnaires-menu")
    })
    
    
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
      
      //!isNaN(Number(str)) && !isNaN(parseFloat(str))
  }
}
