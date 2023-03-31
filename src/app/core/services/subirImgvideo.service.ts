import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { imgVideoModel } from 'src/app/interfaces_modelos/img-video.model';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubirImgNoticiaService {
  local = environment.api

  constructor(private http : HttpClient) { }

  todoImgVideo(arch : string, cveLocal : number)  : Observable <ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.local+"imgVideo/"+arch+".php?cveLocal="+cveLocal);
  }

  subirImgVideo(obj : imgVideoModel,arch : string) : Observable <ResponseInterfaceTs> {
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post<ResponseInterfaceTs>(this.local+"imgVideo/"+arch+".php",obj, {headers} );
  }

  subirImgVideo2(obj : FormData) :Observable <ResponseInterfaceTs> {
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

  return this.http.post<ResponseInterfaceTs>(this.local+"imgVideo/imgVideoNoticia.php", obj, {headers})
  }

  actualizarImgVideo(obj : imgVideoModel,arch : string) : Observable <ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.local+"imgVideo/"+arch+".php",obj, {headers} );
  }

  eliminarImgVideo(id: number,arch : string) : Observable <ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.local+"imgVideo/"+arch+".php?delete="+id);
  }

  eliminarDirImgVideo(id: number,arch : string) : Observable <ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.local+"imgVideo/"+arch+".php?delete2="+id);
  }
}
