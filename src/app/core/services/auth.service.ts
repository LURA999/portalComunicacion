import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router : Router , private sCookie : CookieService) { }


  getId(){
    let payload = this.sCookie.get('user')
    let info = this.parseJwt(payload!!)
    return info.id
  }

  getCveLocal(){
    let payload = this.sCookie.get('user')
    let info = this.parseJwt(payload!!)
    return info.cveLocal
  }

  getCveRol(){
    let payload = this.sCookie.get('user')
    let info = this.parseJwt(payload!!)
    return info.cveRol
  }

  getCveTipo(){
    let payload = this.sCookie.get('user')
    let info = this.parseJwt(payload!!)
    return info.cveTipo
  }

  crearElm(token: string,nombre : string){
    let payload = token
    this.sCookie.set(nombre,payload,undefined,"/")
    return true;
  }

  getrElm(nombre : string){
    let payload = this.sCookie.get(nombre)
    return payload
  }
  crearSesion(token: string){
    let payload = token
    this.sCookie.set('user',payload,undefined,"/")
    return true;
  }

  cerrarSesion(link : string){
    this.sCookie.deleteAll("/")
    location.reload()
  }

  parseJwt(token:string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

}
