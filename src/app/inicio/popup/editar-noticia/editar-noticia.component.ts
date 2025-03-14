import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Subscription, Observable, concatMap, concat, catchError } from 'rxjs';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { localService } from 'src/app/core/services/local.service';
import { imgVideoModel } from 'src/app/interfaces_modelos/img-video.model';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';

interface locales {
  idLocal : number
  local : string
  cantidad : number
}

interface dataForm {
  obj : imgVideoModel
  tipoNoticias : number
}

@Component({
  selector: 'app-editar-noticia',
  templateUrl: './editar-noticia.component.html',
  styleUrls: ['./editar-noticia.component.css']
})
export class EditarNoticiaComponent implements OnInit{

  /**
   * @localInterfaz : se usa para imprimir las ciudades, pero aparte tambien se imprime el total
   * de noticias que hay en ese hotel
   * @nombreActualizadoImgVid : esta variable se pone en true cuando capta que hay un cambio de imagenes,
   * aunque tengan el mismo nombre
   * @date : variable que se usa para identificar en que fechas estas actualmente en el calendario
   * @rango : variable que se usa cuando eliges la fecha inicial y con esto se respalda con el rango2
   * @rango2 : variable que se usa cuando eliges la fecha final y con esto se respalda con el rango
   * @formData :  Guarda el video o imagen que se envia en el input
   * @$sub : variable que almacena a todos los observables para despues liberarlos cuando se cierra este componente
   * @contenedor_carga : variable ayudante para activar el loading
   * @formImgVideo :  en esta variable se asignan todas las variables que deben de existir en el formulario
   */
  localInterfaz :locales[] = []
  nombreActualizadoImgVid : boolean = false
  date : Date = new Date()
  rango : Date | undefined
  rango2 : Date | undefined
  formData : FormData = new FormData();
  $sub : Subscription = new Subscription()
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");

  formImgVideo : FormGroup = this.fb.group({
    fechaInicial : [new Date(this.data.obj.fechaInicial+"T00:00:00"), Validators.required],
    fechaFinal : [new Date(this.data.obj.fechaFinal+"T00:00:00"), Validators.required],
    imgVideo : [this.data.obj.imgVideo, Validators.required],
    cveLocal : [this.data.obj.cveLocal, Validators.required],
    titulo : [this.data.obj.titulo, Validators.required],
    descripcion : [this.data.obj.descripcion, Validators.required],
    link : [this.data.obj.link,Validators.required]
  })

  constructor( private fb : FormBuilder,public dialogRef: MatDialogRef<EditarNoticiaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: dataForm ,private serviceImgVideo : SubirImgVideoService, private local : localService) {

      this.$sub.add(this.local.todoLocal(2).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async(resp: ResponseInterfaceTs)=>{
        for await (const i of resp.container) {
          this.localInterfaz.push({
            idLocal : i.idLocal,
            local : i.nombre,
            cantidad : i.cantidad
          })
        }
      }))
     }

  fecha1(fecha : Date){
    this.rango = fecha
  }

  fecha2(fecha : Date){
    this.rango2 = fecha
  }
  ngOnInit(): void {
    if(this.rango == undefined){
      this.rango =new Date(this.data.obj.fechaInicial+"T00:00:00")
    }

    if(this.rango2 == undefined){
      this.rango2 =new Date(this.data.obj.fechaFinal+"T00:00:00")
    }
  }

  subirImg(evt : any){

    let target : any = <DataTransfer>(evt.target).files[0];

    if( ((target.size/1024)<=2048 && target.type.split("/")[0] === "image") || ((target.size/1024)<=51200 && target.type.split("/")[0] === "video")){
    this.nombreActualizadoImgVid = true
    const reader= new FileReader()
    reader.readAsDataURL(target)
    reader.onload = () => {
      this.formImgVideo.patchValue({
        imgVideo : reader.result
      })
      this.formData.append('info', target, target.name);
    }}else{
      if (target.type.split("/")[0] === "image") {
        alert("Solo se permiten imagenes menores o igual a 2MB");
      } else {
        alert("Solo se permiten videos menores o igual a 50MB");
      }
      target  = new DataTransfer()
      let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
      inpimg2.value="";
    }
  }
 async enviandoDatos() {
    if (this.formImgVideo.valid == false) {
      alert("Por favor llene todos los campos");
    } else {
      this.contenedor_carga.style.display = "block";

    //registrando id y formato
    let id = this.data.obj.idNoticia;
    let formato = this.data.obj.formato;
    this.data.obj = this.formImgVideo.value;
    this.data.obj.idNoticia = id;
    this.data.obj.formato = formato;
    let Observable : Observable<ResponseInterfaceTs>[] = [];

     //Se eliminara la anterior imagen, si esque se remplazo el actual
    if (this.nombreActualizadoImgVid === true) {

      Observable.push(this.serviceImgVideo.eliminarDirImgVideo(Number(this.data.obj.idNoticia),"imgVideoNoticia"))
      Observable.push(this.serviceImgVideo.subirImgVideo2(this.formData,"imgVideoNoticia"))
    }

    Observable.push(this.serviceImgVideo.actualizarImgVideo(this.data.obj,"imgVideoNoticia"))
    Observable.push(this.serviceImgVideo.todoImgVideo("imgVideoNoticia",this.data.tipoNoticias,1,0,-1))

    if (Observable.length == 4) {
      Observable[0].pipe(
        concatMap(()=>{
          return Observable[1].pipe(
            concatMap((resp:ResponseInterfaceTs)=>{
            this.data.obj.imgVideo = resp.container.nombre
            this.data.obj.formato = resp.container.tipo
            return Observable[2].pipe(
              concatMap(() =>{
                return Observable[3]
              })
            )
          }))
        })
      ).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe((resp:ResponseInterfaceTs) =>{
          this.dialogRef.close(resp.container)
          this.contenedor_carga.style.display = "none";
        })
    }

    if (Observable.length == 2) {
      Observable[0].pipe(
        concatMap(() =>{
          return Observable[1]
        })
      ).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe((resp:ResponseInterfaceTs) =>{
        this.dialogRef.close(resp.container)
        this.contenedor_carga.style.display = "none";
      })
    }
    }
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }
}
