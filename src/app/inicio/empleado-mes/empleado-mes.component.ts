import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription, catchError } from 'rxjs';

@Component({
  selector: 'app-empleado-mes',
  templateUrl: './empleado-mes.component.html',
  styleUrls: ['./empleado-mes.component.css']
})
export class EmpleadoMesComponent implements OnInit {
/**
   *  @link : variable que obtiene el link si el proyecto esta en produccion o no,
   *  pero este sirve para ubicar un archivo que se encuentra en el mismo proyecto.
   *  @date : variable que se utiliza para obtener el mes actual.
   *  @api : Variable que ayuda a obtener recursos que estan fuera del proyecto, local o no local
   *  @mes : variable que almacena el mes actual.
   *  @lua : obtiene el id del hotel del usuario que inicio sesion.
   *  @color_primary : se establece un color primario global para esta clase.
   *  @color_secundary : se establece un color secundario global para esta clase.
   *  @luaStr : obtiene el nombre del lugar del hotel que inicio sesion.
   *  @cargando : variable que ayuda a finalizar e iniciar un "loading".
   *  @$sub : variable que ayuda a guardar todos los observables.
  */

  link : string =  environment.production === true ? "": "../../../";
  date : Date  = new Date();
  mes : string = ""
  usuarios : any [] = []
  api : string = environment.api
  $sub : Subscription = new Subscription()

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
    this.$sub.add(this.usServ.selectAllusersMesi(this.lua).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp: ResponseInterfaceTs) =>{
      if (Number(resp.status) == 200) {
        this.usuarios = resp.container;
      }
       this.cargando = true;

    }))
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

  //controla el loading
  hayElementos() : boolean{
    if(this.usuarios.length != 0 || this.cargando ===false){
      return true;
    }else{
      return false;
    }
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }
}
