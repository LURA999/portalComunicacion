import { Component, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatCard } from '@angular/material/card';


export interface cuestionario {
  idCuestionario : Number;
  cuestionario : Number;
  question : String;
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
    question: "Pregunta 1",
    tipoQuestion: 1,
      respuesta: {
        resp: "holaa"
      }
    },
  ]
  @ViewChild('placeholder', {read: ViewContainerRef, static: true}) placeholder!: ViewContainerRef;



  constructor(private _renderer : Renderer2){

  }

  ngOnInit(): void {
    this.placeholder.clear();
    for (let i = 0; i < this.quiz.length; i++) {

      this.createComponent({
        title:'hola',
        id:'1',
        state: false,
        index:1
      });

    }

  }

  //Con pregunta incluida
  createComponent(input: { title: string, id: string, state: boolean, index:number },_event? : any) {

    let titleElm2 = this._renderer.createText(input.title);
    let ref2 = this.placeholder?.createComponent(MatCard)
    let elm2 = ref2.location.nativeElement as HTMLElement | any;
    // elm2
    // elm2.firstChild.lastChild.appendChild(titleElm2);
    /* this._renderer.addClass(elm2, 'mat-card')
    ref2.changeDetectorRef.detectChanges();*/

    let titleElm = this._renderer.createText(input.title);
    let ref = this.placeholder?.createComponent(MatCheckbox)
    ref.instance.id = input.id ;
    ref.instance.checked = input.state;
    ref.instance.color = "primary"
    let elm = ref.location.nativeElement as HTMLElement | any;
    // this._renderer.listen(elm, 'click', (event:any) => { this.destruirCheckbox(ref,Number(input.id),input.index,_event)});
    // this._renderer.listen(elm, 'keydown', (event:any) => { this.destruirCheckbox(ref,Number(input.id),input.index,_event)});
    elm.firstChild.lastChild.appendChild(titleElm);
    this._renderer.addClass(elm, 'mat-checkbox')
    ref.changeDetectorRef.detectChanges();
    //ref.instance.change.subscribe(val => this.matCheckboxMap[input.id] = val.checked);
  }

}
