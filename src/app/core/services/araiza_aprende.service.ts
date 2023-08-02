import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';

export interface videoAraizaAprende {
  idArApr? : number;
  idCategoria : number;
  idTema : number;
  nombre : String;
  img : String;
  link : String;
  formato: String;
}

@Injectable({
  providedIn: 'root'
})
export class AraizaAprendeService {

  constructor(private http: HttpClient) { }
  api = environment.api;

  todoCategorias() : Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"araizaAprende.php?todoCategorias=true");
  }
  todoTemas(): Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"araizaAprende.php?todoTemas=true");
  }

  todoTemasCategoria(id:Number): Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"araizaAprende.php?todoTemasCategoria=true&idTodosTemasCategoria="+id);
  }
  selectVideo(idCategoria:number): Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"araizaAprende.php?idCategoria="+idCategoria)
  }
  todoVideo(): Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"araizaAprende.php?todoVideo=true");
  }
  eliminarTema( idTema : number): Observable<ResponseInterfaceTs>{
    console.log(this.api+"araizaAprende.php?idTema="+idTema);

    return this.http.delete<ResponseInterfaceTs>(this.api+"araizaAprende.php?idTema="+idTema)
  }
  eliminarVideo(idVideo : number): Observable<ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.api+"araizaAprende.php?idVideo="+idVideo);
  }

  subirImagen(obj : FormData): Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders()
      headers.append('Content-Type', 'application/json');
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    return this.http.post<ResponseInterfaceTs>(this.api+"araizaAprende.php",obj,{headers})
  }

  eliminarCategoria(idCate: number): Observable<ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.api+"araizaAprende.php?idCate="+idCate);
  }

  insertarCategoria(idCategoria : String): Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders()
    headers.append('Content-Type', 'application/json');

  return this.http.post<ResponseInterfaceTs>(this.api+"araizaAprende.php?insCateg=true",{"categoria":idCategoria},{headers})
  }

  insertarTema(idTema : String): Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders()
    headers.append('Content-Type', 'application/json');

    console.log(this.api+"araizaAprende.php?insCateg=true");
    console.log({'tema':idTema});
  return this.http.post<ResponseInterfaceTs>(this.api+"araizaAprende.php?insTema=true",{'tema':idTema},{headers})
  }

  insertarVideo(imgAraizaApr : videoAraizaAprende): Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders()
    headers.append('Content-Type', 'application/json');
    return this.http.post<ResponseInterfaceTs>(this.api+"araizaAprende.php?insVideo=true",imgAraizaApr,{headers})
  }

  editarVideo(imgAraizaApr : videoAraizaAprende): Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders()
    headers.append('Content-Type', 'application/json');
    return this.http.patch<ResponseInterfaceTs>(this.api+"araizaAprende.php",imgAraizaApr,{headers})
  }

}
