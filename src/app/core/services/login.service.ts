import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseInterfaceTs } from '../../interfaces_modelos/response.interface';


export interface registrar {
  usuario:number;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router : Router) { }

  local = environment.api;

  login(usuario : string , contraseña : string) : Observable <ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.local+'Users/userLogin.php?usuario='+usuario+'&contrasena='+contraseña)
  }

  registrarLogin(resg : registrar){
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post<ResponseInterfaceTs>(this.local+'Users/userLogin.php?visita=true', {resg} ,{headers})
  }

}
