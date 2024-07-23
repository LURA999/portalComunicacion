import { Component, ElementRef, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatCard } from '@angular/material/card';
import { MatRadioButton } from '@angular/material/radio';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DynamicInputComponent } from '../componentes/dynamic-input/dynamic-input.component';


export interface cuestionario {
  idCuestionario : Number;
  cuestionario : Number;
  pregunta : string;
  tipoQuestion : Number;
  respuesta : any
}

@Component({
  selector: 'app-araiza-aprende-formulario',
  templateUrl: './araiza-aprende-formulario.component.html',
  styleUrls: ['./araiza-aprende-formulario.component.css']
})
export class AraizaAprendeFormularioComponent {

  //cuestion 1 : pregunta con opciones
  //cuestionario 2: pregunta sin opciones
  quiz : Array<cuestionario> =
  [
    {
    idCuestionario: 1,
    cuestionario: 1,
    pregunta: "Pregunta 1",
    tipoQuestion: 2,
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
      tipoQuestion: 1,
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
      tipoQuestion: 2,
      respuesta:
      [
        {
          title : "A",
          state : false,
          id: 4
        },
        {
          title : "B",
          state : true,
          id: 5
        },
        {
          title : "C",
          state : false,
          id: 6
        },
      ]

      },
  ]

  @ViewChild('placeholder', {read: ViewContainerRef, static: true}) placeholder!: ViewContainerRef;



  constructor(private _renderer : Renderer2){

  }

  ngAfterViewInit(): void {
    this.placeholder.clear();

    for (let i = 0; i < this.quiz.length; i++) {
      this.createComponentP({
        title: this.quiz[i].pregunta,
        id:'1',
        index:1
      });

      if (this.quiz[i].tipoQuestion == 2) {
        for (let x = 0; x < this.quiz[i].respuesta.length; x++) {
          this.createComponentRRadioButton({
            title: this.quiz[i].respuesta[x]["title"],
            id: this.quiz[i].respuesta[x]["id"],
            state: this.quiz[i].respuesta[x]["state"],
            index:1
          });
        }
      }else{
        this.createComponentMatFormField({
          title: this.quiz[i].pregunta,
          id:'1',
          index:1,
          respuesta: this.quiz[i].respuesta
        });
      }

    }


  }
  ngOnInit(): void {


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
      const componentRef = this.placeholder.createComponent(DynamicInputComponent);
      componentRef.instance.placeholder = 'Respuesta';
      componentRef.instance.respuesta = p.respuesta;
      componentRef.changeDetectorRef.detectChanges();
  }

  //Creando checkBox
  createComponentRCheckBox(
    p: { title: string, id: string, state: boolean, index:number },
    _event? : any) {
    let titleElm = this._renderer.createText(p.title);
    let ref = this.placeholder?.createComponent(MatCheckbox)
    ref.instance.id = p.id ;
    ref.instance.checked = p.state;
    ref.instance.color = "primary"
    let elm = ref.location.nativeElement as HTMLElement | any;
    // this._renderer.listen(elm, 'click', (event:any) => { this.destruirCheckbox(ref,Number(input.id),input.index,_event)});
    // this._renderer.listen(elm, 'keydown', (event:any) => { this.destruirCheckbox(ref,Number(input.id),input.index,_event)});
    elm.firstChild.lastChild.appendChild(titleElm);
    this._renderer.addClass(elm, 'mat-checkbox')
    ref.changeDetectorRef.detectChanges();
  }

  //Creando RadioButton
  createComponentRRadioButton(
    p: { title: string, id: string, state: boolean, index:number },
    _event? : any) {
    let titleElm = this._renderer.createText(p.title);
    let ref = this.placeholder?.createComponent(MatRadioButton)
    ref.instance.id = p.id ;
    ref.instance.checked = p.state;
    ref.instance.color = "primary"
    let elm = ref.location.nativeElement as HTMLElement | any;
    // this._renderer.listen(elm, 'click', (event:any) => { this.destruirCheckbox(ref,Number(input.id),input.index,_event)});
    // this._renderer.listen(elm, 'keydown', (event:any) => { this.destruirCheckbox(ref,Number(input.id),input.index,_event)});
    elm.firstChild.lastChild.appendChild(titleElm);
    this._renderer.addClass(elm, 'mat-radiobutton')
    ref.changeDetectorRef.detectChanges();
  }

}
