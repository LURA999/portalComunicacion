import { HttpClient, HttpHeaders } from "@angular/common/http";

export class metodosRepetidos {

    constructor() {
    }

    httpHeaders() : HttpHeaders {
        return  this.httpHeaders().set('Content-type','Application/json')
    }

}