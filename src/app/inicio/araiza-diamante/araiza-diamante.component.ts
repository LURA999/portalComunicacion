import { Component, OnInit,ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { localService } from 'src/app/core/services/local.service';
import { Observable, lastValueFrom } from 'rxjs';
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
  nombre : string;
  descuento : string;
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
   alianzas : boolean = false;
   alianzasArray : any[] = [];
  _mobileQueryListener!: () => void;
  width : number =0
  $data: Observable<any> | undefined ;
  @ViewChild("inputTarj") form! :HTMLInputElement
   opciones = { useGrouping: true  };

  formData : formData= {
    search: ''
  };

  resp : respTarjeta =  {
    apellido_p :"",
    apellidom :"",
    nombre : "",
    puntos : ""
  }


  imgCollection: Array<any> = [
    {
      thumbImage: this.link+'assets/img/celular-araiza.png',
      title: 'Image title'
    }, {
      thumbImage: this.link+'assets/img/celular-araiza.png',
      title: 'Image title'
    }, {
      thumbImage: this.link+'assets/img/aniversario.png',
      title: 'Image title'
    }, {
      thumbImage: this.link+'assets/img/aniversario.png',
      title: 'Image title'
    }, {
      thumbImage: this.link+'assets/img/pruebas/banner1.jpg',
      title: 'Image title'
    }, {
      thumbImage: this.link+'assets/img/pruebas/banner1.jpg',
      title: 'Image title'
    }
  ];

  carrusel_mini: Array<carrusel_mini> = [ ];

  window: number = Number(window.innerWidth);



  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private auth : AuthService,
    private local : localService,
    public route : Router,
    private DataService : DataNavbarService,
    private sanitizer : DomSanitizer,
    private dimService: araizaDiamante) { }

  ngOnInit(): void {
    this.cargandoAlianzas()

    this.DataService.open.emit(this.luaStr);
    const prev = document.querySelector('.prev')
    const next = document.querySelector('.next')
    const slider = document.querySelector('.slider')



    prev!.addEventListener('click', () => {
        slider!.scrollLeft -= 300
    })

    next!.addEventListener('click', () => {
        slider!.scrollLeft += 300
    })
    this.resonsiveCarrusel()

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

  ngAfterViewChecked(): void {
  }

  async cargandoAlianzas() {
    this.local.getAlianzas().subscribe((resp:carrusel_mini[]) =>{
      this.carrusel_mini = resp;
      this.changeDetectorRef.detectChanges();
    })

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

