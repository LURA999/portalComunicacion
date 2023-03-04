import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { usuarios } from 'src/app/inicio/opcion-config/usuarios-config/usuarios.component';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { usuarioModel } from 'src/app/interfaces_modelos/usuario.model';
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

  selectUser(palabra:string, hotel:number, op:number):Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+'Users/userLogin.php?palabra='+palabra+'&hotel='+hotel+'&op='+op);
  }

  selectAllusers(op : number):Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+'Users/userLogin.php?us_op='+op);
  }

/**Todos los empleados que cumplen años - 1 */
  selectAllusersBirth(birt : number):Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+'Users/userLogin.php?birt='+birt);
  }

  selectAllusersAniv(aniv : number):Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+'Users/userLogin.php?aniv='+aniv);
  }

  selectAllusersMesi(aniv : number):Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+'Users/userLogin.php?mesi='+aniv);
  }
  /**  1*/

  updateUser(us : usuarios, modalidad : boolean) : Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.api+'Users/userLogin.php?modalidad='+modalidad, us, {headers})
  }

  updatePass(us : usuarioModel) : Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.api+'Users/userLogin.php', us, {headers})
  }

  createuser(us : usuarios) : Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post<ResponseInterfaceTs>(this.api+'Users/userLogin.php', us, {headers})
  }



}
