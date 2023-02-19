import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { imgVideoModel } from 'src/app/interfaces_modelos/img-video.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EditarSliderComponent } from '../../popup/editar-slider/editar-slider.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { EliminarComponent } from '../../popup/eliminar/eliminar.component';
import { EditarNoticiaComponent } from '../../popup/editar-noticia/editar-noticia.component';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-galeria-multi',
  templateUrl: './galeria-multi.component.html',
  styleUrls: ['./galeria-multi.component.css']
})
export class GaleriaMultiComponent implements OnInit {
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  $sub : Subscription = new Subscription()

  arrayVidImgGeneralS : imgVideoModel [] =  []
  arrPosicionGeneralS : Number [] = []
  arrayVidImgMexicaliS : imgVideoModel [] =  []
  arrPosicionMexicaliS : Number [] = []
  arrayVidImgCalafiaS : imgVideoModel [] =  []
  arrPosicionCalafiaS : Number [] = []
  arrayVidImgPalmiraS : imgVideoModel [] =  []
  arrPosicionPalmiraS : Number [] = []
  arrayVidImgHermosilloS : imgVideoModel [] =  []
  arrPosicionHermosilloS : Number [] = []
  arrayVidImgsanLuisS : imgVideoModel [] =  []
  arrPosicionsanLuisS : Number [] = []

  ////////
  arrayVidImgGeneralN : imgVideoModel [] =  []
  arrayVidImgMexicaliN : imgVideoModel [] =  []
  arrayVidImgCalafiaN : imgVideoModel [] =  []
  arrayVidImgPalmiraN : imgVideoModel [] =  []
  arrayVidImgHermosilloN : imgVideoModel [] =  []
  arrayVidImgsanLuisN : imgVideoModel [] =  []
  paramUrl : string = this.route.url.split("/")[2];
  api : string = environment.api


  cargando : boolean = false;
  cargando2 : boolean = false;

 constructor(
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private servicioMulti : SubirImgVideoService,
    private sanitizer : DomSanitizer,
    private dialog:NgDialogAnimationService,
    private DataService : DataNavbarService,
    public route : Router,
    )
    {
      this.mobileQuery = this.media.matchMedia('(max-width: 0px)');
      this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
      // tslint:disable-next-line: deprecation
      this.mobileQuery.addListener(this._mobileQueryListener);
    }

