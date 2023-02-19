import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
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
  selector: 'app-editar',
  templateUrl: './editar-slider.component.html',
  styleUrls: ['./editar-slider.component.css']
})
export class EditarSliderComponent implements OnInit {

  localInterfaz :locales[] = []
  nombreActualizadoImgVid : boolean = false
  $sub : Subscription = new Subscription()

  date : Date = new Date()
  rango : Date | undefined
  rango2 : Date | undefined
  formData : FormData = new FormData();
  formImgVideo : FormGroup = this.fb.group({
    fechaInicial : [new Date(this.data.obj.fechaInicial+"T00:00:00"), Validators.required],
    fechaFinal : [new Date(this.data.obj.fechaFinal+"T00:00:00"), Validators.required],
    imgVideo : [this.data.obj.imgVideo, Validators.required],
    cveLocal : [this.data.obj.cveLocal, Validators.required],
    link : [this.data.obj.link ===undefined && this.data.obj.link ===null? '': this.data.link],
    posicion : [Number(this.data.obj.posicion), Validators.required]
  })
  constructor(
    private fb : FormBuilder,
    public dialogRef: MatDialogRef<EditarSliderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceImgVideo : SubirImgVideoService,
    private local : localService,
    ) {
      this.$sub.add(this.local.todoLocal(1).subscribe(async(resp: ResponseInterfaceTs)=>{
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
    this.nombreActualizadoImgVid = true
    const target : any = <DataTransfer>(evt.target).files;
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
      let id = this.data.obj.idImgVideo;
      let formato = this.data.obj.formato;
      if (this.data.obj ==  this.formImgVideo.value) {
        console.log("Son iguales");
      } else {
        console.log("No son iguales");
      }

      this.data.obj = this.formImgVideo.value;
      this.data.obj.idImgVideo = id;
      this.data.obj.formato = formato;

      if (this.nombreActualizadoImgVid === true) {
        //Se eliminara la anterior imagen, si esque se remplazo el actual
        await lastValueFrom(this.serviceImgVideo.eliminarDirImgVideo(Number(this.data.obj.idImgVideo),"imgVideo"))
        //despues se actualizara la imagen nueva que eligio
        let datos = await (await lastValueFrom(this.serviceImgVideo.subirImgVideo2(this.formData,"imgVideo"))).container;
        this.data.obj.imgVideo = datos.nombre
        this.data.obj.formato = datos.tipo
      }

      //Si o si, se actualizaran los datos, aunque no se tenga una nueva imagen
      await lastValueFrom(this.serviceImgVideo.actualizarImgVideo(this.data,"imgVideo"))

      //al final se llaman todos los datos para llenar nuevamente la lista de imagenes
      this.$sub.add(this.serviceImgVideo.todoImgVideo("imgVideo",-1,1,0,-1).subscribe((resp:ResponseInterfaceTs) =>{
        this.dialogRef.close(resp.container)
      }))
    }
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

}
