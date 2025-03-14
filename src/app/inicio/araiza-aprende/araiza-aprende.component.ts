import { Component } from '@angular/core';
import { AraizaAprendeService, videoAraizaAprende } from 'src/app/core/services/araiza_aprende.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { categoriaInterfaz, temaInterfaz } from '../opcion-config/araiza-aprende-config/araiza-aprende-config.component';
import { concatMap, of } from 'rxjs';

@Component({
  selector: 'app-araiza-aprende',
  templateUrl: './araiza-aprende.component.html',
  styleUrls: ['./araiza-aprende.component.css']
})
export class AraizaAprendeComponent {
  arrTemas : videoAraizaAprende [][]= [];
  categorias : categoriaInterfaz  [] = [];
  arrIndiceTema : Number [] = [];
  nomTemas : String [] = [];
  temas : temaInterfaz  [] = [];
  titulop2 : String = "Comunicación";
  selectedValue: String = "";

  carouselConfig = {
    slidesToShow: 3,
    arrows: true,
    swipe: true,
    infinite: true,
    variableWidth:true,
    /* "interval": 3000,
    "loop": true,
    "showControls": true,
    "showIndicators": true,
    "autoplay": true,
    "autoplaySpeed": 2000,
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
      breakpoint: 1043,
      settings:{
        slidesToShow: 2 ,
          arrows: true,
          infinite: true,
          variableWidth: false
      }
    },
    {
      breakpoint: 620,
      settings: {
        slidesToShow: 1 ,
        swipe:true,
        arrows: false,
        infinite:true
      }
    }
  ]
  };

  constructor(private serviceAraizaApr : AraizaAprendeService  ){

    this.serviceAraizaApr.todoCategorias().subscribe((resp:ResponseInterfaceTs) =>{
      for (let i = 0; i < resp.container.length; i++) {
        this.categorias.push(resp.container[i]);
      }
    })

    this.serviceAraizaApr.todoTemasCategoria(1).pipe(
      concatMap((resp: ResponseInterfaceTs) => {
        for (let i = 0; i < resp.container.length; i++) {
          this.arrTemas.push([]);
          this.arrIndiceTema.push(resp.container[i]['fk_idTema']);
          this.nomTemas.push(resp.container[i]['tema'])
        }
        // Devuelve el observable de la llamada a selectVideo
        return this.serviceAraizaApr.selectVideo(1).pipe(
          concatMap((resp: ResponseInterfaceTs) => {
            for (let z= 0; z < this.arrTemas.length; z++) {
              for (let i = 0; i < resp.container.length; i++) {
                if (this.arrIndiceTema[z] == resp.container[i]['fk_idTema']) {
                  this.arrTemas[z].push(resp.container[i])
                }
              }
            }
            return of('');
          })
        );
      })
    ).subscribe((resp: String) => { });



  }

  onSelected(event : any) {
    this.titulop2 = event.source.triggerValue; // Texto seleccionado

    this.arrTemas = [];
    this.arrIndiceTema = [];
    this.nomTemas = [];
    this.serviceAraizaApr.todoTemasCategoria(Number(event.value)).pipe(
      concatMap((resp: ResponseInterfaceTs) => {
        for (let i = 0; i < resp.container.length; i++) {
          this.arrTemas.push([]);
          this.arrIndiceTema.push(resp.container[i]['fk_idTema']);
          this.nomTemas.push(resp.container[i]['tema'])
        }
        // Devuelve el observable de la llamada a selectVideo
        return this.serviceAraizaApr.selectVideo(Number(event.value)).pipe(
          concatMap((resp: ResponseInterfaceTs) => {
            for (let z= 0; z < this.arrTemas.length; z++) {
              for (let i = 0; i < resp.container.length; i++) {
                if (this.arrIndiceTema[z] == resp.container[i]['fk_idTema']) {
                  this.arrTemas[z].push(resp.container[i])
                }
              }
            }
            return of(this.nomTemas);
          })
        );
      })
    ).subscribe((resp: any) => {

    });
  }

  irLink(link : String){
    window.open(link.toString(),"_blank")
  }

}
