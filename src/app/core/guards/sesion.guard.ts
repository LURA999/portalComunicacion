import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'any'
})
export class SesionGuard  {
  constructor(private cookie: CookieService, private route : Router,private auth : AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) : boolean {
      if(this.cookie.get('user') !== "" ){
        return true;
      }else{
        this.route.navigateByUrl('/login')
        return false;
      }
  }

}
