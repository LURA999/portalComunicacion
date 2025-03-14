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
import { Observable, Subscription, catchError, from } from 'rxjs';


@Component({
  selector: 'app-galeria-multi',
  templateUrl: './galeria-multi.component.html',
  styleUrls: ['./galeria-multi.component.css']
})
export class GaleriaMultiComponent implements OnInit {

  /**
   *  @_mobileQueryListener : variable que ayuda con los responsives de la pagina
   *  @mobileQuery : variable ayudante del _mobileQueryListener
   *  @$sub : variable que almacena a todos los observables para despues liberarlos cuando se cierra este componente
   *
   *  //Variables para las sliders
   *  @arrayVidImgGeneralS : array que almacena el nombre del archivo (imagen o video) del general
   *  @arrPosicionGeneralS : array que almacena la posicion para imprimirlo en el banner (imagen o video) del general
   *  @arrayVidImgMexicaliS : array que almacena el nombre del archivo (imagen o video) del general
   *  @arrPosicionMexicaliS : array que almacena la posicion para imprimirlo en el banner (imagen o video) del mexicali
   *  @arrayVidImgCalafiaS : array que almacena el nombre del archivo (imagen o video) del general
   *  @arrPosicionCalafiaS : array que almacena la posicion para imprimirlo en el banner (imagen o video) de calafia
   *  @arrayVidImgPalmiraS : array que almacena el nombre del archivo (imagen o video) del general
   *  @arrPosicionPalmiraS : array que almacena la posicion para imprimirlo en el banner (imagen o video) de palmira
   *  @arrayVidImgHermosilloS : array que almacena el nombre del archivo (imagen o video) del general
   *  @arrPosicionHermosilloS : array que almacena la posicion para imprimirlo en el banner (imagen o video) de hermosillo
   *  @arrayVidImgsanLuisS : array que almacena el nombre del archivo (imagen o video) del general
   *  @arrPosicionsanLuisS : array que almacena la posicion para imprimirlo en el banner (imagen o video) de sanluis
   *
   * @paramUrl : obtiene el link de la pagina, o mas bien el segmento de la pagina actual
   *  @api : Variable que ayuda a obtener recursos que estan fuera del proyecto, local o no local
   *  @cargando : variable para saber si ya caragaron las noticias
   *  @cargando2 : variable para saber si ya caragaron los sliders
   */
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

  paramUrl : string = this.route.url.split("/")[2];
  api : string = environment.api


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
    this.$sub.add(this.servicioMulti.todoImgVideo("imgVideo",-1,1,0,-1).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp : ResponseInterfaceTs)=>{
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

  }

  eliminar(id :any, noticiaSlider : Boolean, model : imgVideoModel){
      //abriendo slider
      let dialogRef = this.dialog.open(EliminarComponent, {
        height: 'auto',
        width: '450px',
        data:{obj:model, opc:noticiaSlider, seccion: "foto/imagen"}
      });
      dialogRef.afterClosed().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:any)=>{
        if(typeof resp !== 'boolean' && resp !== undefined ){
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
    // }
  }

  modificar( obj : imgVideoModel, noticiaSlider : Boolean, arrNumPos? : Number []){
      //abriendo slider
      let dialogRef = this.dialog.open(EditarSliderComponent, {
        height: 'auto',
        width: '450px',
        data: {obj,arrNumPos}
      });
      dialogRef.afterClosed().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:any)=>{
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

    // }


  }

  recursoUrl(src : string, categoria:boolean, tipo:boolean) : SafeResourceUrl {

    if(categoria === false){
      /* if (tipo === false) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+"imgVideo/galeria-noticia/fotos/"+src);
      } else {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+"imgVideo/galeria-noticia/videos/"+src);
      } */
      return ''
    }else{
      if (tipo === false) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+"imgVideo/galeria-slide/fotos/"+src);
      } else {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+"imgVideo/galeria-slide/videos/"+src);
      }
    }
  }


  recursoUrlStr(src : string, categoria:boolean, tipo:boolean) : Observable<string> {


    if(categoria === false){
      return from([''])
    }else{

      if (tipo === false) {

        return from([this.api+"imgVideo/galeria-slide/fotos/"+src]);
      } else {

        return from([this.api+"imgVideo/galeria-slide/videos/"+src]);
      }
    }
  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
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
