import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { carrusel_mini } from 'src/app/inicio/araiza-diamante/araiza-diamante.component';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'any'
})
export class localService {
  local = environment.api

  constructor(private http : HttpClient) { }

  todoLocal(opc : number)  : Observable <ResponseInterfaceTs>{
      return this.http.get<ResponseInterfaceTs>(this.local+"local.php?opc="+opc);
  }

  getAlianzas(num:Number): Observable<ResponseInterfaceTs> {
    return this.http.get<ResponseInterfaceTs>(this.local+"alianzas.php?hotel="+num)
  }

}
