import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { correoSugerencia } from 'src/app/shared/buzon-sugerencia/buzon-sugerencia.component';
import { correoAyuda } from 'src/app/shared/linea-de-ayuda/linea-de-ayuda.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuzonSugerenciaService {
  api : string = environment.api;
  constructor(private http: HttpClient) { }

  enviarSugerencia(correo:correoSugerencia): Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set("Content-type","Aplication/json")

    return this.http.post<ResponseInterfaceTs>(this.api+"correoLineaApoyo.php",correo,{headers})
  }

  enviarAyuda(correo:correoAyuda): Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set("Content-type","Aplication/json")
    return this.http.post<ResponseInterfaceTs>(this.api+"correoLineaAyuda.php",correo,{headers})
  }

}
