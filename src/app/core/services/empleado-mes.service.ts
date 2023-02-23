import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { dosParamInt } from 'src/app/interfaces_modelos/dosParamInt.interface';



export interface fechaServ {
  idUsuario:number;
  fecha:Date;
  posicion:number;
  cveLocal : number;
  posicionAnt?:number;
  update?:boolean;
}


@Injectable({
  providedIn: 'root'
})
export class EmpleadoMesService {
  api : string = environment.api

  constructor(private http: HttpClient) { }

  eliminarFecha(id:number):Observable<ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.api+"empleadoMes.php?idUsuario="+id);
  }

  actualizarFecha(fechaCam: fechaServ){
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.api+"empleadoMes.php" ,fechaCam, {headers});
  }

  insertarFecha(fechaCam: fechaServ):Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json');
    return this.http.post<ResponseInterfaceTs>(this.api+"empleadoMes.php" ,fechaCam, {headers});
  }

  totalEmpleado(cveLocal : number):Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"empleadoMes.php?cveLocal="+cveLocal);

  }

  actualizarDFechaCambio(fechaCam:fechaServ):Observable<ResponseInterfaceTs> {
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.api+"empleadoMes.php?todosD=true",fechaCam, {headers});
  }

  actualizarTUFechaCambio(fechaCam:dosParamInt):Observable<ResponseInterfaceTs> {
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.api+"empleadoMes.php?todosTU=true",fechaCam, {headers});
  }

  actualizarUFechaCambio(fechaCam:dosParamInt):Observable<ResponseInterfaceTs> {
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.api+"empleadoMes.php?fechaCamU=true",fechaCam, {headers});
  }
}
