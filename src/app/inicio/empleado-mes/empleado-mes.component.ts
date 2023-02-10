import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-empleado-mes',
  templateUrl: './empleado-mes.component.html',
  styleUrls: ['./empleado-mes.component.css']
})
export class EmpleadoMesComponent implements OnInit {

  link : string =  environment.production === true ? "": "../../../";
  date : Date  = new Date();
  mes : string = ""
  usuarios : any [] = []
  api : string = environment.api
  color_primary : string =  "#DC994D";
  color_secundary : string =  "#293641";
  private lua : number = this.localNumero(CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8))
  private luaStr : string = CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)
  cargando : boolean = false;

  constructor(private usServ : UsuarioService, private auth : AuthService,private DataService : DataNavbarService,private sanitizer : DomSanitizer) {

  }

  ngOnInit(): void {
    let opciones : any = { month: 'long', day: 'numeric', year: 'numeric' };
    this.mes = this.date.toLocaleDateString('es',opciones).split(" ")[2].toUpperCase();
    this.DataService.open.emit(this.luaStr);
    this.cargando = false;
    this.usServ.selectAllusersMesi(this.lua).subscribe(async (resp: ResponseInterfaceTs) =>{
      if (Number(resp.status) == 200) {
        this.usuarios = resp.container;
      }
       this.cargando = true;


    })
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


  dateNormal(date : Date){
    let opciones : any = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    let date2 : string []= new Date(date+"T00:00:00").toLocaleDateString('es',opciones).split(" ")
    return date2[0].charAt(0).toUpperCase() + date2[0].slice(1).split(",")[0]+" "+date2[1];
  }

  recursoUrl(src : string) : SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+'imgVideo/fotos/'+src);

  }

  hayElementos() : boolean{
    if(this.usuarios.length != 0 || this.cargando ===false){
      return true;
    }else{
      return false;
    }
  }
}
