import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Subscription } from 'rxjs';
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

      this.$sub.add(this.local.todoLocal(2).subscribe(async(resp: ResponseInterfaceTs)=>{
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

     //Se eliminara la anterior imagen, si esque se remplazo el actual
    if (this.nombreActualizadoImgVid === true) {
      await lastValueFrom(this.serviceImgVideo.eliminarDirImgVideo(Number(this.data.obj.idNoticia),"imgVideoNoticia"))
      //despues se actualizara la imagen nueva que eligio
      let datos = await (await lastValueFrom(this.serviceImgVideo.subirImgVideo2(this.formData,"imgVideoNoticia"))).container;
      this.data.obj.imgVideo = datos.nombre
      this.data.obj.formato = datos.tipo
    }

    //Si o si, se actualizaran los datos, aunque no se tenga una nueva imagen
    await lastValueFrom(this.serviceImgVideo.actualizarImgVideo(this.data.obj,"imgVideoNoticia"))

    //al final se llaman todos los datos para llenar nuevamente la lista de imagenes
    this.$sub.add(this.serviceImgVideo.todoImgVideo("imgVideoNoticia",this.data.tipoNoticias,1,0,-1).subscribe((resp:ResponseInterfaceTs) =>{
      this.dialogRef.close(resp.container)
      this.contenedor_carga.style.display = "none";
    }))
    }
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }
}
