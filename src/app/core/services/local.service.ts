import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class localService {
  local = environment.api

  constructor(private http : HttpClient) { }

  todoLocal(opc : number)  : Observable <ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.local+"local.php?opc="+opc);
  }

}
