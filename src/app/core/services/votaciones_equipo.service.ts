import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';

export interface Equipo {
  idEquipo? : number;
  nombreEquipo : string;
  imgEquipo : string;
  formato:string;
}

@Injectable({
  providedIn: 'any'
})

export class votacionesEquipoService {
  api = environment.api;
  constructor(private http : HttpClient) { }

  crearEquipo(objeto : Equipo) : Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post<ResponseInterfaceTs>(this.api+"votacionesEquipo.php", objeto, {headers} );
  }

  actualizarEquipo(objeto : Equipo) : Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.api+"votacionesEquipo.php", objeto, {headers} );
  }

  mostrarEquipos() : Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"votacionesEquipo.php");
  }

  subirVidImagen(obj : FormData){
    let headers = new HttpHeaders()
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    return this.http.post<ResponseInterfaceTs>(this.api+"imgVideo/imgEquipoCompetencia.php",obj, {headers} );
  }

  eliminarEquipo(id : number){
    return this.http.delete<ResponseInterfaceTs>(this.api+'imgVideo/imgEquipoCompetencia.php?delete='+id)
  }

  eliminarImg(id : number){

    return this.http.delete<ResponseInterfaceTs>(this.api+'imgVideo/imgEquipoCompetencia.php?delete='+id)
  }


}
