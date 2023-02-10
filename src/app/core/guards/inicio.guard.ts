import { Injectable } from '@angular/core';

import { CanActivate, Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InicioGuard implements CanActivate {

  constructor(private cookie: CookieService, private route : Router,private auth : AuthService){}

  canActivate( ): boolean {

    if(this.cookie.get('user') == "" ){
      return true
    }else{
      if (this.auth.getCveRol() == 1) {
        this.route.navigateByUrl('/general/slider-config')
      }else{
        this.route.navigateByUrl('/general')
      }
      return false;
    }
  }

}
