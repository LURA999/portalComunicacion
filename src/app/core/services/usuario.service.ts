import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http : HttpClient) { }
  api = environment.api;

  deleteUser(id:number):Observable<ResponseInterfaceTs>{
      return this.http.delete<ResponseInterfaceTs>(this.api+'Users/userLogin.php?id='+id);
  }

  selectUser(usuario:string, apellidoPat : string , apellidoMat : string, hotel:string):Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+'Users/userLogin.php?usuario='+usuario+'&apellidoPat='+apellidoPat+'&apellidoMat='+apellidoMat+'&hotel='+hotel);
  }

  selectAllusers():Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+'Users/userLogin.php');
  }


}
