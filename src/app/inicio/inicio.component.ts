import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DataNavbarService } from '../core/services/data-navbar.service';
import { SubirImgVideoService } from '../core/services/img-video.service';
import { imgVideoModel } from '../interfaces_modelos/img-video.model';
import { ResponseInterfaceTs } from '../interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';
import { Observable, Subscription, catchError, from } from 'rxjs';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

export interface imageObject {
  id?: number,
  src: string,
  title?: string,
  subtitle?: string
  formato:string,
  link?:string
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class InicioComponent implements OnInit {
  api : string = environment.api
  desplazar : number = 0;
  gInterval : any
  gTimeOut : any
  posicionOrg : number =1;
  imageObject: imageObject []| undefined  = undefined;
  imageObjectRemplazo: imageObject[] = [];
  cortar : boolean [] = [false,false,false,false]
  $sub : Subscription = new Subscription()
  paramUrl : string = this.route.url.split("/")[2];

  cargar : boolean = false;
  noticias: imgVideoModel[] = [];
  texto : string = ""

  link : string =  environment.production === true ? "": "../../";

  constructor(private DataService : DataNavbarService,
    public route : Router,
    private serviceImgVideo : SubirImgVideoService,
    private sanitizer : DomSanitizer, config: NgbCarouselConfig, private auth : AuthService
    ) {
      config.interval = 9000;
      config.keyboard = true;
      config.pauseOnHover = true;


  }

  ngOnInit(): void {
    this.rellenarSlider("imgVideo",0)
    this.rellenarSlider("imgVideoNoticia",0)
    this.DataService.open.emit("general");

  }

  rellenarSlider(dir:string ,number : number){
    this.$sub.add(this.serviceImgVideo.todoImgVideo(dir,number,1,0,-1).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp : ResponseInterfaceTs)=>{
      if(resp.status.toString() === "200" ){
        if(dir === "imgVideo"){
          this.imageObject = []
          for await (const r of resp.container) {
            this.imageObject.push( {
              src: r.imgVideo,
              formato: r.formato,
              link:r.link
            })
          }
        }else{
          //En este se llenan las noticias que remplazaran a los de default
          for await (const r of resp.container) {
            this.noticias.push( {
              idNoticia:r.idNoticia,
              fechaInicial: r.fechaInicial,
              fechaFinal: r.fechaFinal,
              imgVideo:r.imgVideo,
              titulo: r.titulo,
              cveLocal:r.cveLocal,
              descripcion: r.descripcion,
              formato: r.formato,
              posicion: r.posicion,
              link: r.link
            })
          }
        }
      }
      if (dir === "imgVideo") {
        this.cargar = true
      }
    }))
  }


  recursoUrlStr(src : string, categ : number, n : number, sec :boolean) : Observable<string>{
    if (n > 0 ) {
      if (sec === false ) {
        if (categ == 1) {
          return from([this.api+'imgVideo/galeria-noticia/fotos/'+src]);
        } else {
          return from([this.api+'imgVideo/galeria-noticia/videos/'+src]);
        }
      } else {
        if (categ == 1) {
          return  from([this.api+'imgVideo/galeria-slide/fotos/'+src]);
        } else {
          return from([this.api+'imgVideo/galeria-slide/videos/'+src]);
        }
      }
    }
    return from([src]);

  }

  recursoUrl(src : string, categ : number, n : number, sec :boolean) : SafeResourceUrl {
    if (n > 0 ) {
      if (sec === false ) {
        if (categ == 1) {
          return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+'imgVideo/galeria-noticia/fotos/'+src);
        } else {
          return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+'imgVideo/galeria-noticia/videos/'+src);
        }
      } else {
        if (categ == 1) {
          return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+'imgVideo/galeria-slide/fotos/'+src);
        } else {
          return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+'imgVideo/galeria-slide/videos/'+src);
        }
      }
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);

  }

  cortarTexto(texto:string,cortar: boolean, i : number){
    if(cortar === false){
     if(texto.toString().length > 80){
       this.texto = texto.toString().substring(0,79)+"..."
     }else{
       this.texto = texto.toString()
     }
      this.cortar[i] = false
     }else{
       this.texto = texto
       this.cortar[i] = true
     }
     return this.texto
   }

   dateNormal(date : Date){
    let opciones : any = { month: 'short', day: 'numeric', year: 'numeric' };
    let date2 : string []= new Date(date+"T00:00:00").toLocaleDateString('es',opciones).split(" ")
    return date2[0]+" "+date2[1]+", "+date2[2];
  }

  enviarPagina(link : string){
    if (link !== null && link !== undefined && link !== '') {
      window.open(link, "_blank");
    }
  }

  routerLink(seccion : string){
    this.auth.crearElm(CryptoJS.AES.encrypt("general","Amxl@2019*-").toString(),"lua");
    this.route.navigate(["/general/"+seccion]);
  }

  irLink(link : string){
    window.open(link,"_blank")
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }
}
