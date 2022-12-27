import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-araiza-diamante',
  templateUrl: './araiza-diamante.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./araiza-diamante.component.css'],
})
export class AraizaDiamanteComponent implements OnInit {
   link : string =  environment.production === true ? "": "../../../";

  _mobileQueryListener!: () => void;
  width : number =0

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
  constructor(private changeDetectorRef: ChangeDetectorRef,
    public route : Router) { }

  ngOnInit(): void {
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

}
