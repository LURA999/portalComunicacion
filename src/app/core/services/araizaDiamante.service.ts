import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { respTarjeta } from 'src/app/inicio/araiza-diamante/araiza-diamante.component';
import { comida } from 'src/app/inicio/opcion-config/menu-config/menu-config.component';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class araizaDiamante {

  constructor(private http: HttpClient) { }
  api = environment.api;

  araizaTarjeta(num:string): Observable<respTarjeta[]>{
    return this.http.get<respTarjeta[]>("https://encuestas.araizahoteles.com/araizadiamante/araizadiamante.php?search="+num)
  }
}
