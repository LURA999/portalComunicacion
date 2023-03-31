import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, Renderer2, Input, Output } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import {Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatDrawerMode } from '@angular/material/sidenav';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';


interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  link : string =  environment.production === true ? "": "../../../";


    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    showSpinner: boolean = false;
    userName: string = "";
    //tres variables jugando con los navbar
    isAdminPortal : boolean = true;
    isAdmin: boolean = false;
    mode: MatDrawerMode = 'over';
    linkSplit : boolean = false
    logo:any
    verNavbar :boolean = true
    paramUrl : string = this.route.url.split("/")[2];
    cambiarLogo : string = ""

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private auth : AuthService,
        private rend2 :Renderer2,
        public route : Router,
        private DataService : DataNavbarService,
        private render : Renderer2
      ) {

        this.mobileQuery = this.media.matchMedia('(max-width: 700px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.linkSplit = route.url.split("/").length >= 3

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    ngAfterViewInit(): void {
        if (Number(this.auth.getCveRol()) > 1) {
            let opcNav : HTMLCollectionOf<Element> = document.getElementsByClassName('opc')
            for (var i = 0; i < opcNav.length; i++) {
                this.rend2.setStyle(opcNav.item(i),"display","none")
            }
            //navbar horizontal
            this.rend2.setStyle(opcNav.item(7),"display","block")
            this.rend2.setStyle(opcNav.item(0),"display","block")
            this.rend2.setStyle(opcNav.item(this.auth.getCveLocal()),"display","block")
            //navbar vertical
            this.rend2.setStyle(opcNav.item(8 + Number(this.auth.getCveLocal())),"display","block")
            this.rend2.setStyle(opcNav.item(14),"display","block")
        }
    }


    salir(){
        this.auth.cerrarSesion(this.route.url);
    }

    portal(link : string){
        this.isAdmin = !this.isAdmin;
        if(this.isAdmin){
            this.mode = 'side'
        }else{
            this.mode = 'over'
        }

      this.activarSeccion(link,undefined);
      this.route.navigateByUrl(link)
    }

    navegarNavH(link : string, nombre? : string){

      this.activarSeccion(link,nombre);
        this.route.navigateByUrl(link)
        if (nombre !== undefined && this.auth.getCveRol() == 1) {
            this.auth.crearElm(CryptoJS.AES.encrypt(nombre,"Amxl@2019*-").toString(),"lua")
        }
    }

    activarSeccionBookings(paramUrl : string) : string{
      if (paramUrl === undefined) {
        return "general"
      }

      if (paramUrl === "bookings") {
        return CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)
      }else{
        return paramUrl
      }
    }

    activarSeccion(link? : string, nombre? :string){

      for (let i = 0; i < document.getElementsByClassName("opc").length; i++) {
        this.render.setStyle(document.getElementsByClassName("opc")[i],"color","#000000")
      }

      this.render.setStyle(document.getElementsByClassName("opc")[8],"color","#FFFFFF")
      this.render.setStyle(document.getElementsByClassName("opc")[16],"color","#FFFFFF")


      for (let i = 0; i < document.getElementsByClassName("opcM").length; i++) {
        this.render.setStyle(document.getElementsByClassName("opcM")[i],"background-image","url("+this.link+"assets/img/pruebas/vector2.png)")
      }

      for (let i = 0; i < document.getElementsByClassName("menu-opc").length; i++) {
        this.render.setStyle(document.getElementsByClassName("menu-opc")[i],"color","#000000")
      }

      for (let i = 0; i < document.getElementsByClassName("verticalN-opc").length; i++) {
        this.render.setStyle(document.getElementsByClassName("verticalN-opc")[i],"color","#FFFFFF")
      }

      if (nombre !==undefined ) {
        switch (nombre) {
          case "general":
            this.render.setStyle(document.getElementsByClassName("opc")[0],"color","#ffba60")
            this.render.setStyle(document.getElementsByClassName("menu-opc")[0],"color","#ffba60")
            break;
          case "calafia":
            this.render.setStyle(document.getElementsByClassName("opcM")[1],"background-image","url("+this.link+"assets/img/pruebas/vector.png)")
            this.render.setStyle(document.getElementsByClassName("opc")[2],"color","#ffba60")
            this.render.setStyle(document.getElementsByClassName("menu-opc")[3],"color","#ffba60")
            break;
         case "sanLuis":
            this.render.setStyle(document.getElementsByClassName("opcM")[2],"background-image","url("+this.link+"assets/img/pruebas/vector.png)")
            this.render.setStyle(document.getElementsByClassName("opc")[3],"color","#ffba60")
            this.render.setStyle(document.getElementsByClassName("menu-opc")[5],"color","#ffba60")
            break;
          case "mexicali":
            this.render.setStyle(document.getElementsByClassName("opcM")[0],"background-image","url("+this.link+"assets/img/pruebas/vector.png)")
            this.render.setStyle(document.getElementsByClassName("opc")[1],"color","#ffba60")
            this.render.setStyle(document.getElementsByClassName("menu-opc")[1],"color","#ffba60")
            break;
          case "hermosillo":
            this.render.setStyle(document.getElementsByClassName("opcM")[3],"background-image","url("+this.link+"assets/img/pruebas/vector.png)")
            this.render.setStyle(document.getElementsByClassName("opc")[4],"color","#ffba60")
            this.render.setStyle(document.getElementsByClassName("menu-opc")[7],"color","#ffba60")
            break;
          case "palmira":
            this.render.setStyle(document.getElementsByClassName("opcM")[4],"background-image","url("+this.link+"assets/img/pruebas/vector.png)")
            this.render.setStyle(document.getElementsByClassName("opc")[5],"color","#ffba60")
            this.render.setStyle(document.getElementsByClassName("menu-opc")[8],"color","#ffba60")
            break;
          case "slider-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[0],"color","#ffba60")
            break;
          case "noticias-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[1],"color","#ffba60")
            break;
          case "menu-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[2],"color","#ffba60")
            break;
          case "empleado-mes-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[3],"color","#ffba60")
            break;
          case "galeriaMulti-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[4],"color","#ffba60")
            break;
          case "usuarios-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[5],"color","#ffba60")
            break;
          case "autocapac-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[6],"color","#ffba60")
            break;
        }
      }else{
        switch (link) {
          case "/general":
            this.render.setStyle(document.getElementsByClassName("opc")[0],"color","#ffba60")
            this.render.setStyle(document.getElementsByClassName("menu-opc")[0],"color","#ffba60")
            break;
          case "/general/calafia":
            this.render.setStyle(document.getElementsByClassName("opcM")[1],"background-image","url("+this.link+"assets/img/pruebas/vector.png)")
            this.render.setStyle(document.getElementsByClassName("opc")[2],"color","#ffba60")
            this.render.setStyle(document.getElementsByClassName("menu-opc")[3],"color","#ffba60")
            break;
         case "/general/sanLuis":
            this.render.setStyle(document.getElementsByClassName("opcM")[2],"background-image","url("+this.link+"assets/img/pruebas/vector.png)")
            this.render.setStyle(document.getElementsByClassName("opc")[3],"color","#ffba60")
            this.render.setStyle(document.getElementsByClassName("menu-opc")[5],"color","#ffba60")
            break;
          case "/general/mexicali":
            this.render.setStyle(document.getElementsByClassName("opcM")[0],"background-image","url("+this.link+"assets/img/pruebas/vector.png)")
            this.render.setStyle(document.getElementsByClassName("opc")[1],"color","#ffba60")
            this.render.setStyle(document.getElementsByClassName("menu-opc")[1],"color","#ffba60")
            break;
          case "/general/hermosillo":
            this.render.setStyle(document.getElementsByClassName("opcM")[3],"background-image","url("+this.link+"assets/img/pruebas/vector.png)")
            this.render.setStyle(document.getElementsByClassName("opc")[4],"color","#ffba60")
            this.render.setStyle(document.getElementsByClassName("menu-opc")[7],"color","#ffba60")
            break;
          case "/general/palmira":
            this.render.setStyle(document.getElementsByClassName("opcM")[4],"background-image","url("+this.link+"assets/img/pruebas/vector.png)")
            this.render.setStyle(document.getElementsByClassName("opc")[5],"color","#ffba60")
            this.render.setStyle(document.getElementsByClassName("menu-opc")[9],"color","#ffba60")
            break;
          case "/general/slider-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[0],"color","#ffba60")
            break;
          case "/general/noticias-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[1],"color","#ffba60")
            break;
         case "/general/menu-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[2],"color","#ffba60")
            break;
          case "/general/empleado-mes-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[3],"color","#ffba60")
            break;
          case "/general/galeriaMulti-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[4],"color","#ffba60")
            break;
          case "/general/usuarios-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[5],"color","#ffba60")
            break;
          case "/general/autocapac-config":
            this.render.setStyle(document.getElementsByClassName("verticalN-opc")[6],"color","#ffba60")
            break;
        }
      }
    }

    ngAfterContentInit(): void {
      this.DataService.open.subscribe(res => {
        if (Number(this.auth.getCveRol()) == 1) {
          this.isAdminPortal = false;
          //en estas paginas el navabar  no aparecera del lado izquierdo desplazando estos componentes:
          if (res === undefined || res==="mexicali"
          || res==="calafia" || res==="sanLuis"
          || res==="palmira" || res==="hermosillo"
          || res==="araiza-diamante"
          || res==="bookings" || res==="general" || res==="imagen-compartida") {
             this.isAdmin = false
             this.mode = 'over'
          } else {
            //como eres admin si aparecera desplazando a los elementos
              this.isAdmin = true
              this.mode = 'side'
          }

        } else {
            this.isAdmin = false
            this.mode = 'over'
        }

        this.activarSeccion(this.paramUrl,res)
        this.changeDetectorRef.detectChanges();
      })

    }

    ocOpcionVerticalNav(num : number) : boolean{
      if (this.auth.getCveRol() > 1) {
        if(num == this.auth.getCveLocal()){
          return false;
        }else{
          return true;
        }
      }else{
        return false;
      }

    }

    logoActualizado() :string{

      if (this.route.url.split("/")[2] != "bookings" && this.route.url.split("/")[2] != "araiza-diamante") {
        switch (this.route.url.split("/")[2]) {
          case 'palmira':
            return this.link+'assets/img/logos/logopal_sinlet.svg';
          case 'calafia':
            return this.link+'assets/img/logos/logocal_sinlet.svg';
          default:
            return this.link+'assets/img/logos/logo.svg';
        }
      }else {
        switch (CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)) {
          case 'palmira':
            return this.link+'assets/img/logos/logopal_sinlet.svg';
          case 'calafia':
            return this.link+'assets/img/logos/logocal_sinlet.svg';
          default:
            return this.link+'assets/img/logos/logo.svg';
        }
      }


    }

    ngAfterViewChecked(): void {

    }
}
