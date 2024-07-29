import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { commentarInteface } from 'src/app/comentar-comida/comentar-comida.component';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'any'
})
export class FoodExtService {
  local = environment.api

  constructor(private http : HttpClient) { }

  postComment(cinput : commentarInteface)  : Observable <ResponseInterfaceTs>{
    let headers = new HttpHeaders().set('Content-type','Application/json');
    return this.http.post<ResponseInterfaceTs>("https://www.comunicadosaraiza.com/movil_scan_api/API/comment_food.php",cinput,{headers});
  }


}
