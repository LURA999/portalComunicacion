import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogSesionAdminGuard implements CanActivate {

  constructor(private route : Router,private auth : AuthService, private cookie :CookieService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {      
    if(this.cookie.get('user') !== "" && this.auth.getCveRol() == 1){
      return true;
    }else{          
      if (this.cookie.get('user') !== "" && this.auth.getCveRol() > 1) {
        this.route.navigateByUrl('/general')
      } else {
        this.route.navigateByUrl('/login_admin')
      } 
      return false;
    }
  }
  
}
