import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Subscription } from 'rxjs';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { localService } from 'src/app/core/services/local.service';
import { imgVideoModel } from 'src/app/interfaces_modelos/img-video.model';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';

export interface locales {
  idLocal : number
  local : string
  cantidad : number
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

  formImgVideo : FormGroup = this.fb.group({
    fechaInicial : [new Date(this.data.fechaInicial+"T00:00:00"), Validators.required],
    fechaFinal : [new Date(this.data.fechaFinal+"T00:00:00"), Validators.required],
    imgVideo : [this.data.imgVideo, Validators.required],
    cveLocal : [this.data.cveLocal, Validators.required],
    titulo : [this.data.titulo, Validators.required],
    descripcion : [this.data.descripcion, Validators.required],
    link : [this.data.link,Validators.required]
  })

  constructor( private fb : FormBuilder,public dialogRef: MatDialogRef<EditarNoticiaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: imgVideoModel,private serviceImgVideo : SubirImgVideoService, private local : localService) {
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
      this.rango =new Date(this.data.fechaInicial+"T00:00:00")
    }

    if(this.rango2 == undefined){
      this.rango2 =new Date(this.data.fechaFinal+"T00:00:00")
    }
  }

  subirImg(evt : any){
    this.nombreActualizadoImgVid = true

    const target : any = <DataTransfer>(evt.target).files[0];
    const reader= new FileReader()
    reader.readAsDataURL(target)
    reader.onload = () => {
      this.formImgVideo.patchValue({
        imgVideo : reader.result
      })
    }
    this.formData.append('info', target, target.name);
  }
 async enviandoDatos() {
    if (this.formImgVideo.valid == false) {
      alert("Por favor llene todos los campos");
    } else {
    //registrando id y formato
    let id = this.data.idNoticia;
    let formato = this.data.formato;
    this.data = this.formImgVideo.value;
    this.data.idNoticia = id;
    this.data.formato = formato;

     //Se eliminara la anterior imagen, si esque se remplazo el actual
    if (this.nombreActualizadoImgVid === true) {
      await lastValueFrom(this.serviceImgVideo.eliminarDirImgVideo(Number(this.data.idNoticia),"imgVideoNoticia"))
      //despues se actualizara la imagen nueva que eligio
      let datos = await (await lastValueFrom(this.serviceImgVideo.subirImgVideo2(this.formData,"imgVideoNoticia"))).container;
      this.data.imgVideo = datos.nombre
      this.data.formato = datos.tipo
    }

    //Si o si, se actualizaran los datos, aunque no se tenga una nueva imagen
    await lastValueFrom(this.serviceImgVideo.actualizarImgVideo(this.data,"imgVideoNoticia"))

    //al final se llaman todos los datos para llenar nuevamente la lista de imagenes
    this.$sub.add(this.serviceImgVideo.todoImgVideo("imgVideoNoticia",-1,1,0,-1).subscribe((resp:ResponseInterfaceTs) =>{
      this.dialogRef.close(resp.container)
    }))
    }
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }
}
