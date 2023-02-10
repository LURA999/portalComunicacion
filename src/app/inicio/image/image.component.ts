import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import * as CryptoJS from 'crypto-js';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { Observable, Subscription } from 'rxjs';

export interface usuario {
  usuario : string;
  departamento : string;
  cumpleaños : string;
}

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  nombre! : string | undefined
  formato! : string | undefined
  link : string =  environment.production === true ? "": "../../../";

  api : string = environment.api
  $sub : Subscription = new Subscription()
  $userData: Observable<ResponseInterfaceTs> | undefined ;

  private sec : number = this.seccionNumero(CryptoJS.AES.decrypt(this.auth.getrElm("sec")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8))
  private lua : number = this.localNumero(CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8))
  private luaStr : string = CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)

  constructor(private imgService : SubirImgVideoService,private auth : AuthService,private sanitizer : DomSanitizer,
    private DataService : DataNavbarService) {

     }


  ngOnInit(): void {
    this.cargarRecurso()
    this.DataService.open.emit(this.luaStr);
  }

  swch(imgVideo : string | undefined){
    if (imgVideo === undefined) {
      return this.link+"assets/img/pruebas/default_image.png";
    } else {
      switch (Number(this.sec)) {
        case 2:
          return this.api+"imgVideo/menu/"+imgVideo
        case 3:
         return this.api+"imgVideo/cumpleanos/"+imgVideo
        case 4:
         return this.api+"imgVideo/aniversario/"+imgVideo
        case 5 :
          return  this.api+"imgVideo/empleado-mes/"+imgVideo
        default:
          return "No hay";
      }
    }
  }

  private seccionNumero(sec : string) : number{
    switch (sec) {
      case "aniversario":
          return 4;
      case "menu":
          return 2;
      case "cumpleaños":
          return 3;
      case "empleado-mes":
          return 5;
      default:
        return -1;
    }
  }

  private localNumero(lua : string) : number {
    switch (lua) {
      case "mexicali":
        return 1;
      case "calafia":
        return 2;
      case "sanLuis":
        return 3;
      case "palmira":
        return 4;
      case "hermosillo":
        return 5;
      default:
        return 0;
    }
  }

  recursoUrl(src : string) : SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()

  }

  cargarRecurso(){
    if (this.sec > 0) {
    this.$userData = this.imgService.todoImgVideo("imgVideo", this.lua , this.sec,0,-1)
    }
  }
}
