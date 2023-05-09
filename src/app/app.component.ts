import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { LoginService } from './core/services/login.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})

export class AppComponent {
  title = 'portal_comunicacion';

  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");

  constructor(private log : LoginService,private auth:AuthService){
    // this.contenedor_carga.style.display = "block";
    // this.contenedor_carga.style.display = "none";
    this.registrarVisita()
  }

  async registrarVisita(){
    if (this.auth.getrElm('user') != "" && this.auth.getrElm('user') !=undefined && this.auth.getrElm('user') !=null) {
      await lastValueFrom(this.log.registrarLogin(this.auth.getId()))
    }
  }

}


