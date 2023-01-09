import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { imgVideoModel } from 'src/app/interfaces/img-video.model';
import { imageObject } from '../opcion-menu/opcion-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-noticias',
  templateUrl: './historial-noticias.component.html',
  styleUrls: ['./historial-noticias.component.css'],
})
export class HistorialNoticiasComponent implements OnInit {
  cortar : boolean [] = [false,false,false,false];
  texto : string = ""
  api : string = environment.api
  noticias: imgVideoModel[] = [];
  link : string =  environment.production === true ? "": "../../../";
  imageObject: imageObject[] = [];
  p: number = 1;

  constructor(private snoticia : SubirImgVideoService,private DataService : DataNavbarService,  private auth : AuthService,
    private sanitizer : DomSanitizer, public route : Router
    ) { }
  private lua : number = this.localNumero(CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8))
  private luaStr : string = CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)

  ngOnInit(): void {
    this.DataService.open.emit(this.luaStr);
    console.log(this.lua);

    this.snoticia.todoImgVideo("imgVideoNoticia",this.lua,0).subscribe((resp:ResponseInterfaceTs) => {
      console.log(resp.container);

    })
  }

  dateNormal(date : Date){
    let opciones : any = { month: 'short', day: 'numeric', year: 'numeric' };
    let date2 : string []= new Date(date+"T00:00:00").toLocaleDateString('es',opciones).split(" ")
    return date2[0]+" "+date2[1]+", "+date2[2];
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


   recursoUrl(src : string, categ : number, n : number, sec :boolean) : SafeResourceUrl {
    if (n > 0 ) {
      if (categ == 1) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+'imgVideo/galeria-noticia/fotos/'+src);
      } else {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+'imgVideo/galeria-noticia/videos/'+src);
      }
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);

  }

  routerLink(){
    this.route.navigate(["/general/"+this.luaStr]);
  }
}
