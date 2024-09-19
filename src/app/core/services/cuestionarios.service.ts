import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cuestionario } from 'src/app/inicio/araiza-aprende-formulario/araiza-aprende-formulario.component';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'any'
})
export class CuestionariosService {

  constructor(private http: HttpClient) { }
  api = environment.api;

  getCuestionarios() : Observable <ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json');
    return this.http.get<ResponseInterfaceTs>(this.api+'cuestionarios.php?llave=1', {headers})
  }

  getCuestionarioTituloById(id: number): Observable<any> {
    let headers = new HttpHeaders().set('Content-type','Application/json');
    return this.http.get<ResponseInterfaceTs>(this.api+'cuestionarios.php?llave=2&id='+id, {headers})
  }

  getCuestionarioPreguntasById(id: number): Observable<any> {
    let headers = new HttpHeaders().set('Content-type','Application/json');
    return this.http.get<ResponseInterfaceTs>(this.api+'cuestionarios.php?llave=3&id='+id, {headers})
  }

  enviarCuestionario(cuestionario : cuestionario) : Observable<ResponseInterfaceTs>{
    return this.http.post<ResponseInterfaceTs>(this.api+'cuestionarios.php?llave=4', cuestionario)
  }



}
