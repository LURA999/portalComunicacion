import { Component, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { DynamicInputComponent } from '../componentes/dynamic-input/dynamic-input.component';
import { DynamicRadioGroupComponent, opcionRadioButton } from '../componentes/dynamic-radio-group/dynamic-radio-group.component';
import { DynamicCheckboxGroupComponent } from '../componentes/dynamic-checkbox-group/dynamic-checkbox-group.component';


export interface cuestionario {
  idCuestionario : Number;
  cuestionario : Number;
  pregunta : string;
  tipoQuestion : Number;
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
  indexMatFormField :number = 0;

  /* quiz : Array<cuestionario> =
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
      idCuestionario: 2,
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
  ] */

    quiz : Array<cuestionario> =
  [
    {
    idCuestionario: 1,
    cuestionario: 1,
    pregunta: "1. ¿Cuál es el propósito principal de Microsoft Teams?",
    tipoQuestion: 2,
    respuesta:
    [
      {
        title : "a. Facilitar la comunicación y colaboración empresarial.",
        state : false,
        id: 1
      },
      {
        title : "b. Organizar archivos personales.",
        state : false,
        id: 2
      },
      {
        title : "c. Crear diseños personalizados.",
        state : false,
        id: 3
      },
      {
        title : "d. Programar vacaciones para el personal.",
        state : false,
        id: 4
      },
    ]
    },
    {
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "2. ¿Qué herramientas podemos encontrar en la barra vertical izquierda? ",
      tipoQuestion: 3,
      respuesta:
      [
        {
          title : "a. Chat",
          state : false,
          id: 1
        },
        {
          title : "b. Equipos",
          state : false,
          id: 2
        },
        {
          title : "c. Calendario",
          state : false,
          id: 3
        },
        {
          title : "d. Llamadas",
          state : false,
          id: 4
        },
        {
          title : "e. Archivos",
          state : false,
          id: 5
        },
        {
          title : "f. Conversaciones",
          state : false,
          id: 6
        },
        {
          title : "g. Agenda",
          state : false,
          id: 7
        },
        {
          title : "h. Buscador",
          state : false,
          id: 8
        },
        {
          title : "i. Vacaciones",
          state : false,
          id: 9
        },
      ]
    },
    {
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "3. Para borrar, editar, responder o anclar un mensaje de chat, debo:",
      tipoQuestion: 2,
      respuesta:
      [
        {
          title : "a.	Pedirle a mi compañero que edite el mensaje.",
          state : false,
          id: 1
        },
        {
          title : "b.	Poner el cursor encima del mensaje para que aparezcan los tres puntos para seleccionar alguna opción.",
          state : false,
          id: 2
        },
        {
          title : "c.	Poner el cursor a un lado del mensaje para que me muestre más opciones.",
          state : false,
          id: 3
        },
        {
          title : "d.	Tener cuidado al escribir mis mensajes.",
          state : false,
          id: 4
        },
      ]
    },
    {
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "4.	¿Qué herramienta se utiliza principalmente para la comunicación en equipos en Microsoft Teams?",
      tipoQuestion: 2,
      respuesta:
      [
        {
          title : "a.	Actividades.",
          state : false,
          id: 1
        },
        {
          title : "b.	Chat.",
          state : false,
          id: 2
        },
        {
          title : "c.	Equipos.",
          state : false,
          id: 3
        },
        {
          title : "d.	Archivos.",
          state : false,
          id: 4
        },
      ]
    },
    {
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "5.	¿Qué función cumple el icono de la campana en la barra de herramientas de Teams?",
      tipoQuestion: 2,
      respuesta:
      [
        {
          title : "a.	Agendar videollamadas.",
          state : false,
          id: 1
        },
        {
          title : "b.	Chat.",
          state : false,
          id: 2
        },
        {
          title : "c.	Equipos.",
          state : false,
          id: 3
        },
        {
          title : "d.	Archivos.",
          state : false,
          id: 4
        },
      ]
    },
    {
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "6.	¿Qué sección de Teams permite enviar mensajes directos a uno o varios destinatarios?",
      tipoQuestion: 2,
      respuesta:
      [
        {
          title : "a.	Actividades.",
          state : false,
          id: 1
        },
        {
          title : "b.	Equipos.",
          state : false,
          id: 2
        },
        {
          title : "c.	Chat.",
          state : false,
          id: 3
        },
        {
          title : "d.	Llamadas.",
          state : false,
          id: 4
        },
      ]
    },
    {
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "7.	¿Dónde puedes encontrar un historial de tus archivos recientes en Teams?",
      tipoQuestion: 2,
      respuesta:
      [
        {
          title : "a.	En la sección de Equipos.",
          state : false,
          id: 1
        },
        {
          title : "b.	En la sección de Llamadas. ",
          state : false,
          id: 2
        },
        {
          title : "c.	En la sección de Archivos.",
          state : false,
          id: 3
        },
        {
          title : "d.	En la sección de Calendario.",
          state : false,
          id: 4
        },
      ]
    },
    {
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "8.	¿Cuál es la función del calendario en Microsoft Teams?",
      tipoQuestion: 2,
      respuesta:
      [
        {
          title : "a.	Ver el historial de llamadas.",
          state : false,
          id: 1
        },
        {
          title : "b.	Agendar videollamadas y organizar la jornada.",
          state : false,
          id: 2
        },
        {
          title : "c.	Manipular el diseño de la plataforma.",
          state : false,
          id: 3
        },
        {
          title : "d.	Editar mensajes en el chat.",
          state : false,
          id: 4
        },
      ]
    },
    {
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "9.	¿Qué puedes hacer con los tres puntos ubicados junto a tu foto de perfil en Microsoft Teams?",
      tipoQuestion: 2,
      respuesta:
      [
        {
          title : "a.	Cambiar el diseño de la barra de herramientas.",
          state : false,
          id: 1
        },
        {
          title : "b.	Cambiar tu foto de perfil.",
          state : false,
          id: 2
        },
        {
          title : "c.	Mostrar un mensaje de estado.",
          state : false,
          id: 3
        },
        {
          title : "d.	Todas las anteriores.",
          state : false,
          id: 4
        },
      ]
    },
    {
      idCuestionario: 1,
      cuestionario: 1,
      pregunta: "10.	¿Qué función tiene la flecha diagonal en el chat de Teams?",
      tipoQuestion: 2,
      respuesta:
      [
        {
          title : "Borra mensajes no deseados.",
          state : false,
          id: 1
        },
        {
          title : "b.	Abre el chat en una ventana flotante.",
          state : false,
          id: 2
        },
        {
          title : "c.	Inicia una videollamada.",
          state : false,
          id: 3
        },
        {
          title : "d.	Responde directamente a un mensaje.",
          state : false,
          id: 4
        },
      ]
    },
  ]

  @ViewChild('placeholder', {read: ViewContainerRef, static: true}) placeholder!: ViewContainerRef;
  componentRef : any[] = [];
  componentRef2 : any[] = [];
  componentRef3 : any[] = [];


  constructor(private _renderer : Renderer2){


  }

  enviar(){
    let i1 : number = 0, i2 : number = 0, i3 : number = 0;
    for (let i = 0; i < this.quiz.length; i++) {
      switch (this.quiz[i].tipoQuestion) {
        case 1:
            this.componentRef[i1].instance.opciones;
            this.quiz[i].respuesta = this.componentRef[i1].instance.respuesta;
            i1++;
          break;
        case 2:
            this.componentRef2[i2].instance.opciones;
            this.quiz[i].respuesta = this.componentRef2[i2].instance.opciones
            i2++;
          break;
        case 3:
            this.componentRef3[i3].instance.opciones;
            this.quiz[i].respuesta =this.componentRef3[i3].instance.opciones;
            i3++;
          break;
        default:
          break;
      }
    }

    console.log(this.quiz);


  }

  ngAfterViewInit(): void {
    this.placeholder.clear();

    for (let i = 0; i < this.quiz.length; i++) {
      this.createComponentP({
        title: this.quiz[i].pregunta,
        id:'1',
        index:1
      });

      switch (this.quiz[i].tipoQuestion) {
        case 1:
          this.createComponentMatFormField({
            title: this.quiz[i].pregunta,
            id:'1',
            index:1,
            respuesta: this.quiz[i].respuesta as string
          });
          break;
        case 2:
            this.componentRef2[this.indexRadioButton] = this.placeholder.createComponent(DynamicRadioGroupComponent);
            this.componentRef2[this.indexRadioButton].instance.opciones = this.quiz[i].respuesta as opcionRadioButton[];
            this.componentRef2[this.indexRadioButton].changeDetectorRef.detectChanges();
            this.indexRadioButton++;
          break;
        case 3:
            this.componentRef3[this.indexCheckBox] = this.placeholder.createComponent(DynamicCheckboxGroupComponent);
            this.componentRef3[this.indexCheckBox].instance.opciones = this.quiz[i].respuesta as opcionRadioButton[];
            this.componentRef3[this.indexCheckBox].changeDetectorRef.detectChanges();
            this.indexCheckBox++;
          break;
        default:
          break;
      }
    }
  }

  //Pregunta - Titulo "Texto"
  createComponentP(
    p: { title: string, id: string, index:number },
    _event? : any) {
    let ref2 = this.placeholder?.createComponent(MatCard);
    let elm2 = ref2.location.nativeElement as HTMLElement;
    this._renderer.setProperty(elm2, 'innerText', p.title);
    this._renderer.setStyle(elm2,'background', 'transparent');
    this._renderer.setStyle(elm2,'box-shadow', 'none');
    ref2.changeDetectorRef.detectChanges();
  }

  //Creando MatFormField
  createComponentMatFormField(
    p: { title: string, id: string, index:number, respuesta:string },
    _event? : any) {
      this.componentRef[this.indexMatFormField] = this.placeholder.createComponent(DynamicInputComponent);
      this.componentRef[this.indexMatFormField].instance.placeholder = 'Respuesta';
      this.componentRef[this.indexMatFormField].instance.respuesta = p.respuesta;
      this.componentRef[this.indexMatFormField].changeDetectorRef.detectChanges();
      this.indexMatFormField++;
  }

}