  ngOnInit(): void {
    this.cargando2 = false;
    this.$sub.add(this.servicioMulti.todoImgVideo("imgVideo",-1,1,0,-1).subscribe(async (resp : ResponseInterfaceTs)=>{
      if (resp.status.toString() === "200") {
        for await (const i of resp.container) {
          switch (Number(i.cveLocal)) {
            case 0:
              this.arrayVidImgGeneralS.push(i)
              this.arrPosicionGeneralS.push(i.posicion)
              break;
            case 1:
              this.arrayVidImgMexicaliS.push(i)
              this.arrPosicionMexicaliS.push(i.posicion)
              break;
            case 2:
              this.arrayVidImgCalafiaS.push(i)
              this.arrPosicionCalafiaS.push(i.posicion)
              break;
            case 3:
              this.arrayVidImgsanLuisS.push(i)
              this.arrPosicionsanLuisS.push(i.posicion)
              break;
            case 4:
              this.arrayVidImgPalmiraS.push(i)
              this.arrPosicionPalmiraS.push(i.posicion)
              break;
            case 5:
              this.arrayVidImgHermosilloS.push(i)
              this.arrPosicionHermosilloS.push(i.posicion)
              break;
          }
        }
      }
      this.cargando2 = true;
    }))

    this.cargando = false;
    this.$sub.add(this.servicioMulti.todoImgVideo("imgVideoNoticia",-1,1,0,-1).subscribe(async (resp:ResponseInterfaceTs) =>{
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

  eliminar(id :any, noticiaSlider : Boolean, model : imgVideoModel){
    if (noticiaSlider === true) {
      //abriendo noticia
      let dialogRef = this.dialog.open(EliminarComponent, {
        height: 'auto',
        width: 'auto',
        data:{id:Number(id), opc:noticiaSlider, seccion: "foto/imagen"}
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
        //OPCION 1 PARA ELIMINAR UN ELEMENTO (RECARGANDO LA TABLA, PERO YA TENIENDO PRECARGADO LOS DATOS, PARA CARGARLOS)
        /*
        //
        if(typeof resp !== 'boolean'){
          if(resp !== "" && resp !== undefined){
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
          }else{
            this.arrayVidImgGeneralN = []
            this.arrayVidImgMexicaliN = []
            this.arrayVidImgCalafiaN = []
            this.arrayVidImgPalmiraN = []
            this.arrayVidImgHermosilloN = []
            this.arrayVidImgsanLuisN = []
          }
        }
      })

    } else {
      //abriendo slider
      let dialogRef = this.dialog.open(EliminarComponent, {
        height: 'auto',
        width: 'auto',
        data:{id:Number(id), opc:noticiaSlider}
      });
      dialogRef.afterClosed().subscribe(async (resp:any)=>{
        if(typeof resp !== 'boolean'){
          if (resp !== "" && resp !== undefined) {
            this.arrayVidImgGeneralS = []
            this.arrayVidImgMexicaliS = []
            this.arrayVidImgCalafiaS = []
            this.arrayVidImgPalmiraS= []
            this.arrayVidImgHermosilloS = []
            this.arrayVidImgsanLuisS = []
                for await (const i of resp) {
                  switch (Number(i.cveLocal)) {
                    case 0:
                      this.arrayVidImgGeneralS.push(i)
                      break;
                    case 1:
                      this.arrayVidImgMexicaliS.push(i)
                      break;
                    case 2:
                      this.arrayVidImgCalafiaS.push(i)
                      break;
                    case 3:
                      this.arrayVidImgsanLuisS.push(i)
                      break;
                    case 4:
                      this.arrayVidImgPalmiraS.push(i)
                      break;
                    case 5:
                      this.arrayVidImgHermosilloS.push(i)
                      break;
                  }
              }
          }else{
            this.arrayVidImgGeneralS = []
            this.arrayVidImgMexicaliS = []
            this.arrayVidImgCalafiaS = []
            this.arrayVidImgPalmiraS= []
            this.arrayVidImgHermosilloS = []
            this.arrayVidImgsanLuisS = []
          }
        }*/
      })
    } else {
      //abriendo slider
      let dialogRef = this.dialog.open(EliminarComponent, {
        height: 'auto',
        width: '450px',
        data:{id:Number(id), opc:noticiaSlider, seccion: "foto/imagen"}
      });
      dialogRef.afterClosed().subscribe(async (resp:any)=>{
        if(typeof resp !== 'boolean' && resp !== undefined ){
          if(this.arrayVidImgGeneralS.indexOf(model) > -1) {
            this.arrayVidImgGeneralS.splice(this.arrayVidImgGeneralS.indexOf(model),1)
            this.arrPosicionGeneralS.splice(Number(model.posicion),1)
          }else if(this.arrayVidImgMexicaliS.indexOf(model) > -1) {
            this.arrayVidImgMexicaliS.splice(this.arrayVidImgMexicaliS.indexOf(model),1)
            this.arrPosicionMexicaliS.splice(this.arrPosicionMexicaliS.indexOf(Number(model.posicion)),1)
          }else if(this.arrayVidImgCalafiaS.indexOf(model) > -1) {
            this.arrayVidImgCalafiaS.splice(this.arrayVidImgCalafiaS.indexOf(model),1)
            this.arrPosicionCalafiaS.splice(this.arrPosicionCalafiaS.indexOf(Number(model.posicion)),1)
          }else  if(this.arrayVidImgPalmiraS.indexOf(model) > -1) {
            this.arrayVidImgPalmiraS.splice(this.arrayVidImgPalmiraS.indexOf(model),1)
            this.arrPosicionPalmiraS.splice(this.arrPosicionPalmiraS.indexOf(Number(model.posicion)),1)
          }else if(this.arrayVidImgHermosilloS.indexOf(model) > -1) {
            this.arrayVidImgHermosilloS.splice(this.arrayVidImgHermosilloS.indexOf(model),1)
            this.arrPosicionHermosilloS.splice(this.arrPosicionHermosilloS.indexOf(Number(model.posicion)),1)
          }else if(this.arrayVidImgsanLuisS.indexOf(model) > -1) {
            this.arrayVidImgsanLuisS.splice(this.arrayVidImgsanLuisS.indexOf(model),1)
            this.arrPosicionsanLuisS.splice(this.arrPosicionsanLuisS.indexOf(Number(model.posicion)),1)
          }
        }
      })
    }
  }

  modificar( obj : imgVideoModel, noticiaSlider : Boolean, arrNumPos? : Number []){
    if (noticiaSlider === true) {
      //abriendo noticia
     let dialogRef = this.dialog.open(EditarNoticiaComponent, {
        height: 'auto',
        width: '450px',
        data: obj
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

    } else {
      //abriendo slider
      let dialogRef = this.dialog.open(EditarSliderComponent, {
        height: 'auto',
        width: '450px',
        data: {obj,arrNumPos}
      });
      dialogRef.afterClosed().subscribe(async (resp:any)=>{
        if (resp !== "" && resp !== undefined) {
        this.cargando2 = false;
        this.arrayVidImgGeneralS = []
        this.arrayVidImgMexicaliS = []
        this.arrayVidImgCalafiaS = []
        this.arrayVidImgPalmiraS = []
        this.arrayVidImgHermosilloS = []
        this.arrayVidImgsanLuisS = []
        this.arrPosicionGeneralS = []
        this.arrPosicionMexicaliS = []
        this.arrPosicionCalafiaS = []
        this.arrPosicionPalmiraS = []
        this.arrPosicionHermosilloS =[]
        this.arrPosicionsanLuisS = []
        for await (const i of resp) {
          switch (Number(i.cveLocal)) {
            case 0:
              this.arrayVidImgGeneralS.push(i)
              this.arrPosicionGeneralS.push(i.posicion)
              break;
            case 1:
              this.arrayVidImgMexicaliS.push(i)
              this.arrPosicionMexicaliS.push(i.posicion)
              break;
            case 2:
              this.arrayVidImgCalafiaS.push(i)
              this.arrPosicionCalafiaS.push(i.posicion)
              break;
            case 3:
              this.arrayVidImgsanLuisS.push(i)
              this.arrPosicionsanLuisS.push(i.posicion)
              break;
            case 4:
              this.arrayVidImgPalmiraS.push(i)
              this.arrPosicionPalmiraS.push(i.posicion)
              break;
            case 5:
              this.arrayVidImgHermosilloS.push(i)
              this.arrPosicionHermosilloS.push(i.posicion)
              break;
          }
        }
        this.cargando2 = true;

      }
      })

    }


  }

  recursoUrl(src : string, categoria:boolean, tipo:boolean) : SafeResourceUrl {

    if(categoria === false){
      if (tipo === false) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+"imgVideo/galeria-noticia/fotos/"+src);
      } else {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+"imgVideo/galeria-noticia/videos/"+src);
      }
    }else{
      if (tipo === false) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+"imgVideo/galeria-slide/fotos/"+src);
      } else {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+"imgVideo/galeria-slide/videos/"+src);
      }
    }
  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
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

  hayElementos2() : boolean{
    if((this.arrayVidImgGeneralS.length != 0 ||
      this.arrayVidImgMexicaliS.length != 0 ||
      this.arrayVidImgCalafiaS.length != 0 ||
      this.arrayVidImgsanLuisS.length != 0 ||
      this.arrayVidImgPalmiraS.length != 0 ||
      this.arrayVidImgHermosilloS.length != 0) || this.cargando2 ===false){
      return true;
    }else{
      return false;
    }
  }
}
