import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription } from 'rxjs';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { EditarNoticiaComponent } from 'src/app/inicio/popup/editar-noticia/editar-noticia.component';
import { EliminarComponent } from 'src/app/inicio/popup/eliminar/eliminar.component';
import { imgVideoModel } from 'src/app/interfaces_modelos/img-video.model';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-todo-noticias',
  templateUrl: './todo-noticias.component.html',
  styleUrls: ['./todo-noticias.component.css']
})
export class TodoNoticiasComponent implements OnInit {
  arrayVidImgGeneralN : imgVideoModel [] =  []
  arrayVidImgMexicaliN : imgVideoModel [] =  []
  arrayVidImgCalafiaN : imgVideoModel [] =  []
  arrayVidImgPalmiraN : imgVideoModel [] =  []
  arrayVidImgHermosilloN : imgVideoModel [] =  []
  arrayVidImgsanLuisN : imgVideoModel [] =  []
  cargando : boolean = false;
  $sub : Subscription = new Subscription()
  api : string = environment.api
  @Input() tipoNoticias! : number;
  constructor(private servicioMulti : SubirImgVideoService,
    private sanitizer : DomSanitizer,
    private dialog:NgDialogAnimationService,) { }

  ngOnInit(): void {
    this.cargando = false;
    this.$sub.add(this.servicioMulti.todoImgVideo("imgVideoNoticia",this.tipoNoticias,1,0,-1).subscribe(async (resp:ResponseInterfaceTs) =>{
      if (resp.status.toString() === "200") {
        for await (const i of resp.container) {
          switch (Number(i.cveLocal)) {
            case 0:
              this.arrayVidImgGeneralN.push(i)
              break;
            case 1:
              this.arrayVidImgMexicaliN.push(i)
              break;
            case 2:
              this.arrayVidImgCalafiaN.push(i)
              break;
            case 3:
              this.arrayVidImgsanLuisN.push(i)
              break;
            case 4:
              this.arrayVidImgPalmiraN.push(i)
              break;
            case 5:
              this.arrayVidImgHermosilloN.push(i)
              break;
          }
        }
      }
      this.cargando = true;
    }))
  }
  modificar( obj : imgVideoModel, noticiaSlider : Boolean, arrNumPos? : Number []){
    if (noticiaSlider === true) {
      //abriendo noticia
     let dialogRef = this.dialog.open(EditarNoticiaComponent, {
        height: 'auto',
        width: '450px',
        data: {obj,tipoNoticias : this.tipoNoticias},
      });

      dialogRef.afterClosed().subscribe(async (resp:any)=>{
        if (resp !== "" && resp !== undefined) {
        this.cargando = false;
        this.arrayVidImgGeneralN = []
        this.arrayVidImgMexicaliN = []
        this.arrayVidImgCalafiaN = []
        this.arrayVidImgPalmiraN = []
        this.arrayVidImgHermosilloN = []
        this.arrayVidImgsanLuisN = []

            for await (const i of resp) {
              switch (Number(i.cveLocal)) {
                case 0:
                  this.arrayVidImgGeneralN.push(i)
                  break;
                case 1:
                  this.arrayVidImgMexicaliN.push(i)
                  break;
                case 2:
                  this.arrayVidImgCalafiaN.push(i)
                  break;
                case 3:
                  this.arrayVidImgsanLuisN.push(i)
                  break;
                case 4:
                  this.arrayVidImgPalmiraN.push(i)
                  break;
                case 5:
                  this.arrayVidImgHermosilloN.push(i)
                  break;
              }
          }
          this.cargando = true;
        }
      })
    }
  }

  recursoUrl(src : string, categoria:boolean, tipo:boolean) : SafeResourceUrl {
    if (tipo === false) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+"imgVideo/galeria-noticia/fotos/"+src);
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+"imgVideo/galeria-noticia/videos/"+src);
    }
  }

  hayElementos() : boolean{
    if((this.arrayVidImgGeneralN.length != 0 ||
      this.arrayVidImgMexicaliN.length != 0 ||
      this.arrayVidImgCalafiaN.length != 0 ||
      this.arrayVidImgsanLuisN.length != 0 ||
      this.arrayVidImgPalmiraN.length != 0 ||
      this.arrayVidImgHermosilloN.length != 0)  || this.cargando ===false){
      return true;
    }else{
      return false;
    }
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

  eliminar(id :any, noticiaSlider : Boolean, model : imgVideoModel){
    if (noticiaSlider === true) {
      //abriendo noticia
      let dialogRef = this.dialog.open(EliminarComponent, {
        height: 'auto',
        width: 'auto',
        data:{id:Number(id), opc:noticiaSlider, seccion: "foto/imagen",tipoNoticias : this.tipoNoticias}
      });

      dialogRef.afterClosed().subscribe(async (resp:any)=>{
        //OPCION 2 PARA ELIMINAR UN ELEMENTO
        if(typeof resp !== 'boolean' && resp !== undefined ){
          if(this.arrayVidImgGeneralN.indexOf(model) > -1) {
            this.arrayVidImgGeneralN.splice(this.arrayVidImgGeneralN.indexOf(model),1)
          }else if(this.arrayVidImgMexicaliN.indexOf(model) > -1) {
            this.arrayVidImgMexicaliN.splice(this.arrayVidImgMexicaliN.indexOf(model),1)
          }else if(this.arrayVidImgCalafiaN.indexOf(model) > -1) {
            this.arrayVidImgCalafiaN.splice(this.arrayVidImgCalafiaN.indexOf(model),1)
          }else if(this.arrayVidImgPalmiraN.indexOf(model) > -1) {
            this.arrayVidImgPalmiraN.splice(this.arrayVidImgPalmiraN.indexOf(model),1)
          }else if(this.arrayVidImgHermosilloN.indexOf(model) > -1) {
            this.arrayVidImgHermosilloN.splice(this.arrayVidImgHermosilloN.indexOf(model),1)
          }else if(this.arrayVidImgsanLuisN.indexOf(model) >-1) {
            this.arrayVidImgsanLuisN.splice(this.arrayVidImgsanLuisN.indexOf(model),1)
          }
        }
      })
    }
  }
}
