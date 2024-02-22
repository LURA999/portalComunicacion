import { Component,Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, concat, concatMap, lastValueFrom, Observable, Subscription } from 'rxjs';
import { AutocapacitacionService } from 'src/app/core/services/autocapacitacion.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { capacitacion } from '../crear-autocapac/crear-autocapac.component';

@Component({
  selector: 'app-editar-autocapac',
  templateUrl: './editar-autocapac.component.html',
  styleUrls: ['./editar-autocapac.component.css']
})
export class EditarAutocapacComponent {
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
 capacitacionInterfaz : capacitacion[] = []
 date : Date = new Date()
 rango : Date | undefined
 rango2 : Date | undefined
 title : String = ''
 $sub : Subscription = new Subscription()

 formAutoCapac : FormGroup = this.fb.group({
    idCapacitacion : [ '' , Validators.required],
    nombre : [ '' , Validators.required],
    img : [ '' ],
    link : [ '', Validators.required ]
 })
 targetFile : any
 insertarImagen : boolean = false
 formData : FormData = new FormData();

 constructor(
  private fb : FormBuilder,
  public dialogRef: MatDialogRef<EditarAutocapacComponent>,
  private autoService : AutocapacitacionService,
  @Inject(MAT_DIALOG_DATA) private data: capacitacion,
  private autocapacServ : AutocapacitacionService) {

    this.$sub.add(this.autocapacServ.mostrarTodoAutocapacitacion().pipe(
    catchError( _ => {
      throw "Error in source."
   })
   ).subscribe(async(resp: ResponseInterfaceTs)=>{
       for await (const i of resp.container) {
         this.capacitacionInterfaz.push({
           idCapacitacion : i.idCapacitacion,
           nombre : i.nombre,
           img : i.img,
           link : i.link
         })
       }
      //  this.capacitacionInterfaz.shift()
     }))
    }


 ngOnInit(): void {
   /* if (this.data !== undefined) {
     this.formAutoCapac = this.fb.group({
       nombre : [this.data.nombre, Validators.required],
       cveLocal : [ this.data.cveLocal , Validators.required],
       link : [ this.data.link , Validators.required],
       img : [ '' ]

     })
     this.modalidad = false;
   }else{
     this.modalidad = true;
   } */
 }


 async enviandoDatos(){
  if (this.formAutoCapac.valid == false) {
    alert("Por favor llene todos los campos");
  } else {
    this.data= this.formAutoCapac.value
    let Observable : Observable<ResponseInterfaceTs>[] = [];

    if (this.insertarImagen === true) {
      this.modalidad = true;
      Observable.push(this.autoService.eliminarAutocapacitacionImagen(this.data.idCapacitacion!));
      //despues se actualizara la imagen nueva que eligio
      Observable.push(this.autoService.insertarImagenAutocapacitacion(this.formData))

      Observable.push(this.autoService.actualizarAutocapacitacion(this.data));

    }else{
      Observable.push(this.autoService.actualizarAutocapacitacion(this.data));
    }

    if (this.insertarImagen === true) {
    Observable[0].pipe(
    concatMap( () => Observable[1].pipe(
      concatMap((res: ResponseInterfaceTs) => {
      this.data.img = res.container['nombre']
        return Observable[2].pipe(
        catchError(_ => {
          throw "Error in source.";
        }
      ))
    })
    ).pipe(() => this.autoService.mostrarTodoAutocapacitacionHotel(0)))
    ).subscribe(async (resp:ResponseInterfaceTs)=>{


    })
  }else{
    Observable[0].pipe(
      concatMap(()=> this.autoService.mostrarTodoAutocapacitacionHotel(0))).subscribe(async(resp:ResponseInterfaceTs)=>{
        this.dialogRef.close(await resp.container);
      });


  }

  }
 }

 ngOnDestroy(): void {
   this.$sub.unsubscribe()
 }

 clickSelect(cap : capacitacion){

  this.formAutoCapac.patchValue({
    nombre :  cap.nombre ,
    link :  cap.link ,
    img :  cap.img
  })


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
}
