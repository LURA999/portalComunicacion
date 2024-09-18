import { Component, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { DynamicInputComponent } from '../componentes/dynamic-input/dynamic-input.component';
import { DynamicRadioGroupComponent, opcionRadioButton } from '../componentes/dynamic-radio-group/dynamic-radio-group.component';
import { DynamicCheckboxGroupComponent } from '../componentes/dynamic-checkbox-group/dynamic-checkbox-group.component';
import { AraizaAprendeService } from 'src/app/core/services/araiza_aprende.service';
import { concatMap, lastValueFrom, of } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ExamenEnviadoComponent } from '../popup/examen-enviado/examen-enviado.component';
import { DynamicDragDropComponent } from '../componentes/dynamic-drag-drop/dynamic-drag-drop.component';


export interface cuestionario {
  idCuestionario : number;
  idPregunta : number;
  pregunta : string;
  tipoQuestion : number;
  respuesta : Array<opcionRadioButton> | string;
}

@Component({
  selector: 'app-araiza-aprende-formulario',
  templateUrl: './araiza-aprende-formulario.component.html',
  styleUrls: ['./araiza-aprende-formulario.component.css']
})
export class AraizaAprendeFormularioComponent {

  //cuestion 1 : pregunta con opciones
  //cuestionario 2: pregunta sin opciones
  indexRadioButton :number = 0;
  indexCheckBox :number = 0;
  indexDragDrop :number = 0;
  indexMatFormField :number = 0;
  titulo : string = "";
  cuestionarioRespondido : boolean = false;
  id : number = Number(this.router.snapshot.paramMap.get("id"));

  quiz : Array<cuestionario> = [];
  quizRespaldo : Array<cuestionario> = [];

  @ViewChild('placeholder', {read: ViewContainerRef, static: true}) placeholder!: ViewContainerRef;
  componentRef : any[] = [];
  componentRef2 : any[] = [];
  componentRef3 : any[] = [];
  componentRef4 : any[] = [];

  agregarPx : boolean = true;
  // private luaStr : string = CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)


  constructor(
    private _renderer : Renderer2,
    private servicioForm : AraizaAprendeService,
    private auth : AuthService,
    private router: ActivatedRoute,
    private DataService : DataNavbarService,
    public dialog: MatDialog
  ){
    /*
      Este se codigo se creo, con la finalidad de dar entender que es un componente que es para usuarios normales,
      por tal razón, la barra al costado desaparecera (o se escondera).
    */
    this.DataService.open.emit(this.auth.getCveLocal() > 0 ? "sanluis" : "general");
    // this.auth.crearElm(CryptoJS.AES.encrypt(this.paramUrl,"Amxl@2019*-").toString(),"lua");
  }


  async enviar(){
   //ARRAY QUE RECORRE TODO EL JSON DEL CUESTIONARIO
    for (let i = 0; i < this.quiz.length; i++) {

      if(this.cuestionarioRespondido){
        //Entra a este codigo cuando el examen ya esta respondido
        //1.1 Se comparan las respuestas JSON
        if(JSON.stringify(this.quiz[i].respuesta) !== JSON.stringify(this.quizRespaldo[i].respuesta)
          && (this.quiz[i].tipoQuestion == 3 || this.quiz[i].tipoQuestion == 2) ){

           let arrBool : Boolean[] = []
           for (let x = 0; x < this.quiz[i].respuesta.length; x++) {
             //1.1.1 Se obtienen todos valores booleanos de las respuestas que tiene la pregunta
             arrBool.push((this.quiz[i].respuesta[x] as opcionRadioButton).state!)
           }
           //1.1.2 Se envia convertido en string y en estructura de array
          await lastValueFrom(this.servicioForm.editarRespuesta("["+arrBool.toString()+"]", this.quiz[i].idPregunta,this.auth.getId()))

         //1.2 Y SI NO Se comparan las respuestas STRING
         }else if(this.quiz[i].respuesta !== this.quizRespaldo[i].respuesta && this.quiz[i].tipoQuestion == 1){
           //1.2.1 Y se envia tal como esta.
           await lastValueFrom(this.servicioForm.editarRespuesta(this.quiz[i].respuesta.toString(), this.quiz[i].idPregunta,this.auth.getId()))

        }else if(/* JSON.stringify(this.quiz[i].respuesta) !== JSON.stringify(this.quizRespaldo[i].respuesta) && */
           this.quiz[i].tipoQuestion == 4){
          let arrNumber : number[] = []
          /**
           * elementos para manipular un radiobutton de manera dinamica:
           * id = identificador (nunca cambia)
           * stateDrag = orden en el cual esta actualmente ese objeto
           */
          for (let n = 0; n < this.quiz[i].respuesta.length; n++) {
           arrNumber.push((this.quiz[i].respuesta[n] as opcionRadioButton).id -1);
          }

          await lastValueFrom(this.servicioForm.editarRespuesta("["+arrNumber+"]", this.quiz[i].idPregunta,this.auth.getId()))
        }

      }else{
        //Entra a este codigo cuando el examen no esta respondido
        if( typeof this.quiz[i].respuesta !== "string"){
          console.log(this.quiz[i].respuesta);

          let arrBool : Boolean[] = []
          let arrNum: Number[] = []

          //como el examen es nuevo se tienen insertar todos los valores asi no esten respondidos, dentro del array
          if (this.quiz[i].tipoQuestion == 4) {
            for (let x = 0; x < this.quiz[i].respuesta.length; x++) {
              arrNum.push((this.quiz[i].respuesta[x] as opcionRadioButton).id - 1)
            }
          }else{
            for (let x = 0; x < this.quiz[i].respuesta.length; x++) {
             arrBool.push((this.quiz[i].respuesta[x] as opcionRadioButton).state!)
            }
          }

          await lastValueFrom(this.servicioForm.insertarRespuesta( arrNum.length == 0 ?"["+arrBool.toString()+"]":"["+arrNum.toString()+"]", this.quiz[i].idPregunta,this.auth.getId()))
        }else if(typeof this.quiz[i].respuesta === "string"){
          await lastValueFrom(this.servicioForm.insertarRespuesta(this.quiz[i].respuesta.toString(), this.quiz[i].idPregunta,this.auth.getId()))
        }
      }
    }
    this.abrirForm()
    this.rellenarFormulario();
  }

