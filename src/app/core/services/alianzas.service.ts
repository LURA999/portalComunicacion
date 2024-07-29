import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { respTarjeta } from 'src/app/inicio/araiza-diamante/araiza-diamante.component';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'any'
})
export class alianzas {

  constructor(private http: HttpClient) { }
  api = environment.api;

  todoAlianza(num:Number): Observable<ResponseInterfaceTs> {
    return this.http.get<ResponseInterfaceTs>(this.api+"alianzas.php?hotel="+num)
  }
}
