import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { actNomImgVideo } from 'src/app/inicio/popup/editar-usuario/usuario-form.component';
import { dosParamInt } from 'src/app/interfaces_modelos/dosParamInt.interface';
import { imgVideoModel } from 'src/app/interfaces_modelos/img-video.model';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'any'
})
export class SubirImgVideoService {
  local = environment.api
  local2 = environment.api

  constructor(private http : HttpClient) { }

  // fotos/videos de sliders o noticias
  todoImgVideo(arch : string, cveLocal : number,cveSeccion : number,historial : number, filtroHistorial : number )  : Observable <ResponseInterfaceTs> {
    return this.http.get<ResponseInterfaceTs>(this.local+"imgVideo/"+arch+".php?cvLoc="+cveLocal+"&cvSec="+cveSeccion+"&historial="+historial+"&filtroHistorial="+filtroHistorial);
  }

  subirImgVideo(obj : imgVideoModel,arch : string, actualizar:boolean) : Observable <ResponseInterfaceTs> {
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post<ResponseInterfaceTs>(this.local+"imgVideo/"+arch+".php?act="+actualizar,obj, {headers} );
  }

  subirImgVideo2(obj : FormData, arch : string, x? : number) : Observable <ResponseInterfaceTs> {
      let headers = new HttpHeaders()
      headers.append('Content-Type', 'application/json');
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      headers.append('Content-Type', 'video/mp4');
      headers.append('Content-Type', 'video/avi');
      headers.append('Content-Type', 'video/x-ms-wmv');
      headers.append('Content-Type', 'video/x-msvideo');
      headers.append('Content-Type', 'video/quicktime');
      headers.append('Content-Type', 'video/3gpp');
      headers.append('Content-Type', 'video/MP2T');
      headers.append('Content-Type', 'application/x-mpegURL');
      headers.append('Content-Type', 'video/x-flv');
    return this.http.post<ResponseInterfaceTs>(this.local+"imgVideo/"+arch+".php?var="+x, obj, {headers})
  }

  actualizarImgVideo(obj : any,arch : string) : Observable <ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.local+"imgVideo/"+arch+".php",obj, {headers} );
  }

  eliminarImgVideo(id: number,arch : string) : Observable <ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.local+"imgVideo/"+arch+".php?delete="+id);
  }

  eliminarDirImgVideo(id: number,arch : string) : Observable <ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.local+"imgVideo/"+arch+".php?delete2="+id);
  }

  actualizarPosicionTUSlide(obj:dosParamInt){
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.local+"imgVideo/imgVideo.php?posTU=true",obj, {headers} );
  }

  actualizarPosicionTUVSlide(obj:any){
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.local+"imgVideo/imgVideo.php?postTUV=true",obj, {headers} );
  }

  eliminarPosicionTDSlide(obj:dosParamInt){
    return this.http.delete<ResponseInterfaceTs>(this.local+"imgVideo/imgVideo.php?posTD="+obj.idP+"&cveLocal="+obj.cveLocal+"&cveSeccion="+obj.cveSeccion);
  }

  actualizarPosicionUSlide(obj:dosParamInt){
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.local+"imgVideo/imgVideo.php?posU=true",obj, {headers} );
  }

  actualizarPosicionUCSlide(obj:dosParamInt){
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.local+"imgVideo/imgVideo.php?posUC=true",obj, {headers} );
  }

  //fotos de usuarios
  subirImgUsuario(obj : FormData) :Observable <ResponseInterfaceTs> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  return this.http.post<ResponseInterfaceTs>(this.local+"Users/img.php", obj, {headers})
  }

  eliminarDirImgUsuario(id: string) : Observable <ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.local+"Users/img.php?delete="+id);
  }

  actualizarImgUsuario(id: string) : Observable <ResponseInterfaceTs>{
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    return this.http.patch<ResponseInterfaceTs>(this.local+"Users/img.php?id="+id, {headers});
  }

  renombrarImgUsuario(obj :actNomImgVideo) : Observable <ResponseInterfaceTs>{
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.patch<ResponseInterfaceTs>(this.local+"Users/img.php?imgn=true",{obj},{headers});
  }
}
