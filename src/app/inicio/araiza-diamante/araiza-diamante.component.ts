import { Component, OnInit,ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { localService } from 'src/app/core/services/local.service';
import { catchError, lastValueFrom } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { araizaDiamante } from 'src/app/core/services/araizaDiamante.service';

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
  styleUrls: ['./araiza-diamante.component.css'],
})
export class AraizaDiamanteComponent implements OnInit {
   link : string =  environment.production === true ? "": "../../../";
   private luaStr : string = CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)
   alianzasArray : any[] = [];
  _mobileQueryListener!: () => void;
  width : number =0
  @ViewChild("inputTarj") form! :HTMLInputElement
   opciones = { useGrouping: true  };
   c : number = 0;
   carrusel_mini : Array<string> = []
  formData : formData= {
    search: ''
  };

  resp : respTarjeta =  {
    apellido_p :"",
    apellidom :"",
    nombre : "",
    puntos : ""
  }


  items: carrusel_mini [] = [ ];
  // items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  // carrusel_mini: Array<carrusel_mini> = [ ];

  window: number = Number(window.innerWidth);

  carouselConfig = {
    slidesToShow: 3,
    slidesToScroll: 2,
    prevArrow: '<button type="button" class="slick-prev">Previous</button>',
    nextArrow: '<button type="button" class="slick-next">Next</button>',
    arrows: true,
    dots: false,
    infinite: true,
    centerMode:true,
    lazyLoad: 'ondemand',
    lazyLoadBuffer: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
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
      console.log(this.carouselConfig);

    }

  ngOnInit(): void {
    this.cargandoAlianzas();
    this.DataService.open.emit(this.luaStr);
  }

  handleCarouselEvents(event:any) {
		console.log(event);
	}

  cambiarSlider(event:any){
   this. c = event.nextSlide;
  }

  next() {
   /*  if(this.c < this.items.length-2){
      this.c +=2;
    } */
    this.c +=2;
    return this.c;
  }

  prev() {
    /* if(this.c >=2){
      this.c -=2;
    } */
    if(this.c == 0){
      this.c = this.items.length-1;
    }

    this.c -=2;
    return this.c;
  }

  resonsiveCarrusel(){
    if ( Number(window.innerWidth) >=1200 ) {
      this.width = 4
    } else  if ( Number(window.innerWidth) >=900  &&  Number(window.innerWidth) <1200 ){
      this.width = 3
    } else  if ( Number(window.innerWidth) >=700  &&  Number(window.innerWidth) <900 ){
      this.width = 2
    }else{
      this.width = 1
    }
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
  }

  irLink(link: string){
    window.open(link, "_blank");
  }

  recursoUrl(src : string) : SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }


  async cargandoAlianzas() {
    this.local.getAlianzas().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:carrusel_mini[]) =>{
      for await (const i of resp) {
        this.items.push(i);
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  async submitForm(value : number) {
    await lastValueFrom(this.dimService.araizaTarjeta(value.toString().padStart(10, '0'))).then((resp: respTarjeta[])=>{
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

