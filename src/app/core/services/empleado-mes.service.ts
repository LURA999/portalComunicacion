import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { fechaCambio } from 'src/app/inicio/opcion-config/empleado-mes-config/empleado-del-mes.component';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoMesService {
  api : string = environment.api

  constructor(private http: HttpClient) { }

  eliminarFecha(id:number):Observable<ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.api+"fechaCambio.php?idUsuario="+id);
  }

  actualizarFecha(fechaCam: fechaCambio){
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.api+"fechaCambio.php" ,fechaCam, {headers});
  }

  insertarFecha(fechaCam: fechaCambio){
    console.log('insertar');

    let headers = new HttpHeaders().set('Content-type','Application/json');
    return this.http.post<ResponseInterfaceTs>(this.api+"fechaCambio.php" ,fechaCam, {headers});
  }

}
