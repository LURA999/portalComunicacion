import { Component, OnInit,ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { localService } from 'src/app/core/services/local.service';
import { count, lastValueFrom, Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  carrusel_mini: Array<any> = [
    {
      path: this.link+'assets/img/celular-araiza.png'
    }, {
      path: this.link+'assets/img/celular-araiza.png'
    }, {
      path: this.link+'assets/img/aniversario.png'
    }, {
      path: this.link+'assets/img/aniversario.png'
    }, {
      path: this.link+'assets/img/pruebas/banner1.jpg'
    }, {
      path: this.link+'assets/img/pruebas/banner1.jpg'
    }
  ];

  window: number = Number(window.innerWidth);



  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private auth : AuthService,
    private local : localService,
    public route : Router,
    private DataService : DataNavbarService,
    private sanitizer : DomSanitizer) { }

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
    this.$data =  this.local.getAlianzas()
    
  }

  encodeURI(str : string){
    let re = / /gi;
    return str.replace(re, "%20");
  }

}

