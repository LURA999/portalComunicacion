import { Component, Inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { AraizaAprendeService } from 'src/app/core/services/araiza_aprende.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { concatMap, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

export interface videoEsAraizaAprende {
  titulo : string;
  categoria:string;
  idArApr : number;
  fk_idCategoria : number;
  descripcion : string;
  linkVideo : string;
  linkForm : string;
  fk_formulario: number;
}

@Component({
  selector: 'app-araiza-aprende-click',
  templateUrl: './araiza-aprende-click.component.html',
  styleUrls: ['./araiza-aprende-click.component.css']
})
export class AraizaAprendeClickComponent {

  private ar_apr : string = CryptoJS.AES.decrypt(this.auth.getrElm("pag_ar")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)
  private ar_cat : string = CryptoJS.AES.decrypt(this.auth.getrElm("pag_cat")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)

  arrVideo : Array<videoEsAraizaAprende> = [];
  arrVideoAux! : videoEsAraizaAprende;
  enabledBtnIzq = false;
  enabledBtnDcho = false;
  link : string = environment.production === true ? "https://www.comunicadosaraiza.com/portalnuevo/#/": "http://localhost:4200/#/"

  constructor(
    private auth : AuthService,
    @Inject(DomSanitizer)private sanitizer : DomSanitizer,
    private serviceAraizaApr : AraizaAprendeService,
  ){
    this.serviceAraizaApr.selectVideoIds(this.ar_cat).pipe(
      concatMap((resp2: ResponseInterfaceTs) => {
        return this.serviceAraizaApr.segundaPageArAp(this.ar_apr,this.ar_cat).pipe(
          concatMap((resp: ResponseInterfaceTs) =>{
            this.arrVideo = resp.container;
            let cant : number = resp2.container.length;
            let pos : number = resp2.container.indexOf(this.ar_apr)

            if(this.arrVideo.length == 2){
              if (pos == cant - 1 ) {
                this.enabledBtnIzq = false;
                this.enabledBtnDcho = true;
                this.arrVideoAux = resp.container[1];
              }else if (pos == 0){
                this.enabledBtnIzq = true;
                this.enabledBtnDcho = false;
                this.arrVideoAux = resp.container[0];
              }

            }else{
              if (this.arrVideo.length == 1) {
                this.enabledBtnIzq = true;
                this.enabledBtnDcho = true;
                this.arrVideoAux = resp.container[1];
              } else {
                this.arrVideoAux = resp.container[1];
              }
            }
            return of('');
          })
        )
      })
    ).subscribe()
  }

    recursoUrl(src : string) : SafeResourceUrl {
      return this.sanitizer.bypassSecurityTrustResourceUrl(src);
    }


    abrirCuestionario(){
      window.open(this.link+'general/araiza-aprende/araiza-aprende-formulario/'+this.arrVideoAux.fk_formulario, "_blank");
    }

    siguiente(){
      if(this.arrVideo.length == 2){
        this.auth.crearElm(CryptoJS.AES.encrypt(this.arrVideo[1].idArApr!.toString(),"Amxl@2019*-").toString(),"pag_ar");
        this.auth.crearElm(CryptoJS.AES.encrypt(this.arrVideo[1].fk_idCategoria!.toString(),"Amxl@2019*-").toString(),"pag_cat");

        this.serviceAraizaApr.segundaPageArAp(this.arrVideo[1].idArApr!.toString(),this.arrVideo[1].fk_idCategoria!.toString()).subscribe((resp:ResponseInterfaceTs) =>{
          this.arrVideo = resp.container;
          console.log(this.arrVideo.length);

          if (this.arrVideo.length ==2) {
            this.enabledBtnIzq = false;
            this.enabledBtnDcho = true;
            this.arrVideoAux = resp.container[1];
          } else {
            this.enabledBtnIzq = false;
            this.enabledBtnDcho = false;
            this.arrVideoAux = resp.container[1];

          }
        })
      }else{
        this.auth.crearElm(CryptoJS.AES.encrypt(this.arrVideo[2].idArApr!.toString(),"Amxl@2019*-").toString(),"pag_ar");
        this.auth.crearElm(CryptoJS.AES.encrypt(this.arrVideo[2].fk_idCategoria!.toString(),"Amxl@2019*-").toString(),"pag_cat");
        this.serviceAraizaApr.segundaPageArAp(this.arrVideo[2].idArApr!.toString(),this.arrVideo[2].fk_idCategoria!.toString()).subscribe((resp:ResponseInterfaceTs) =>{
          this.arrVideo = resp.container;
          if (this.arrVideo.length ==2) {
            this.enabledBtnIzq = false;
            this.enabledBtnDcho = true;
            this.arrVideoAux = resp.container[1];
          } else {
            this.enabledBtnIzq = false;
            this.enabledBtnDcho = false;
            this.arrVideoAux = resp.container[1];

          }
        })
      }
    }

    anterior(){
      if(this.arrVideo.length == 2){
        this.auth.crearElm(CryptoJS.AES.encrypt(this.arrVideo[0].idArApr!.toString(),"Amxl@2019*-").toString(),"pag_ar");
        this.auth.crearElm(CryptoJS.AES.encrypt(this.arrVideo[0].fk_idCategoria!.toString(),"Amxl@2019*-").toString(),"pag_cat");
        this.serviceAraizaApr.segundaPageArAp(this.arrVideo[0].idArApr!.toString(),this.arrVideo[0].fk_idCategoria!.toString()).subscribe((resp:ResponseInterfaceTs) =>{
          this.arrVideo = resp.container;
          if(this.arrVideo.length == 2){
            this.enabledBtnIzq = true;
            this.enabledBtnDcho = false;
            this.arrVideoAux = resp.container[0];
          }else{
            this.enabledBtnIzq = false;
            this.enabledBtnDcho = false;
            this.arrVideoAux = resp.container[1];
          }
        })
      }else{
        this.auth.crearElm(CryptoJS.AES.encrypt(this.arrVideo[0].idArApr!.toString(),"Amxl@2019*-").toString(),"pag_ar");
        this.auth.crearElm(CryptoJS.AES.encrypt(this.arrVideo[0].fk_idCategoria!.toString(),"Amxl@2019*-").toString(),"pag_cat");
        this.serviceAraizaApr.segundaPageArAp(this.arrVideo[0].idArApr!.toString(),this.arrVideo[0].fk_idCategoria!.toString()).subscribe((resp:ResponseInterfaceTs) =>{
          this.arrVideo = resp.container;
          if(this.arrVideo.length == 2){
            this.enabledBtnIzq = true;
            this.enabledBtnDcho = false;
            this.arrVideoAux = resp.container[0];
          }else{
            this.enabledBtnIzq = false;
            this.enabledBtnDcho = false;
            this.arrVideoAux = resp.container[1];
          }
        })
      }
    }
  }
