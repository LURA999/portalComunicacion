import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/services/auth.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  /**
   * @src : ayduante para poder reubicar que bookings le pertenece a cada hotel
   * @local : este va de la mano con el local del mismo usuario
   */

  src : string = ""

  constructor(private auth : AuthService, private sanitizer : DomSanitizer) { }

  ngOnInit(): void {
    let local :number = this.auth.getCveLocal()
    switch (Number(local)) {
      case 1:
        this.src = 'https://outlook.office365.com/owa/calendar/ARAIZAMEXICALIRECURSOSHUMANOS@araizahoteles.com/bookings/' ;
        break;
      case 2:
        this.src = 'https://outlook.office365.com/owa/calendar/CALAFIARECURSOSHUMANOS@araizahoteles.com/bookings/';
        break;
      case 3:
        this.src = 'https://outlook.office365.com/owa/calendar/ARAIZAsanLuisRECURSOSHUMANOS@araizahoteles.com/bookings/';
        break;
      case 4:
        this.src = 'https://outlook.office365.com/owa/calendar/ARAIZAPALMIRARECURSOSHUMANOS@araizahoteles.com/bookings/';
        break;
      case 5:
        this.src = 'https://outlook.office365.com/owa/calendar/ARAIZAHERMOSILLORECURSOSHUMANOS@araizahoteles.com/bookings/';
        break;
      default:
        break;
    }
  }

  //lo convierte en una recurso seguro
  recursoUrl() : SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  ngAfterContentChecked(): void {
    if (Number(this.auth.getCveRol()) == 1) {
      switch (CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)) {
        case 'mexicali':
          this.src = 'https://outlook.office365.com/owa/calendar/ARAIZAMEXICALIRECURSOSHUMANOS@araizahoteles.com/bookings/' ;
          break;
        case 'calafia':
          this.src = 'https://outlook.office365.com/owa/calendar/CALAFIARECURSOSHUMANOS@araizahoteles.com/bookings/';
          break;
        case 'sanLuis':
          this.src = 'https://outlook.office365.com/owa/calendar/ARAIZAsanLuisRECURSOSHUMANOS@araizahoteles.com/bookings/';
          break;
        case 'palmira':
          this.src = 'https://outlook.office365.com/owa/calendar/ARAIZAPALMIRARECURSOSHUMANOS@araizahoteles.com/bookings/';
          break;
        case 'hermosillo':
          this.src = 'https://outlook.office365.com/owa/calendar/ARAIZAHERMOSILLORECURSOSHUMANOS@araizahoteles.com/bookings/';
          break;
        default:
          break;
      }
    }
  }

}
