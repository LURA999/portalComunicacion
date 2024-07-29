import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { comida } from 'src/app/inicio/opcion-config/menu-config/menu-config.component';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'any'
})
export class ComidaService {

  constructor(private http: HttpClient) { }
  api = environment.api;

  eliminarComida(id:number) : Observable <ResponseInterfaceTs>{
   return this.http.delete<ResponseInterfaceTs>(this.api+'menu.php?idComida='+id);
  }

  insertarComida(input:comida) : Observable <ResponseInterfaceTs>{
  let headers = new HttpHeaders().set('Content-type','Application/json');
   return this.http.post<ResponseInterfaceTs>(this.api+'menu.php',input,{headers});
  }

  todoComida(id:number, opc : number) : Observable <ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+'menu.php?hotel='+id+'&opc='+opc);
  }

  actualizarComida(input:comida) : Observable <ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json');
    return this.http.patch<ResponseInterfaceTs>(this.api+'menu.php',input, {headers});
  }

  buscarComida(id:number,b:string) : Observable <ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json');
    return this.http.get<ResponseInterfaceTs>(this.api+'menu.php?hotel='+id+'&buscar='+b, {headers});
  }
}
