import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { autocapacitacionInt } from 'src/app/inicio/opcion-config/autocapac-config/autocapac-config.component';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutocapacitacionService {
  api : string = environment.api;
  constructor(private http: HttpClient) { }

  eliminarAutocapacitacion(id:number): Observable<ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.api+"autoCapac.php?idAutoCap="+id)
  }

  mostrarAutocapacitacion(palabra:string, hotel:number): Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"autoCapac.php?palabra="+palabra+"&hotel="+hotel)
  }

  mostrarTodoAutocapacitacion(opc:number): Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"autoCapac.php?hotel="+opc)
  }

  actualizarAutocapacitacion(data:autocapacitacionInt) : Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set("Content-type","Aplication/json")
    return this.http.patch<ResponseInterfaceTs>(this.api+"autoCapac.php",data, {headers})
  }

  insertarAutocapacitacion(data:autocapacitacionInt): Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set("Content-type","Aplication/json")
    return this.http.post<ResponseInterfaceTs>(this.api+"autoCapac.php",data, {headers})
  }


}
