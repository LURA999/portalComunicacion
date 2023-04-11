import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { catchError, concatMap, forkJoin, lastValueFrom, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { imgVideoModel } from 'src/app/interfaces_modelos/img-video.model';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { localService } from 'src/app/core/services/local.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { dosParamInt } from 'src/app/interfaces_modelos/dosParamInt.interface';
import { MatButton } from '@angular/material/button';

export interface locales {
  idLocal : number
  local : string
  cantidad : number
}

@Component({
  selector: 'app-imagen-video',
  templateUrl: './imagen-video.component.html',
  styleUrls: ['./imagen-video.component.css']
})
export class ImagenVideoComponent implements OnInit {

  formImgVideo : FormGroup = this.fb.group({
    fechaInicial : ["", Validators.required],
    fechaFinal : ["", Validators.required],
    imgVideo : ["", Validators.required],
    cveLocal : ["", Validators.required],
    input : ["", Validators.required],
    link : [""],
    posicion : ["", Validators.required]
  })

  formData : FormData = new FormData();
  cveSeccion: number = -1;
  nombreNuevo : string = ""
  date : Date = new Date()
  rango : Date | undefined
  rango2 : Date | undefined
  paramUrl : string = this.route.url.split("/")[2];
  localInterfaz : locales[] = []
  formatoVideo : string = ""
  target: any
  actualizar : boolean = false
  $sub : Subscription = new Subscription()
  titulo : string = ""
  activar : boolean = false
  sliderListo :boolean = false;
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");
  @ViewChild('miBoton') miBoton!: MatButton;

  constructor(private DataService : DataNavbarService,
    private fb : FormBuilder,
    private serviceImgVid : SubirImgVideoService,
    public route : Router,
    private local : localService) {

      this.secciones_local(1);
     /*
     con esto desactivo el enter para el formulario
     window.addEventListener("keypress", function(event){
        if (event.keyCode == 13){
            event.preventDefault();
        }
    }, false);*/
    }

  ngOnInit(): void {
    this.url()
  }

  fecha1(fecha : Date){
    this.rango = fecha
  }

  fecha2(fecha : Date){
    this.rango2 = fecha
  }

   async subirImg(evt : any){
    this.target = <DataTransfer>(evt.target).files[0];
    const image = new Image();

    image.onload = () => {
    if (Number(image.naturalWidth) == 2550 && Number(image.naturalHeight) == 800) {
      if( ((this.target.size/1024)<=2048 )){
        this.url()
        this.formatoVideo = this.target.type
        this.formData.forEach((file :any)=> {
          this.formImgVideo.patchValue({
            imgVideo : file.name
          })
        });
        this.sliderListo = true;
        this.activarBut();
      }else{
        this.sliderListo = false;
        this.activarBut();
        alert("Solo se permiten imagenes menores o igual a 2MB");
        this.target  = new DataTransfer()
        let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
        inpimg2.value="";

        }
    }else{
      this.sliderListo = false;
      this.activarBut();
      alert("La imagen debe de cumplir con el ancho y la altura especificada");
      this.target  = new DataTransfer()
      let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
      inpimg2.value="";
    }
    }

    if (this.target.type.split("/")[0] === "video") {
      if ((this.target.size/1024)<=51200) {
        this.url()
        this.formatoVideo = this.target.type
        this.formData.forEach((file :any)=> {
          this.formImgVideo.patchValue({
            imgVideo : file.name
          })
        });
        this.sliderListo = true;
        this.activarBut();
      } else {
        this.sliderListo = false;
        this.activarBut();
        alert("Solo se permiten videos menores o igual a 50MB");
        this.target  = new DataTransfer()
        let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
        inpimg2.value="";
      }
    } else {
      image.src = URL.createObjectURL(this.target);

    }


  }

  async enviandoDatos(){
    this.activarBut();

    if(this.miBoton.disabled === false){

    if (this.formImgVideo.valid == false) {
      alert("Por favor llene todos los campos");
    } else {
      this.contenedor_carga.style.display = "block";

      this.activar = true
      this.url()
      let intfz : imgVideoModel  = this.formImgVideo.value
      intfz.cveSeccion = this.cveSeccion
      intfz.formato =  this.formatoVideo
      //en este paso se cambiara el nombre dependiendo de la seccion (pagina) en la que esten

      this.$sub.add(this.serviceImgVid.subirImgVideo2(this.formData,"imgVideo",this.cveSeccion).pipe(
        concatMap((resp1:ResponseInterfaceTs) =>{
          intfz.dir = resp1.container.directorio;
          if (this.cveSeccion == 1 ||  this.cveSeccion == -1) {
            intfz.imgVideo = resp1.container.nombre;
          } else {
            intfz.imgVideo = this.nombreNuevo
          }

          return this.serviceImgVid.subirImgVideo(intfz,"imgVideo",this.actualizar).pipe(
            concatMap((resp2:ResponseInterfaceTs) =>{
              if (Number(resp2.container[0]["pos"]) == 1) {
                let dosParamInt : dosParamInt = {
                  idP : Number(intfz.posicion),
                  idS : 0,
                  cveLocal : intfz.cveLocal,
                  cveSeccion : intfz.cveSeccion!
                }
                return this.serviceImgVid.actualizarPosicionTUSlide(dosParamInt).pipe(
                  concatMap(()=>{
                    dosParamInt = {
                      idP : Number(resp2.container[0].id),
                      idS : Number(intfz.posicion),
                      cveLocal : intfz.cveLocal,
                      cveSeccion : intfz.cveSeccion!
                    }
                    return this.serviceImgVid.actualizarPosicionUSlide(dosParamInt)
                  })
                )
              }else{
                if(this.cveSeccion == 1 ||  this.cveSeccion == -1){
                }else{
                  this.formImgVideo.reset()
                  this.formatoVideo = ""
                  this.target = undefined
                }
              }
              return of('')
            })
          )
        })
      ).pipe(
       catchError( _ => {
        throw "Error in source."
      })
    ).subscribe(()=>{
        this.route.navigate(['general/galeriaMulti-config'])
        this.contenedor_carga.style.display = "none";
      }))
    }
  }
  }

  secciones_local(opc : number){
    this.url()
    this.$sub.add(this.local.todoLocal(opc).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:ResponseInterfaceTs)=>{
      for await (const i of resp.container) {
        if( (this.cveSeccion == 1 ||  this.cveSeccion == -1) && Number(i.idLocal) >= 0 ||
          this.cveSeccion > 1 && Number(i.idLocal) > 0){
          this.localInterfaz.push({
            idLocal : i.idLocal,
            local : i.nombre,
            cantidad : i.cantidad
          })
        }
      }
    }))

  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
    this.miBoton.disabled = true;

  }

  private url(){
    let paramUrl : string = this.route.url.split("/")[2];
    let extension : string = ""
    try {
    extension = this.target.type.split("/")[1]
    } catch (error) { }
    //nombres ya prestablecidos para categorias, ya establecidas
    switch (paramUrl) {
      case "slider-config":
        this.titulo = "SLIDER";
        this.cveSeccion = 1;
        this.actualizar = false;
        break;

      }

    try {
      if(this.cveSeccion > 1 ){
        this.formData.append('info', this.target, this.nombreNuevo);
      }else{
        this.formData.append('info', this.target, this.target.name);
      }
    } catch (error) { }

  }

  rellenarTarget(){
    this.url()
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

  activarBut(){

    if((this.formImgVideo.valid ===false && this.activar === false || this.formImgVideo.valid ===true && this.activar === true) || this.sliderListo === false){
      this.miBoton.disabled = true;
    }else{
      this.miBoton.disabled = false;
    }
  }
}
