import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { AraizaAprendeService } from 'src/app/core/services/araiza_aprende.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface videoEsAraizaAprende {
  titulo : String;
  descripcion : String;
  linkVideo : String;
  linkForm : String;
}

@Component({
  selector: 'app-araiza-aprende-click',
  templateUrl: './araiza-aprende-click.component.html',
  styleUrls: ['./araiza-aprende-click.component.css']
})
export class AraizaAprendeClickComponent {

  private ar_apr : string = CryptoJS.AES.decrypt(this.auth.getrElm("pag_ar")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)
  arrVideo : Observable<ResponseInterfaceTs>;

  constructor(
    private auth : AuthService,
    private sanitizer : DomSanitizer,
    private serviceAraizaApr : AraizaAprendeService,
  ){
    this.arrVideo = this.serviceAraizaApr.segundaPageArAp(this.ar_apr)
  }

  recursoUrl(src : string) : SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  goPageForm(){


  }

  }
