import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { votaciones } from 'src/app/inicio/opcion-config/votaciones-config/votaciones-config.component';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';

export interface competencia {
  nombre? : string;
  fechaInicial : string;
  fechaFinal : string;
  cveLocal : number;
}


@Injectable({
  providedIn: 'any'
})
export class VotacionesService {
  api = environment.api;
  constructor(private http : HttpClient) { }

  imprimirDatosCompetencia(local : Number, nombre : String){
    return this.http.get<ResponseInterfaceTs>(this.api+'votarCompetencia.php?local='+local+"&nombre="+nombre);
  }

  imprimirUsuariosCompetencia(dComp : number, local : number):Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+'votarCompetencia.php?dComp='+dComp+'&local='+local);
  }

  comprobarVotacion(local : number, user : number) : Observable<ResponseInterfaceTs> {
    console.log(this.api+'votarCompetencia.php?gvotar=true&local='+local+'&user='+user);

    return this.http.get<ResponseInterfaceTs>(this.api+'votarCompetencia.php?gvotar=true&local='+local+'&user='+user);
  }

  imprimirUsuariosCompetenciaActivado(local : number) : Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+'votarCompetencia.php?imprimirEvAct=true&local='+local);
  }

  imprimirDatosGeneralExcel(comp : number) : Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+'votarCompetencia.php?excel=true&icomp='+comp);
  }

  imprimirVotosExcel(comp : number) : Observable<ResponseInterfaceTs>{
    return this.http.get<ResponseInterfaceTs>(this.api+'votarCompetencia.php?votos=true&icomp='+comp);
  }

  actualizarActividad( l : number, c : number, a : number){
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.api+'votarCompetencia.php?activarActividad=true', [l,c, a], {headers})
  }

  insertarCompetencia( icomp : competencia):Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post<ResponseInterfaceTs>(this.api+'votarCompetencia.php?iComp=true', icomp, {headers})
  }

  insertarUsuariosCompetencia(iComp : number,iU : number):Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post<ResponseInterfaceTs>(this.api+'votarCompetencia.php?iUsuariosComp=true', [iComp, iU], {headers})
  }

  insertarVotacion(iComp : number, iU : number, cveUCompetidor : number){
    console.log( [iComp, iU, cveUCompetidor]);

    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post<ResponseInterfaceTs>(this.api+'votarCompetencia.php?ivotar=true', [iComp, iU, cveUCompetidor], {headers})
  }

  eliminarUsuariosCompetencia(idU : number, idC : number):Observable<ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.api+"votarCompetencia.php?idU="+idU+"&idC="+idC)
  }

  eliminarCompetencia(idC : number):Observable<ResponseInterfaceTs>{
    return this.http.delete<ResponseInterfaceTs>(this.api+"votarCompetencia.php?idC="+idC)
  }

  actualizarCompetencia(icomp : votaciones):Observable<ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<ResponseInterfaceTs>(this.api+'votarCompetencia.php?editarPreguntaTexto=true', icomp, {headers})
  }

}
