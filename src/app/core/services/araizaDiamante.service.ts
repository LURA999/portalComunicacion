import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { respTarjeta } from 'src/app/inicio/araiza-diamante/araiza-diamante.component';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'any'
})
export class araizaDiamante {

  constructor(private http: HttpClient) { }
  api = environment.api;

  araizaTarjeta(num:string): Observable<respTarjeta[]>{
    return this.http.get<respTarjeta[]>("https://encuestas.araizahoteles.com:11443/araizadiamante/araizadiamante.php?search="+num)
  }
}
