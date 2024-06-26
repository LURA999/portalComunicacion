import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { autocapacitacionInt } from 'src/app/inicio/opcion-config/autocapac-config/autocapac-config.component';
import { capacitacion } from 'src/app/inicio/popup/crear-autocapac/crear-autocapac.component';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutocapacitacionService {
  api : string = environment.api;
  constructor(private http: HttpClient) { }

  //Elimina la autocapacitacion (sin la imagen)
 /**/ eliminarAutocapacitacion(id:number): Observable<ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.api+"autoCapac.php?eliminarCapacitacion="+id)
  }

  //Eliminamos la imagen de la autocapacitacion
  /**/eliminarAutocapacitacionImagen(id:number): Observable<ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.api+"autoCapac.php?eliminarImagen="+id)
  }

  //Elimina la autocapacitacion del hotel
  eliminarAutocapacitacionHotel(id:number): Observable<ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.api+"autoCapac.php?eliminarCapacitacionHotel="+id)
  }

  //Este llena la tabla, pero va mas de la mano con la tabla detalle de autocapacitaciones
  mostrarAutocapacitacionHotel(palabra:string, hotel:number): Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"autoCapac.php?palabra="+palabra+"&hotel="+hotel)
  }

  mostrarTodoAutocapacitacionHotel(opc:number): Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"autoCapac.php?hotel="+opc)
  }

  mostrarTodoAutocapacitacion(): Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"autoCapac.php?capacitacionesRegistradas=true")
  }

  //Este actualiza las autocapacitaciones del hotel (un registro al cual ya tiene una autocapacitacion)
  actualizarAutocapacitacionHotel(data:autocapacitacionInt) : Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set("Content-type","Aplication/json")
    return this.http.patch<ResponseInterfaceTs>(this.api+"autoCapac.php?hotel=true",data, {headers})
  }

  //Este actualiza el nombre o link de la autocapacitacion
  /**/actualizarAutocapacitacion(data:capacitacion) : Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set("Content-type","Aplication/json")
    return this.http.patch<ResponseInterfaceTs>(this.api+"autoCapac.php?todo=true",data, {headers})
  }

  //Este actualiza el nombre o link de la autocapacitacion
  actualizarAutocapacitacionImagen(obj : FormData) : Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set("Content-type","Aplication/json")
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append('Content-Type', 'application/x-mpegURL');
    return this.http.patch<ResponseInterfaceTs>(this.api+"autoCapac.php",obj, {headers})
  }

  //Creamos una autocapacitacion desde 0, agregando nombre, imagen y link.
   /**/insertarAutocapacitacion(data:capacitacion): Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set("Content-type","Aplication/json")
    return this.http.post<ResponseInterfaceTs>(this.api+"autoCapac.php",data, {headers})
  }

  //Enviamos la imagen de la autocapacitacion
  /**/insertarImagenAutocapacitacion(obj : FormData): Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders()
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append('Content-Type', 'application/x-mpegURL');
    return this.http.post<ResponseInterfaceTs>(this.api+"autoCapac.php", obj, {headers})
  }

  //Enviamos el cve del hotel y de la capacitacion, para enlazarlos entre ellos
  asignarAutocapacitacion(data:autocapacitacionInt): Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set("Content-type","Aplication/json")
    return this.http.post<ResponseInterfaceTs>(this.api+"autoCapac.php",data, {headers})
  }
}
