 import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicInputComponent } from '../../componentes/dynamic-input/dynamic-input.component';
import { localService } from 'src/app/core/services/local.service';
import { AraizaAprendeService } from 'src/app/core/services/araiza_aprende.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { Router } from '@angular/router';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { concatMap, of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { CreateQuestionComponent } from '../../componentes/create-question/create-question.component';

@Component({
  selector: 'app-cuestionarios-config',
  templateUrl: './cuestionarios-config.component.html',
  styleUrl: './cuestionarios-config.component.css'
})
export class CuestionariosConfigComponent {

@ViewChild('preguntas', {read: ViewContainerRef, static: true}) preguntas!: ViewContainerRef;

componentRef : any[] = [];
componentRef2 : any[] = [];
indexRadioButton :number = 0;
indexCheckBox :number = 0;
paramUrl : string = this.route.url.split("/")[2];
arrayPreguntas : any[] = [];
contadorPreguntas : number = 0;


formularios: any;
locales: any;

form : FormGroup = this.fb.group({
  cveFormulario : ["", Validators.required],
  cveLocal : ["", Validators.required]
});

  constructor(
    private DataService : DataNavbarService,
    private local: localService,
    public route : Router,
    private fb : FormBuilder,
    private aaprendeServicio: AraizaAprendeService){
    aaprendeServicio.imprimirFormularios().subscribe((resp: ResponseInterfaceTs) => {
      this.formularios = resp.container
    })

    local.todoLocal(-1).subscribe((resp: ResponseInterfaceTs)=> {
      this.locales = resp.container;
    })
  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

  descargarExcel(){
  if (this.form.valid) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Employee Data");

    this.aaprendeServicio.imprimirDatosPrincipalesForm(this.form.value["cveFormulario"]).pipe((
    concatMap((resp3 : ResponseInterfaceTs) => {
      let row : Array<String> = []

      return this.aaprendeServicio.imprimirFormularioPreguntas(this.form.value["cveFormulario"]).pipe((
        concatMap((resp1 : ResponseInterfaceTs) => {
          const today = new Date();
          const formattedDate = format(today, 'MM-dd-yyyy');
          worksheet.addRow([resp3.container[0]["titulo"], 'Fecha: '+formattedDate]);
          worksheet.getCell('A1').font = { bold: true };

          row.push("Nombre completo")
          for (let i = 0; i < resp1.container.length; i++) {
            row.push(resp1.container[i].pregunta)
          }
          //row de preguntas
          row.push('Promedio');
          worksheet.addRow(row);
          return this.aaprendeServicio.imprimirFormularioRespuestas(0, this.form.value["cveFormulario"], this.form.value["cveLocal"]).pipe((
            concatMap((resp2 : ResponseInterfaceTs) =>{
              let contadorR1 : number = 0;
              let guardarpreguntas : Array<String> = []
              let correctaContador : number = 0
              let usuarioContador : number = 1

              for (let x = 0; x < resp2.container.length; x++) {
                let tipoPregunta = Number(resp2.container[x]["tipoPregunta"]);
                if (tipoPregunta == 2 || tipoPregunta == 3 || tipoPregunta == 4) {
                  let arrayBoolStr : Array<boolean> | string= JSON.parse(resp2.container[x]["respuesta"]) as Array<boolean> | string;
                  if (resp1.container.length > contadorR1) {
                    guardarpreguntas.push(this.procedimientoSeparar(resp2, x, tipoPregunta, resp1, contadorR1, arrayBoolStr))
                  }else{
                    contadorR1 = 0;
                    guardarpreguntas.push(this.procedimientoSeparar(resp2, x, tipoPregunta, resp1, contadorR1, arrayBoolStr))
                  }
                  if (contadorR1 < resp1.container.length && tipoPregunta == 2) {
                    if(guardarpreguntas[contadorR1] === JSON.parse(resp1.container[contadorR1]["respuestas"])[resp1.container[contadorR1]["respuestaCorrecta"]].title as String){
                      correctaContador++;
                    }
                  }
                  if (tipoPregunta == 4 && resp1.container[contadorR1]["respuestaCorrecta"] ===  resp2.container[contadorR1]["respuesta"]  ){
                      correctaContador++
                  }
                  contadorR1++;
                }
                if (contadorR1 ==  resp1.container.length ) {
                  guardarpreguntas.unshift(resp2.container[(contadorR1 * usuarioContador)-1].nombre);
                  guardarpreguntas.push((correctaContador/resp1.container.length).toString());
                  worksheet.addRow(guardarpreguntas)
                  guardarpreguntas = [];
                  correctaContador = 0;
                  usuarioContador++;
                }
              }
              workbook.xlsx.writeBuffer().then((data : any) => {
                let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                fs.saveAs(blob, resp3.container[0]["titulo"]+'-'+new Date().valueOf()+'.xlsx');
              });
              return of("")
            })
          ))
        })))
    })))
    .subscribe()


  }
  }

  procedimientoSeparar(resp2: any, x : number, tipoPregunta :number, resp1 : any, contadorR1 : number, arrayBoolStr :string | boolean[]) : String {
    // 1.1 Se obtiene el array booleano o string
    let respuesta : string = ""

    if (tipoPregunta == 2 || tipoPregunta == 3) {
      if (tipoPregunta == 2) {
        //En este caso solamente se busca la respuesta que fue elegida en las preguntas de tipo radiobutton
        return (arrayBoolStr as Array<boolean>).indexOf(true) == -1? '' :
        JSON.parse(resp1.container[contadorR1]["respuestas"])[(arrayBoolStr as Array<boolean>).indexOf(true)].title;
      }else{
        //En este cas se acomulan las respuestas en los checkbox

          for (let i = 0; i < (arrayBoolStr as Array<boolean>).length; i++) {
            if ((arrayBoolStr as Array<boolean>)[i] === true) {
              respuesta +=" "+JSON.parse(resp1.container[contadorR1]["respuestas"])[i].title
            }
          }
          return respuesta;
      }
    }else if (tipoPregunta == 4){
      let resp1Container = JSON.parse(resp1.container[contadorR1]["respuestaCorrecta"]);
      let resp2Container = JSON.parse(resp2.container[contadorR1]["respuesta"]);
      for (let z = 0; z < resp1Container.length; z++) {
        respuesta +=" "+(JSON.parse(resp1.container[contadorR1]["respuestas"])[resp2Container[z]].title)
      }
      return respuesta;
    }
    return ''
  }


  agregarPregunta(){
    const componentRef  = this.preguntas.createComponent(CreateQuestionComponent);
    this.arrayPreguntas.push(componentRef);
    this.contadorPreguntas++;

    componentRef.instance.buttonEliminar.subscribe((id: number) => {
      this.contadorPreguntas--;
      console.log(this.contadorPreguntas);
      componentRef.destroy();
    });

  }



  


}
