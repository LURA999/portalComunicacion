import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Subscription } from 'rxjs';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { localService } from 'src/app/core/services/local.service';
import { dosParamInt } from 'src/app/interfaces_modelos/dosParamInt.interface';
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
    link : [this.data.obj.link ===undefined || this.data.obj.link ===null || this.data.obj.link ===''? '': this.data.obj.link],
    posicion : [Number(this.data.obj.posicion), Validators.required]
  })
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");

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

      this.contenedor_carga.style.display = "block";

      // viejos valores
      const posicion2 =  this.data.obj.posicion;
      const cveLocal2 = this.data.obj.cveLocal;
      const id = this.data.obj.idImgVideo;
      const formato = this.data.obj.formato;

      //registrando id y formato
      this.data.obj = this.formImgVideo.value;
      this.data.obj.idImgVideo = id;
      this.data.obj.posicion2 = posicion2;
      this.data.obj.cveLocal2 = cveLocal2;
      this.data.obj.formato = formato;


      if (this.nombreActualizadoImgVid === true) {
        //Se eliminara la anterior imagen, si esque se remplazo el actual
        await lastValueFrom(this.serviceImgVideo.eliminarDirImgVideo(Number(this.data.obj.idImgVideo),"imgVideo"))
        //despues se actualizara la imagen nueva que eligio
        let datos = await (await lastValueFrom(this.serviceImgVideo.subirImgVideo2(this.formData,"imgVideo"))).container;
        this.data.obj.imgVideo = datos.nombre
        this.data.obj.formato = datos.tipo
      }

      if(Number(this.data.obj.posicion) == Number(this.data.obj.posicion2) &&
      Number(this.data.obj.cveLocal) == Number(this.data.obj.cveLocal2)
      && Number(this.data.obj.cveLocal2) == Number(this.data.obj.cveLocal)) {

        await lastValueFrom(this.serviceImgVideo.actualizarImgVideo(this.data,"imgVideo"))
      }

      //Esto nomas se hizo unicamente para el cambio de posiciones entre un mismo hotel
      if(Number(this.data.obj.posicion) !== Number(this.data.obj.posicion2) && Number(this.data.obj.cveLocal2) == Number(this.data.obj.cveLocal)) {

        await lastValueFrom(this.serviceImgVideo.actualizarPosicionUCSlide({cveLocal: this.formImgVideo.value['cveLocal'],cveSeccion: this.data.obj.cveSeccion,idP:this.formImgVideo.value["posicion"],idS:this.data.obj.posicion2}))
        await lastValueFrom(this.serviceImgVideo.actualizarImgVideo(this.data,"imgVideo"))
      }

      //Esto se encargara de cambiar de hoteles correctamente
      if( Number(this.data.obj.cveLocal) != Number(this.data.obj.cveLocal2)) {

        await lastValueFrom(this.serviceImgVideo.actualizarImgVideo(this.data,"imgVideo"))

        let dosParamInt : any = {
          idP1 : Number(this.data.obj.posicion),
          idP2 : Number(this.data.obj.idImgVideo),
          cveLocal : Number(this.data.obj.cveLocal),
          cveSeccion : 1
        }

        await lastValueFrom(this.serviceImgVideo.actualizarPosicionTUVSlide(dosParamInt));


        dosParamInt = {
          idP : Number(this.data.obj.posicion2),
          idS : 0,
          cveLocal : Number(this.data.obj.cveLocal2),
          cveSeccion : 1
        }

        await lastValueFrom(this.serviceImgVideo.eliminarPosicionTDSlide(dosParamInt));



      }

      //Si o si, se actualizaran los datos, aunque no se tenga una nueva imagen


      //al final se llaman todos los datos para llenar nuevamente la lista de imagenes
      this.$sub.add(this.serviceImgVideo.todoImgVideo("imgVideo",-1,1,0,-1).subscribe((resp:ResponseInterfaceTs) =>{
        this.dialogRef.close(resp.container)
        this.contenedor_carga.style.display = "none";
      }))
    }
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

}


/* array(9) {
  ["fechaInicial"]=> string(24) "2023-02-20T08:00:00.000Z"
  ["fechaFinal"]=> string(24) "2023-03-30T07:00:00.000Z"
  ["imgVideo"]=> string(7) "mug.png"
  ["cveLocal"]=> string(1) "2"
  ["link"]=> string(3) "www"
  ["posicion"]=> int(3)
  ["idImgVideo"]=> string(3) "136"
  ["posicion2"]=> string(1) "3"
  ["formato"]=> string(5) "image"
} */
