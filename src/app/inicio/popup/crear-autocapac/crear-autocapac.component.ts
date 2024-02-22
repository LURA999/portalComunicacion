import { Component,Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, concat, concatMap, lastValueFrom, Observable, Subscription } from 'rxjs';
import { AutocapacitacionService } from 'src/app/core/services/autocapacitacion.service';
import { localService } from 'src/app/core/services/local.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { autocapacitacionInt } from '../../opcion-config/autocapac-config/autocapac-config.component';
import { locales } from '../editar-slider/editar-slider.component';


export interface capacitacion {
  idCapacitacion? : number;
  nombre : string;
  link? : string;
  img? : string;
}

@Component({
  selector: 'app-crear-autocapac',
  templateUrl: './crear-autocapac.component.html',
  styleUrls: ['./crear-autocapac.component.css']
})
export class CrearAutocapacComponent {
 /**
   * @modalidad : con esta variable se puede identificar si estas actualizando o insertando
   * una autocapacitacion
   * @localInterfaz : este array se llena de todos las ciudades con sus respectiva cantidad de autocapacitaciones
   * @date : variable que se usa para identificar en que fechas estas actualmente en el calendario
   * @rango : variable que se usa cuando eliges la fecha inicial y con esto se respalda con el rango2
   * @rango2 : variable que se usa cuando eliges la fecha final y con esto se respalda con el rango
   * @$sub : variable que almacena a todos los observables para despues liberarlos cuando se cierra este componente
   * @formAutoCapac : en esta variable se asignan todas las variables que deben de existir en el formulario
   */

 modalidad : boolean = false;
 localInterfaz :locales[] = []
 date : Date = new Date()
 rango : Date | undefined
 rango2 : Date | undefined
 title : String = ''
 $sub : Subscription = new Subscription()
 formAutoCapac : FormGroup = this.fb.group({
   nombre : [ '' , Validators.required],
   img : [ '' ],
   link : [ '' , Validators.required]
 })
 targetFile : any
 insertarImagen : boolean = false
 formData : FormData = new FormData();

 constructor(
  private fb : FormBuilder,
  public dialogRef: MatDialogRef<CrearAutocapacComponent>,
  private autoService : AutocapacitacionService,
  @Inject(MAT_DIALOG_DATA) private data: capacitacion,
  private local : localService) {
  }


 ngOnInit(): void {
   if (this.data !== undefined) {
     this.formAutoCapac = this.fb.group({
       nombre : [ ],
       img : [ ],
       link : [ ]

     })
     this.modalidad = false;
   }else{
     this.modalidad = true;
   }
 }


 async enviandoDatos(){
   if (this.formAutoCapac.valid == false || this.insertarImagen == false) {
     alert("Por favor llene todos los campos");
   } else {
    this.data= this.formAutoCapac.value;
    let Observable : Observable<ResponseInterfaceTs>[] = [];

    Observable.push(this.autoService.insertarImagenAutocapacitacion(this.formData).pipe(
      concatMap((res : ResponseInterfaceTs) => {
        this.data.img = res.container['nombre']
        return this.autoService.insertarAutocapacitacion(this.data)})
    ));

    Observable.push(this.autoService.mostrarTodoAutocapacitacionHotel(0))

    Observable[0].pipe(
      concatMap(() => Observable[1].pipe(
        concatMap(async (resp: ResponseInterfaceTs) => {
          this.dialogRef.close(await resp.container);
        })
      ))).subscribe();

   }

 }

 subirImg(evt : any){
  this.targetFile = <DataTransfer>(evt.target).files[0];

  if (this.targetFile.type.split("/")[0] === "image" && (this.targetFile.size/1024)<=2048) {
    this.insertarImagen = true
    const reader= new FileReader()
    reader.readAsDataURL(this.targetFile )
    reader.onload = () => {
      this.formAutoCapac.patchValue({
        img : this.targetFile.name
      })
    }
    this.formData.append('info', this.targetFile, this.targetFile.name);
  }else{
    if (this.targetFile.type.split("/")[0] !== "image") {
      alert("Solo se permiten subir imagenes");
    } else {
      alert("Solo se permiten subir imagenes menores o igual a 2MB");
    }
    this.targetFile  = new DataTransfer()
    let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
    inpimg2.value="";

  }

}

 ngOnDestroy(): void {
   this.$sub.unsubscribe()
 }
}
