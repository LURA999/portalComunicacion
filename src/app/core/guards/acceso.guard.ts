import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'any'
})
export class AccessGuard implements CanActivate {

  constructor(private cookie: CookieService, private route : Router,private auth : AuthService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const path = state.url.split('/').slice(0, 5).join('/');
    const pathLength = state.url.split("/")[5];

    if( (path === '/portal_api/API/imgVideo/fotos' ||
        path === '/portal_api/API/imgVideo/galeria-slide' ||
        path === '/portal_api/API/imgVideo/galeria-noticia') && pathLength !== undefined){


      return false;
    }
      return true;

  }

}
