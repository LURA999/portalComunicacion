import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cuestionario } from 'src/app/inicio/araiza-aprende-formulario/araiza-aprende-formulario.component';
import { cuestionarioTitulos } from 'src/app/inicio/opcion-config/cuestionarios-modificar/cuestionarios-modificar.component';
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

  getCuestionarioTituloById(id: number): Observable<ResponseInterfaceTs> {
    let headers = new HttpHeaders().set('Content-type','Application/json');
    return this.http.get<ResponseInterfaceTs>(this.api+'cuestionarios.php?llave=2&id='+id, {headers})
  }

  getCuestionarioPreguntasById(id: number): Observable<ResponseInterfaceTs> {
    let headers = new HttpHeaders().set('Content-type','Application/json');
    return this.http.get<ResponseInterfaceTs>(this.api+'cuestionarios.php?llave=3&id='+id, {headers})
  }

  enviarCuestionario(cuestionario : cuestionario) : Observable<ResponseInterfaceTs>{
    return this.http.post<ResponseInterfaceTs>(this.api+'cuestionarios.php?llave=4', cuestionario)
  }

  actualizarModDesc( cuest : cuestionarioTitulos) : Observable<ResponseInterfaceTs>{
    console.log(this.api+'cuestionarios.php?llave=5');
    console.log(cuest);

    return this.http.post<ResponseInterfaceTs>(this.api+'cuestionarios.php?llave=5', cuest)
  }


  /**Net core */
  //Obteniendo titulos

  getTitulos() : Observable <ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json');
    return this.http.get<ResponseInterfaceTs>('http://lura.somee.com/api/Formularios/TituloLocal', {headers})
  }

}