  abrirForm(){
    let dialogRef = this.dialog.open(ExamenEnviadoComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`); // Pizza!
    });
  }

  ngAfterViewInit(): void {
    /*
    este método realmente crea y rellena el formulario, dependiendo  si esta contestado o no.
    Por lo tanto el nombre del metodo esta mal expresado.
    */
    this.rellenarFormulario();
  }

  rellenarFormulario(){
  this.quiz = []
  this.quizRespaldo = []
  //En esta primera llamada, se confirma si el usuario acompleto el cuestionario
  this.servicioForm.imprimirFormularioRespuestas(this.auth.getId(), this.id, 0).pipe((
    concatMap((resp : ResponseInterfaceTs) => {
      console.log(resp);

      //Se piden los datos principales del form, obligatoriamente
      return this.servicioForm.imprimirDatosPrincipalesForm(this.id).pipe((
        concatMap((resp2 : ResponseInterfaceTs) => {
          this.titulo = resp2.container[0]["titulo"];
          if(resp.container.length == 0){
          //En el dado caso que no se realizo el cuestionario, se entrega uno vacio, para que lo llene
          return this.servicioForm.imprimirFormularioPreguntas(this.id).pipe((
            concatMap((resp3 : ResponseInterfaceTs) => {
              for (let i = 0; i < resp3.container.length; i++) {
                let nuevoArray : Array<opcionRadioButton> = JSON.parse(resp3.container[i]["respuestas"])
                if (Number(resp3.container[i]["tipoPregunta"]) == 4) {
                  let number : Array<number> = Array.from({ length: JSON.parse(resp3.container[i]["respuestas"]).length }, (_, index) => index);
                  number = this.mezclarArray(number)
                  for (let y = 0; y < nuevoArray.length; y++) {
                    nuevoArray[y].stateDrag = number[y];
                  }
                }
                this.quiz?.push(
                  {
                    idCuestionario:resp3.container[i]["fk_formulario"],
                    idPregunta: resp3.container[i]["idPregunta"],
                    pregunta: resp3.container[i]["pregunta"],
                    respuesta: nuevoArray as Array<opcionRadioButton>,
                    tipoQuestion: Number(resp3.container[i]["tipoPregunta"])
                  }
                )
              }
              return of("");
            })
          ))
          }else{
            this.cuestionarioRespondido = true;
            //En el dado caso que este tenga respondido cuestionario, se entrega uno con sus respuestas
            //1. Se modifica la respuesta del cuestionario con las respuestas del usuario, con la ayuda de la sig. variable
            let respuestasModificadas : Array<Array<opcionRadioButton>> = [];
            for (let x = 0; x < resp.container.length; x++) {
              let tipoPregunta = Number(resp.container[x]["tipoPregunta"]);
              //1.1 Se obtiene el array booleano, string o array number
              let arrayBoolStrNum : Array<boolean> | string | Array<number>= JSON.parse(resp.container[x]["respuesta"]) as Array<boolean> | string | Array<number>;

              /*las respuestas modificadas, son de las preguntas que ya han sido respondidas y fueron guardadas en la BD
              (o incluso pueden permanecer con un valor sin responder)*/
              respuestasModificadas.push(JSON.parse(resp.container[x]["respuestas"]) as Array<opcionRadioButton>)

              if ( tipoPregunta == 2 || tipoPregunta == 3 ) {
              //1.2 Modificando respuestas booleanas, de las preguntas te tipo booleano
                for (let y = 0; y < arrayBoolStrNum.length; y++) {
                  respuestasModificadas[x][y].state  = arrayBoolStrNum[y] as boolean;
                }
              } else if ( tipoPregunta == 1 ) {
              //1.3 Modificando respuestas string, de las preguntas te tipo string (tipoPregunta == 1)

              //Son preguntas de tipo abierta, pero aun no ha sido creada, porque por el momento no ha sido necesario

              } else if ( tipoPregunta == 4 ) {
                //1.4 Modificando el orden del drag drop, con la posicion guardada en la base de datos.
                for (let y = 0; y < arrayBoolStrNum.length; y++) {
                  respuestasModificadas[x][y].stateDrag = arrayBoolStrNum[y] as number;
                }
                }

            }

            //2. Se llena el array principal para las respuestas modificadas
            for (let i = 0; i < resp.container.length; i++) {
              this.quiz?.push(
                {
                  idCuestionario: resp.container[i]["fk_formulario"],
                  idPregunta: resp.container[i]["idPregunta"],
                  pregunta: resp.container[i]["pregunta"],
                  respuesta: respuestasModificadas[i],
                  tipoQuestion: Number(resp.container[i]["tipoPregunta"])
                }
              )

            //3. Se crea un respaldo de las respuestas originales
              this.quizRespaldo?.push(
                {
                  idCuestionario: resp.container[i]["fk_formulario"],
                  idPregunta: resp.container[i]["idPregunta"],
                  pregunta: resp.container[i]["pregunta"],
                  respuesta: respuestasModificadas[i].map(element =>  ({...element})),
                  tipoQuestion: Number(resp.container[i]["tipoPregunta"])
                }
              )
            }
            return of("");
          }
        })
      ))

  })))
  .subscribe((resp:any) =>{
    this.placeholder.clear();

    //1. En el siguiente codigo, se crea la pregunta
    for (let i = 0; i < this.quiz.length; i++) {
      //2. Creando un componente para almacenar el texto de la pregunta misma
      this.createComponentP({
        title: this.quiz[i].pregunta.toString(),
        id:'1',
        index:1
      });

      //3. En el siguiente codigo, se establece que tipo de pregunta es, un matformfield, un radiobutton o un checkbox
      switch (this.quiz[i].tipoQuestion) {
        case 1:
          this.createComponentMatFormField({
            title: this.quiz[i].pregunta.toString(),
            id: '1',
            index:1,
            respuesta: this.quiz[i].respuesta as string
          });
          break;

        //3.1 Este componente del caso 2, 3 y 4 ya esta creado en otros archivos ".ts", solamente se modifica sus respectivos valores
        //radiobutton
        case 2:
            this.componentRef2[this.indexRadioButton] = this.placeholder.createComponent(DynamicRadioGroupComponent);
            this.componentRef2[this.indexRadioButton].instance.opciones = this.quiz[i].respuesta as opcionRadioButton[];
            this.componentRef2[this.indexRadioButton].changeDetectorRef.detectChanges();
            this.indexRadioButton++;
          break;
        //checkbox
        case 3:
            this.componentRef3[this.indexCheckBox] = this.placeholder.createComponent(DynamicCheckboxGroupComponent);
            this.componentRef3[this.indexCheckBox].instance.opciones = this.quiz[i].respuesta as opcionRadioButton[];
            this.componentRef3[this.indexCheckBox].changeDetectorRef.detectChanges();
            this.indexCheckBox++;
          break;
        //drag drop
        case 4:
            this.componentRef4[this.indexDragDrop] = this.placeholder.createComponent(DynamicDragDropComponent);
            this.componentRef4[this.indexDragDrop].instance.opciones = this.quiz[i].respuesta as opcionRadioButton[];
            this.componentRef4[this.indexDragDrop].changeDetectorRef.detectChanges();
            this.indexDragDrop++;
          break;
        default:
          break;
      }
    }
  })
  }

  //1. En la funcion "createComponentP" y "createComponentMatFormField" se crean componentes creados desde 0

  //1.1 Pregunta - Titulo "Texto"
  createComponentP(
    p: { title: string, id: string, index:number },
    _event? : any) {
    let ref2 = this.placeholder?.createComponent(MatCard);
    let elm2 = ref2.location.nativeElement as HTMLElement;
    this._renderer.setProperty(elm2, 'innerText', p.title);
    this._renderer.setStyle(elm2,'background', 'transparent');
    this._renderer.setStyle(elm2,'box-shadow', 'none');
    if (!this.agregarPx) {
      this._renderer.setStyle(elm2,'margin-top', '20px');
    }else{
      this.agregarPx = false;
    }

    ref2.changeDetectorRef.detectChanges();
  }

  //1.2 Creando MatFormField
  createComponentMatFormField(
    p: { title: string, id: string, index:number, respuesta:string },
    _event? : any) {
      this.componentRef[this.indexMatFormField] = this.placeholder.createComponent(DynamicInputComponent);
      this.componentRef[this.indexMatFormField].instance.placeholder = 'Respuesta';
      this.componentRef[this.indexMatFormField].instance.respuesta = p.respuesta;
      this.componentRef[this.indexMatFormField].changeDetectorRef.detectChanges();
      this.indexMatFormField++;
  }


  /*
    Este metodo se usa para revolver las preguntas que involucran ordenar oraciones, porque las oraciones
    que manda la base de datos, estaran ordenadas
  */

  mezclarArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

}
