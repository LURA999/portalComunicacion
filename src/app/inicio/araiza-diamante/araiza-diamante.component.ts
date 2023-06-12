import { Component, OnInit,ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { localService } from 'src/app/core/services/local.service';
import { catchError, lastValueFrom } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { araizaDiamante } from 'src/app/core/services/araizaDiamante.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { metodosRepetidos } from 'src/app/metodos-repetidos';

export interface respTarjeta {
  apellido_p : string;
  apellidom : string;
  nombre : string;
  puntos : number | string;
}

interface formData {
  search : string
}

export interface carrusel_mini {
  logo : string;
  nombre? : string;
  descuento? : string;
}


@Component({
  selector: 'app-araiza-diamante',
  templateUrl: './araiza-diamante.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated, // Valor predeterminado, asegura estilos encapsulados
  styleUrls: ['./araiza-diamante.component.css'],
})
export class AraizaDiamanteComponent implements OnInit {

  /**
   *  @link : variable que obtiene el link si el proyecto esta en produccion o no,
   *  pero este sirve para ubicar un archivo que se encuentra en el mismo proyecto.
   *  @luaStr : obtiene el nombre del lugar del hotel que inicio sesion.
   *  @_mobileQueryListener : metodo que ayuda a detectar responsives
   *  @metodos : objeto que ayuda no repetir metodos que anteriormente fueron usados
   *  @resp : se creo una variable para traer los puntos de araiza diamante
  */

   link : string =  environment.production === true ? "": "../../../";
   private luaStr : string = CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)
  _mobileQueryListener!: () => void;
  metodos = new metodosRepetidos();
  opciones = { useGrouping: true  };

  resp : respTarjeta =  {
    apellido_p :"",
    apellidom :"",
    nombre : "",
    puntos : ""
  }


  items: carrusel_mini [] = [ ];
  window: number = Number(window.innerWidth);

  carouselConfig = {
    slidesToShow: 4,
    arrows: true,
    centerMode: false,
    swipe: false,
    infinite: true,
    /* "interval": 3000,
    "loop": true,
    "showControls": true,
    "showIndicators": true,
    "autoplay": true,
    "autoplaySpeed": 2000,
    "itemWidth": "200px",
    "itemHeight": "150px",
    "itemsToShow": 3,
    "pauseOnHover": true,
    "enableSwipe": true,
    "swipeToSlide": true,
    "swipe": true,
    "enableKeyboard": true,
    "transitionDuration": 500,
    "transitionTimingFunction": "ease-in-out",
    "adaptiveHeight": false,
    "rtl": false
    "customStyle": {
    "item": {
      "display": "flex",
      "justify-content": "center"
    },

  "infinite": true,
  "centerMode": true,
  "centerPadding": "50px",
  "variableWidth": false
  }*/
  responsive: [
    {
      breakpoint: 620,
      settings: {
        slidesToShow: 3,
        swipeToSlide: true,
        swipe:true,
        arrows: false,
        centerMode: false,
        infinite:false
      }
    },
  ]
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private auth : AuthService,
    private local : localService,
    public route : Router,
    private DataService : DataNavbarService,
    private sanitizer : DomSanitizer,
    private dimService: araizaDiamante) {
    }

  ngOnInit(): void {
    this.cargandoAlianzas(this.metodos.localNumero(this.luaStr));
    this.DataService.open.emit(this.luaStr);
  }

  handleCarouselEvents(event:any) {
		console.log(event);
	}



  irLink(link: string){
    window.open(link, "_blank");
  }

  recursoUrl(src : string) : SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }


  async cargandoAlianzas(num:Number) {
    this.local.getAlianzas(num).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:ResponseInterfaceTs) =>{
      for await (const i of resp.container) {
        this.items.push(i);
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  async submitForm(value : number) {
    await lastValueFrom(this.dimService.araizaTarjeta(value.toString().padStart(10, '0')).pipe(
      catchError(_ =>{
        throw 'Error in source.'
     })
    )).then((resp: respTarjeta[])=>{
      if (resp != null) {
        if (resp.length == 1) {
          this.resp = resp[0]
        }
      }else{
        this.resp.puntos = 0;
      }
      this.changeDetectorRef.detectChanges();
    })
  }

}

