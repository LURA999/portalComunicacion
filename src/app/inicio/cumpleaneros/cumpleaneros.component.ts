import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { Subscription, catchError } from 'rxjs';


export interface usuario {
  usuario : string;
  departamento : string;
  cumpleaños : string;
}

@Component({
  selector: 'app-cumpleaneros',
  templateUrl: './cumpleaneros.component.html',
  styleUrls: ['./cumpleaneros.component.css']
})
export class CumpleanerosComponent implements OnInit {

  /**
   *  @link : variable que obtiene el link si el proyecto esta en produccion o no,
   *  pero este sirve para ubicar un archivo que se encuentra en el mismo proyecto.
   *  @date : variable que se utiliza para obtener el mes actual.
   *  @api : Variable que ayuda a obtener recursos que estan fuera del proyecto, local o no local
   *  @mes : variable que almacena el mes actual.
   *  @lua : obtiene el id del hotel del usuario que inicio sesion.
   *  @color_primary : se establece un color primario global para esta clase.
   *  @luaStr : obtiene el nombre del lugar del hotel que inicio sesion.
   *  @cargando : variable que ayuda a finalizar e iniciar un "loading".
   *  @$sub : variable que ayuda a guardar todos los observables.
  */

  link : string =  environment.production === true ? "": "../../../";
  date : Date  = new Date();
  mes : string = ""
  usuarios : any [] = []
  $sub : Subscription = new Subscription()
  api : string = environment.api
  color_primary : string =  "#DC994D";
  private lua : number = this.localNumero(CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8))
  private luaStr : string = CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)
  cargando : boolean = false;

  constructor(private usServ : UsuarioService, private auth : AuthService,private DataService : DataNavbarService) {

  }

  ngOnInit(): void {
    let opciones : any = { month: 'long', day: 'numeric', year: 'numeric' };
    this.mes = this.date.toLocaleDateString('es',opciones).split(" ")[2].toUpperCase();
    this.DataService.open.emit(this.luaStr);
    this.cargando = false;
    this.$sub.add(this.usServ.selectAllusersBirth(this.lua).pipe(
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
    let opciones : any = { month: 'short', day: 'numeric', year: 'numeric' };
    let date2 : string []= new Date(date+"T00:00:00").toLocaleDateString('es',opciones).split(" ")
    return date2[0]+" "+date2[1];
  }

  //controla el loading
  hayElementos() : boolean{
    if(this.usuarios.length != 0 || this.cargando ===false){
      return true;
    }else{
      return false;
    }
  }

}
