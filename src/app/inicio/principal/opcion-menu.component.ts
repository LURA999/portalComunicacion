import { Component, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { imgVideoModel } from 'src/app/interfaces_modelos/img-video.model';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import * as CryptoJS from 'crypto-js';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { environment } from 'src/environments/environment';
import { Observable, Subscription, from } from 'rxjs';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { AutocapacitacionService } from 'src/app/core/services/autocapacitacion.service';


export interface imageObject {
  id?: number,
  src: string,
  title?: string,
  subtitle?: string,
  formato:string,
  link?:string
}


@Component({
  selector: 'app-menu-opcion',
  templateUrl: './opcion-menu.component.html',
  providers: [NgbCarouselConfig],
  styleUrls: ["./opcion-menu.component.css"]
})
export class OpcionMenuComponent implements OnInit {
  link : string =  environment.production === true ? "": "../../../";
  desplazar : number = 0;
  gInterval : any
  gInterval2 : any
  gTimeOut : any
  posicionOrg : number =1;
  opc : number = 0
  api : string = environment.api
  $sub : Subscription = new Subscription()
  linkFacebook : string = "";
  linkBasePlanta : string = "";
  linkNuevoIngreso : string = "";
  cargar : boolean = false;
  imageObject: imageObject[] | undefined = undefined;
  imageObjectRemplazo: imageObject[] = [];
  noticias: imgVideoModel[] = [];
  texto : string = ""
  paramUrl : string = this.route.url.split("/")[2];
  cortar : boolean [] = [false,false,false,false];

  $autoCapacObs: Observable<ResponseInterfaceTs> | undefined ;
  auxObsCveHotel! : number

  constructor(private DataService : DataNavbarService,
    public route : Router,
    private serviceImgVideo : SubirImgVideoService,
    private sanitizer : DomSanitizer,
    private auth : AuthService,
    private config: NgbCarouselConfig,
    private autoCapacService : AutocapacitacionService
    ) {
    this.imageObjectRemplazo.push( {
      src: this.link+'assets/img/pruebas/banner1.jpg',
      formato: "image"
    })
    this.imageObjectRemplazo.push( {
      src: this.link+'assets/img/pruebas/banner2.jpg',
      formato: "image"
    })
    this.imageObjectRemplazo.push( {
      src: this.link+'assets/img/pruebas/banner3.jpg',
      formato: "image"
    })
    this.imageObjectRemplazo.push( {
      src: this.link+'assets/img/pruebas/banner4.jpg',
      formato: "image"
    })
    this.config.interval = 9000;
    this.config.keyboard = true;
    this.config.pauseOnHover = true;
  }


  ngOnInit(): void {

    switch(Number(this.auth.getCveLocal())){
      case 1:
        if (this.paramUrl !== "mexicali") {
          this.route.navigateByUrl("/general/mexicali")
        }
        break;
      case 2:
        if (this.paramUrl !== "calafia") {
          this.route.navigateByUrl("/general/calafia")
        }
        break;
      case 3:
        if (this.paramUrl !== "sanLuis") {
          this.route.navigateByUrl("/general/sanLuis")
        }
        break;
      case 4:
        if (this.paramUrl !== "palmira") {
          this.route.navigateByUrl("/general/palmira")
        }
        break;
      case 5:
        if (this.paramUrl !== "hermosillo") {
          this.route.navigateByUrl("/general/hermosillo")
        }
        break;
    }
    this.DataService.open.emit(this.paramUrl);

    switch (this.paramUrl) {
      case 'mexicali':
        this.rellenarSlider("imgVideo",1);
        this.rellenarSlider("imgVideoNoticia",1);
        this.linkFacebook = "https://www.facebook.com/AraizaHotelReclutamiento";
        this.linkBasePlanta = "https://view.genial.ly/622f7d8050e05f0018d0eccc";
        this.linkNuevoIngreso = "https://view.genial.ly/639ca8e63aab6600195ecc29/presentation-mxl-curso-de-induccion";
        this.auxObsCveHotel = 1
        break;
      case 'calafia':
        this.rellenarSlider("imgVideo",2);
        this.rellenarSlider("imgVideoNoticia",2);
        this.linkFacebook = "https://www.facebook.com/profile.php?id=100063793260568";
        this.linkBasePlanta = "https://view.genial.ly/6296612bf9744a0018e318c5";
        this.linkNuevoIngreso = "https://view.genial.ly/63a3908d0e544d00181a1fd3/presentation-cal-curso-de-induccion";
        this.auxObsCveHotel = 2
        break;
      case 'sanLuis':
        this.rellenarSlider("imgVideo",3);
        this.rellenarSlider("imgVideoNoticia",3);
        this.linkFacebook = "https://www.facebook.com/RHSLRC";
        this.linkBasePlanta = "https://view.genial.ly/6296614ed1f8420018e921c7";
        this.linkNuevoIngreso = "https://view.genial.ly/63bc6bd5ad38b4001384f60f/presentation-slrc-curso-de-induccion";
        this.auxObsCveHotel = 3
      break;
      case 'palmira':
        this.rellenarSlider("imgVideo",4);
        this.rellenarSlider("imgVideoNoticia",4);
        this.linkFacebook = "https://www.facebook.com/profile.php?id=100087183365285";
        this.linkBasePlanta = "https://view.genial.ly/62f556d07e4cf70012f1cbf4";
        this.linkNuevoIngreso = "https://view.genial.ly/63bde62ec061d100196228a9";
        this.auxObsCveHotel = 4
        break;
        case 'hermosillo':
        this.rellenarSlider("imgVideo",5);
        this.rellenarSlider("imgVideoNoticia",5);
        this.linkFacebook = "https://www.facebook.com/profile.php?id=100086885388266";
        this.linkBasePlanta = "https://view.genial.ly/62966166f9744a0018e3195f";
        this.linkNuevoIngreso = "https://view.genial.ly/63bc987bc007900010b9f71b/presentation-hmo-curso-de-induccion";
        this.auxObsCveHotel = 5
      break;
    }

    this.$autoCapacObs = this.autoCapacService.mostrarTodoAutocapacitacion(this.auxObsCveHotel!);
  }

  rellenarSlider(dir : string, number : number){
    this.$sub.add(this.serviceImgVideo.todoImgVideo(dir,number,1,0,-1).subscribe(async (resp : ResponseInterfaceTs)=>{

      if(resp.status.toString() === "200" ){

        //se remplazan los por default por los que si existen en el banner
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

  dateNormal(date : Date){
    let opciones : any = { month: 'short', day: 'numeric', year: 'numeric' };
    let date2 : string []= new Date(date+"T00:00:00").toLocaleDateString('es',opciones).split(" ")
    return date2[0]+" "+date2[1]+", "+date2[2];
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

  enviarPagina(link : string){
    if (link !== null && link !== undefined && link !== '') {
      window.open(link, "_blank");
    }
  }

  routerLink(seccion : string){

    this.auth.crearElm(CryptoJS.AES.encrypt(this.paramUrl,"Amxl@2019*-").toString(),"lua");
    this.route.navigate(["/general/"+seccion]);
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

  irLink(link : string){
    window.open(link,"_blank")
  }
}
