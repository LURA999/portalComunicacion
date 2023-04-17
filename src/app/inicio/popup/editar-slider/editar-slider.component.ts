import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription,Observable, concatMap, of, catchError } from 'rxjs';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { localService } from 'src/app/core/services/local.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { ChangeDetectorRef } from '@angular/core';

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
  @ViewChild('miBoton') miBoton!: MatButton;
  target! : any
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
  activar : boolean = false;

  constructor(
    private fb : FormBuilder,
    public dialogRef: MatDialogRef<EditarSliderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceImgVideo : SubirImgVideoService,
    private local : localService,
    private cdRef: ChangeDetectorRef
    ) {
      this.$sub.add(this.local.todoLocal(1).pipe(
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
    this.target  = <DataTransfer>(evt.target).files[0];
    const image = new Image();

    image.onload = () => {
    // if (Number(image.naturalWidth) == 2550 && Number(image.naturalHeight) == 800) {
      if( ((this.target.size/1024)<=2048 )){
        this.nombreActualizadoImgVid = true
        const reader= new FileReader()
        reader.readAsDataURL(this.target)
        reader.onload = () => {
          this.formImgVideo.patchValue({
            imgVideo : reader.result
          })
        }
        this.formData.append('info', this.target, this.target.name);
      }else{
        alert("Solo se permiten imagenes menores o igual a 2MB");
        this.target  = new DataTransfer()
        let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
        inpimg2.value="";

        }
    /* }else{
      alert("La imagen debe de cumplir con el ancho y la altura especificada");
      this.target  = new DataTransfer()
      let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
      inpimg2.value="";
    } */
    }

    if (this.target.type.split("/")[0] === "video") {
      if ((this.target.size/1024)<=51200) {
        this.nombreActualizadoImgVid = true
        const reader= new FileReader()
        reader.readAsDataURL(this.target)
        reader.onload = () => {
          this.formImgVideo.patchValue({
            imgVideo : reader.result
          })
        }
        this.formData.append('info', this.target, this.target.name);
      } else {
        alert("Solo se permiten videos menores o igual a 50MB");
        this.target  = new DataTransfer()
        let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
        inpimg2.value="";
      }
    } else {
      image.src = URL.createObjectURL(this.target);

    }
  }

 async enviandoDatos() {
    if (this.formImgVideo.valid == false) {
      alert("Por favor llene todos los campos");
    } else {

      this.contenedor_carga.style.display = "block";
      this.activar = true

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

      let Observable : Observable<ResponseInterfaceTs>[] = [];
      let dosParamInt : any
      let dosParamInt2 : any

      //actualizacion de archivo
       if (this.nombreActualizadoImgVid === true) {
        //Se eliminara la anterior imagen, si esque se remplazo el actual
        Observable.push(this.serviceImgVideo.eliminarDirImgVideo(Number(this.data.obj.idImgVideo),"imgVideo"))
        //despues se actualizara la imagen nueva que eligio
        Observable.push(this.serviceImgVideo.subirImgVideo2(this.formData,"imgVideo"))
        // this.data.obj.imgVideo = datos.nombre
        // this.data.obj.formato = datos.tipo
      }

      //(A)
      if(Number(this.data.obj.posicion) == Number(this.data.obj.posicion2) &&
      Number(this.data.obj.cveLocal) == Number(this.data.obj.cveLocal2)) {
        Observable.push(this.serviceImgVideo.actualizarImgVideo(this.data,"imgVideo"))
      }

      //(B)
      //Esto nomas se hizo unicamente para el cambio de posiciones entre un mismo hotel
      if(Number(this.data.obj.posicion) !== Number(this.data.obj.posicion2)
      && Number(this.data.obj.cveLocal2) == Number(this.data.obj.cveLocal)) {
        Observable.push(this.serviceImgVideo.actualizarPosicionUCSlide({cveLocal: this.formImgVideo.value['cveLocal'],cveSeccion: this.data.obj.cveSeccion,idP:this.formImgVideo.value["posicion"],idS:this.data.obj.posicion2}))
        Observable.push(this.serviceImgVideo.actualizarImgVideo(this.data,"imgVideo"))
      }

      //Esto se encargara de cambiar de hoteles correctamente
      if( Number(this.data.obj.cveLocal) != Number(this.data.obj.cveLocal2)) {
        Observable.push(this.serviceImgVideo.actualizarImgVideo(this.data,"imgVideo"))
        dosParamInt  = {
          idP1 : Number(this.data.obj.posicion),
          idP2 : Number(this.data.obj.idImgVideo),
          cveLocal : Number(this.data.obj.cveLocal),
          cveSeccion : 1
        }
        Observable.push(this.serviceImgVideo.actualizarPosicionTUVSlide(dosParamInt));
        dosParamInt2 = {
          idP : Number(this.data.obj.posicion2),
          idS : 0,
          cveLocal : Number(this.data.obj.cveLocal2),
          cveSeccion : 1
        }
        Observable.push(this.serviceImgVideo.eliminarPosicionTDSlide(dosParamInt2));
      }

      Observable.push(this.serviceImgVideo.todoImgVideo("imgVideo",-1,1,0,-1))


        this.$sub.add(of('').pipe(
          concatMap(()=> {
            if(this.nombreActualizadoImgVid === true ){
              return Observable[0].pipe(
                concatMap(()=> {
                return Observable[1].pipe(
                  concatMap((resp2:ResponseInterfaceTs) => {
                  this.data.obj.imgVideo = resp2.container.nombre
                  this.data.obj.formato = resp2.container.tipo

                  //(A)
                  if(Number(this.data.obj.posicion) == Number(this.data.obj.posicion2) &&
                  Number(this.data.obj.cveLocal) == Number(this.data.obj.cveLocal2)){
                    return Observable[2].pipe(
                      concatMap(() => Observable[3])
                    )
                  }
                  //(B)
                  if(Number(this.data.obj.posicion) !== Number(this.data.obj.posicion2)
                  && Number(this.data.obj.cveLocal) == Number(this.data.obj.cveLocal2)){
                    return Observable[2].pipe(
                    concatMap(() => Observable[3].pipe(
                      concatMap(() => Observable[4])
                    )
                    ))
                  }

                  if( Number(this.data.obj.cveLocal) != Number(this.data.obj.cveLocal2)) {
                    return Observable[2].pipe(concatMap(() =>
                     Observable[3].pipe(concatMap(() => Observable[4].pipe(
                      concatMap(()=> Observable[5])
                    )))))
                  }
                  return Observable[2]
                }))
              }))
            }
            //(A)
            if(Number(this.data.obj.posicion) == Number(this.data.obj.posicion2) &&
            Number(this.data.obj.cveLocal) == Number(this.data.obj.cveLocal2)){
              return Observable[0].pipe(
                concatMap(() => Observable[1])
              )
            }

            //(B)
            if(Number(this.data.obj.posicion) !== Number(this.data.obj.posicion2)
            && Number(this.data.obj.cveLocal) == Number(this.data.obj.cveLocal2)){
              return Observable[0].pipe(
              concatMap(() => Observable[1].pipe(
                concatMap(() => Observable[2])
              )
            ))
            }

            if( Number(this.data.obj.cveLocal) != Number(this.data.obj.cveLocal2)) {
              return Observable[0].pipe(
                concatMap(() =>Observable[1].pipe(
                  concatMap(() => Observable[2].pipe(
                    concatMap(() => Observable[3]
                    )
                  )
                  ))))
            }
            return Observable[0]
          })
        ).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe((resp:ResponseInterfaceTs)=>{
          this.dialogRef.close(resp.container)
          this.contenedor_carga.style.display = "none";
        }))
    }
  }
  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

}
