import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubirImgNoticiaService } from 'src/app/core/services/subirImgvideo.service';
import { catchError, concatMap, lastValueFrom, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { localService } from 'src/app/core/services/local.service';
import { imgVideoModel } from 'src/app/interfaces_modelos/img-video.model';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { MatButton } from '@angular/material/button';

export interface locales {
  idLocal : number
  local : string
  cantidad : number
}


@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css']
})
export class NoticiaComponent implements OnInit {

  localInterfaz : locales[] = []
  formData : FormData = new FormData();
  formatoVideo : string = ""
  paramUrl : string = this.route.url.split("/")[2];
  $sub : Subscription = new Subscription()
  activar : boolean = false
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");
  @ViewChild('miBoton2') miBoton!: MatButton;
  sliderNoticia :boolean = false;

  constructor(private DataService : DataNavbarService, private fb : FormBuilder,
    private serviceImgVideo : SubirImgNoticiaService,
    public route : Router,private local : localService,
    ) {
      this.$sub.add(this.local.todoLocal(2).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:ResponseInterfaceTs)=>{
        for await (const i of resp.container) {
          this.localInterfaz.push({
            idLocal : i.idLocal,
            local : i.nombre,
            cantidad : i.cantidad
          })
        }
    }))
  }

  date : Date = new Date()
  formImgVideo : FormGroup = this.fb.group({
    fechaInicial : ["", Validators.required],
    fechaFinal : ["", Validators.required],
    cveLocal : ["", Validators.required],
    titulo : ["", Validators.required],
    input : ["", Validators.required],
    descripcion : ["", Validators.required],
    link : ["", Validators.required]
  })
  rango : Date | undefined
  rango2 : Date | undefined

  imageURL : string = ""

  ngOnInit(): void {

  }

  fecha1(fecha : Date){
    this.rango = fecha
  }

  fecha2(fecha : Date){
    this.rango2 = fecha
  }

  async subirImg(evt : any){
    let target : any = <DataTransfer>(evt.target).files[0];
    const image = new Image();

    image.onload = () => {
      if( ((target.size/1024)<=2048 )){
        this.formData.append('info', target, target.name);
        this.formatoVideo = target.type
        this.formData.forEach((file :any)=> {
          this.formImgVideo.patchValue({
            imgVideo : file.name
          })
        });
        this.sliderNoticia = true;
        this.activarBut();
      }else{
        this.sliderNoticia = false;
        this.activarBut();
        alert("Solo se permiten imagenes menores o igual a 2MB");
        target  = new DataTransfer()
        let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
        inpimg2.value="";

        }
    }
    if (target.type.split("/")[0] === "video") {
      if ((target.size/1024)<=51200) {
        this.formData.append('info', target, target.name);
        this.formatoVideo = target.type
        this.formData.forEach((file :any)=> {
          this.formImgVideo.patchValue({
            imgVideo : file.name
          })
        });
        this.sliderNoticia = true;
        this.activarBut();
      } else {
        this.sliderNoticia = false;
        this.activarBut();
        alert("Solo se permiten videos menores o igual a 50MB");
       target  = new DataTransfer()
        let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
        inpimg2.value="";
      }
    } else {
      image.src = URL.createObjectURL(target);

    }
  }

 async enviandoDatos() {
  this.activarBut();

    if(this.miBoton.disabled === false){
    if (this.formImgVideo.valid == false) {
      alert("Por favor llene todos los campos");
    } else {
      this.contenedor_carga.style.display = "block";

      this.activar = true
      let intfz : imgVideoModel  = this.formImgVideo.value
      intfz.formato = this.formatoVideo

      this.$sub.add(this.serviceImgVideo.subirImgVideo2(this.formData).pipe(
        concatMap((resp:ResponseInterfaceTs) => {
          intfz.dir = resp.container.directorio;
          intfz.imgVideo = resp.container.nombre;
          return this.serviceImgVideo.subirImgVideo(intfz,"imgVideoNoticia")
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

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
    this.miBoton.disabled = true;

  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }


  activarBut(){
    if((this.formImgVideo.valid ===false && this.activar === false || this.formImgVideo.valid ===true && this.activar === true) || this.sliderNoticia === false){
      this.miBoton.disabled = true;
    }else{
      this.miBoton.disabled = false;
    }
  }
}
