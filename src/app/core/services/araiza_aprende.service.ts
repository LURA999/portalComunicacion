import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';

export interface videoAraizaAprende {
  idArApr? : number;
  idCategoria : number;
  fk_idCategoria? : number;
  idTema : number;
  nombre : String;
  img : String;
  link : String;
  formato: String;
  titulo : String;
  descripcion : String;
  linkVideo : String;
  linkForm : String;
  contrasena: String;
}

@Injectable({
  providedIn: 'any'
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

  selectVideoIds(idCategoria:string): Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"araizaAprende.php?cat="+idCategoria)
  }

  todoVideo(): Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"araizaAprende.php?todoVideo=true");
  }

  segundaPageArAp(id :string, cat : string): Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"araizaAprende.php?ArApr="+id+"&cat="+cat);
  }

  eliminarTema( idTema : number): Observable<ResponseInterfaceTs>{

    return this.http.delete<ResponseInterfaceTs>(this.api+"araizaAprende.php?idTema="+idTema)
  }
  eliminarVideo(idVideo : number): Observable<ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.api+"araizaAprende.php?idVideo="+idVideo);
  }

  eliminarDirImgVideo(id: number) : Observable <ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.api+"araizaAprende.php?delete2="+id);
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

  ///////////// CUESTIONARIOS /////////////

  /*********** GET */
  imprimirDatosPrincipalesForm(idForm : number) : Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+"araizaAprendeForm.php?idForm="+idForm+"&datos=true")
  }

  imprimirFormularios() : Observable<ResponseInterfaceTs>{ //en este imprime los formularios existentes que hay
    return this.http.get<ResponseInterfaceTs>(this.api+"araizaAprendeForm.php?titulos=true")
  }

  imprimirFormularioRespuestas(idUsuario : number, form : number, local : number) : Observable<ResponseInterfaceTs>{ // en este apartado, imprime las respuestas del usuario que inicio sesión
    console.log(this.api+"araizaAprendeForm.php?idUsuario="+idUsuario+"&form="+form+"&local="+local+"&respuestas=true");
    
    return this.http.get<ResponseInterfaceTs>(this.api+"araizaAprendeForm.php?idUsuario="+idUsuario+"&form="+form+"&local="+local+"&respuestas=true")
  }

  imprimirFormularioPreguntas(idForm : number) : Observable<ResponseInterfaceTs>{ //imprime las preguntas y respuestas pero sin responder
    return this.http.get<ResponseInterfaceTs>(this.api+"araizaAprendeForm.php?idForm="+idForm+"&preguntas=true")
  }


  /************ PATCH */

  // editarPreguntaTexto(res : String){
  //   let headers = new HttpHeaders()
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.patch<ResponseInterfaceTs>(this.api+"araizaAprendeForm.php?editarPreguntaTexto=true", res,{headers})
  // }

  // editarRespuestaTexto(res : String){
  //   let headers = new HttpHeaders()
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.patch<ResponseInterfaceTs>(this.api+"araizaAprendeForm.php?editarRespuestaTexto=true", res,{headers})
  // }

  editarRespuesta( res : String, idPregunta: Number, idUsuario : Number) : Observable<ResponseInterfaceTs> {
    let headers = new HttpHeaders()
    headers.append('Content-Type', 'application/json');
    return this.http.patch<ResponseInterfaceTs>(this.api+"araizaAprendeForm.php?editarRespuesta=true", [res, idPregunta, idUsuario],{headers})
  }

  // editarEncabezado( res : Array<String>) : Observable<ResponseInterfaceTs> {
  //   let headers = new HttpHeaders()
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.patch<ResponseInterfaceTs>(this.api+"araizaAprendeForm.php?editarEncabezado=true", res,{headers})
  // }

  // editarDescripcion( res : Array<String>) : Observable<ResponseInterfaceTs> {
  //   let headers = new HttpHeaders()
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.patch<ResponseInterfaceTs>(this.api+"araizaAprendeForm.php?editarDescripcion=true", res,{headers})
  // }


  insertarRespuesta(res : String, idPregunta: Number, idUsuario : Number){
    let headers = new HttpHeaders()
    headers.append('Content-Type', 'application/json');

    return this.http.post<ResponseInterfaceTs>(this.api+"araizaAprendeForm.php?insertarRespuesta=true", [res, idPregunta, idUsuario],{headers})
  }
}
