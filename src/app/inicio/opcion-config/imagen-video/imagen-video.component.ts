import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { imgVideoModel } from 'src/app/interfaces/img-video.model';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import { localService } from 'src/app/core/services/local.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';

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
    input : ["", Validators.required]
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

  constructor(private DataService : DataNavbarService,
    private fb : FormBuilder,
    private serviceImgVid : SubirImgVideoService,
    public route : Router,
    private local : localService) {
      this.secciones_local(1);
     /* window.addEventListener("keypress", function(event){
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
    this.url()
    this.formatoVideo = this.target.type
    this.formData.forEach((file :any)=> {
      this.formImgVideo.patchValue({
        imgVideo : file.name
      })
    });
  }

  async enviandoDatos(){
    if (this.formImgVideo.valid == false) {
      alert("Por favor llene todos los campos");
    } else {
      this.activar = true
      this.url()
      let intfz : imgVideoModel  = this.formImgVideo.value
      intfz.cveSeccion = this.cveSeccion
      intfz.formato =  this.formatoVideo
      console.log(this.formImgVideo);

      this.$sub.add(this.serviceImgVid.subirImgVideo2(this.formData,"imgVideo",this.cveSeccion).subscribe(async (resp:ResponseInterfaceTs)=>{
        intfz.dir = resp.container.directorio;
        if (this.cveSeccion == 1 ||  this.cveSeccion == -1) {
          intfz.imgVideo = resp.container.nombre;
        } else {
          intfz.imgVideo = this.nombreNuevo
        }
        await lastValueFrom(this.serviceImgVid.subirImgVideo(intfz,"imgVideo",this.actualizar)).then(()=>{
          if(this.cveSeccion == 1 ||  this.cveSeccion == -1){
            this.route.navigate(['general/galeriaMulti'])
          }else{
            this.formImgVideo.reset()
            this.formatoVideo = ""
            this.target = undefined
          }

        })
      }))
    }
  }

  secciones_local(opc : number){
    this.url()
    this.$sub.add(this.local.todoLocal(opc).subscribe(async (resp:ResponseInterfaceTs)=>{
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
  }

  private url(){
    let paramUrl : string = this.route.url.split("/")[2];
    let extension : string = ""
    try {
    extension = this.target.type.split("/")[1]
    } catch (error) { }

    switch (paramUrl) {
      case "slider":
        this.titulo = "SLIDER";
        this.cveSeccion = 1;
        this.actualizar = false;
        break;
      case "menu":
        this.titulo = "MENÚ";
        this.cveSeccion = 2;
        this.actualizar = true;
        this.nombreNuevo = "menu_"+this.formImgVideo.value.cveLocal+"."+extension;
        break;
      case "cumpleanos":
        this.titulo = "CUMPLEAÑOS";
        this.cveSeccion = 3;
        this.actualizar = true;
        this.nombreNuevo = "cumpleanos_"+this.formImgVideo.value.cveLocal+"."+extension;
        break;
      case "aniversario":
        this.titulo = "ANIVERSARIO";
        this.cveSeccion = 4;
        this.actualizar = true;
        this.nombreNuevo = "aniversario_"+this.formImgVideo.value.cveLocal+"."+extension;
        break;
      case "empleado-del-mes":
        this.titulo = "EMPLEADO DEL MES";
        this.cveSeccion = 5;
        this.actualizar = true;
        this.nombreNuevo = "empleado_mes_"+this.formImgVideo.value.cveLocal+"."+extension;
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
    if(this.formImgVideo.valid ===false && this.activar === false || this.formImgVideo.valid ===true && this.activar === true){
      return true
    }else{
      return false
    }
  }
}
