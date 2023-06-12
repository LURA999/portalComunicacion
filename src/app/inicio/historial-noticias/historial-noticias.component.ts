import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { imgVideoModel } from 'src/app/interfaces_modelos/img-video.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription, catchError, from } from 'rxjs';

@Component({
  selector: 'app-historial-noticias',
  templateUrl: './historial-noticias.component.html',
  styleUrls: ['./historial-noticias.component.css'],
})
export class HistorialNoticiasComponent implements OnInit {

  /**
   *  @link : variable que obtiene el link si el proyecto esta en produccion o no,
   *  pero este sirve para ubicar un archivo que se encuentra en el mismo proyecto.
   *  @api : Variable que ayuda a obtener recursos que estan fuera del proyecto, local o no local
   *  @mesForm : variable que almacena la informacion del input para el cambio de informacion en los filtros.
   *  @$sub : variable que ayuda a guardar todos los observables.
   *  @noticias : variable que almacena las noticas para mostrrlas en el php.
   *  @p2 :  variable que se ayuda para guardar el evento emitido en el pagination-template.
   *  @ant : variable que ayuda compaginar al historial de noticias para regresar a la anterior pagina.
   *  @sig : variable que ayuda compaginar al historial de noticias para regresar a la anterior siguiente.
   *  @pageChange : variable que se usa en el compaginator, para  los cambios de adelantar y atrasar.
   *  @pageBoundsCorrection : variable que se usa en el compaginator para emitir los eventos, para  los cambios de adelantar y atrasar.
  */

  // texto : string = ""
  // cortar : Array<boolean> = [];

  api : string = environment.api;
  noticias: imgVideoModel[] = [];
  link : string =  environment.production === true ? "": "../../../";
  p2 : number = 1;
  $sub : Subscription = new Subscription()
  ant : boolean = true;
  sig : boolean = true;
  mesForm : FormGroup = this.fb.group({
    mes: [""]
  });

  //@Input() id!: string;
  //@Input() maxSize!: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() pageBoundsCorrection: EventEmitter<number> = new EventEmitter();
  //@ViewChild('p') childPagination: any

  constructor(private snoticia : SubirImgVideoService,
    private DataService : DataNavbarService,
    private auth : AuthService,
    private sanitizer : DomSanitizer,
    public route : Router,
    private fb : FormBuilder,
    private imgService : SubirImgVideoService
    ) { }
  private lua : number = this.localNumero(CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8))
  private luaStr : string = CryptoJS.AES.decrypt(this.auth.getrElm("lua")!,"Amxl@2019*-").toString(CryptoJS.enc.Utf8)

  ngOnInit(): void {
    this.DataService.open.emit(this.luaStr);
    this.$sub.add(this.snoticia.todoImgVideo("imgVideoNoticia",this.lua,0,1,0).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe( async (resp:ResponseInterfaceTs) => {
      if (Number(resp.status) == 200) {
        for await (const c of resp.container) {
          this.noticias.push(c)
        }
        // this.cortar = new Array(this.noticias.length).fill(false);
      }
    }))
  }

  dateNormal(date : Date){
    let opciones : any = { month: 'short', day: 'numeric', year: 'numeric' };
    let date2 : string []= new Date(date+"T00:00:00").toLocaleDateString('es',opciones).split(" ")
    return date2[0]+" "+date2[1]+", "+date2[2];
  }


  private localNumero(lua : string) : number {
    switch (lua) {
      case "mexicali":
        return 1;
      case "calafia":
        return 2;
      case "sanLuis":
        return 3;
      case "palmira":
        return 4;
      case "hermosillo":
        return 5;
      case "general":
        return 0;
      default:
        return -1;
    }
  }

  /* cortarTexto(texto:string,cortar: boolean, i : number){
    if(cortar === false){
     if(texto.toString().length > 80){
       this.texto = texto.toString().substring(0,79)+"..."
     }else{
       this.texto = texto.toString()
     }
      this.cortar[i] = false
     }else{
       this.texto = texto
       this.cortar[i] = true
     }
     return this.texto
   } */


   recursoUrl(src : string, categ : number, n : number, sec :boolean) : SafeResourceUrl {
    if (n > 0 ) {
      if (categ == 1) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+'imgVideo/galeria-noticia/fotos/'+src);
      } else {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+'imgVideo/galeria-noticia/videos/'+src);
      }
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);

  }

  //vuelve seguro el link
  recursoUrlStr(src : string, categ : number, n : number, sec :boolean) : Observable<string> {
    if (n > 0 ) {
      if (categ == 1) {
        return from([this.api+'imgVideo/galeria-noticia/fotos/'+src]);
      } else {
        return from([this.api+'imgVideo/galeria-noticia/videos/'+src]);
      }
    }
    return from([src]);

  }


  routerLink(){
    this.route.navigate(["/general/"+this.luaStr]);
  }

  mesClick(){
    this.noticias = []
    this.$sub.add(this.imgService.todoImgVideo("imgVideoNoticia", this.lua ,0, 1, Number(this.mesForm.value["mes"])).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe( async (resp : ResponseInterfaceTs) => {
      if (Number(resp.status) == 200) {
        for await (const c of resp.container) {
          this.noticias.push(c)
        }
        // this.cortar = new Array(this.noticias.length).fill(false);
      }
    }))


  }

  anterior(p :any){
    this.ant = false;
    p.previous();
  }

  siguiente(p : any){
    this.sig = false;
    p.next();
  }

  paginaActual(p : any){

       //Esta parte es para paginas que estan cercas de la pagina actual
       /**Cando le picas a una flecha */
       if(this.sig == false || this.ant == false){
        if (this.sig == false) {

        } else {

        }
        this.ant = true;
        this.sig = true;
      }else{
        /**Cuando seleccionas sin flechas */

      }
  }

  vacio(){}

  ngAfterViewChecked(): void {
    /* try {
      if (this.childPagination.pages[1].label === "...") {
        this.childPagination.pages.shift()
        this.childPagination.pages.shift()
      } else if(this.childPagination.pages[this.childPagination.pages.length-2].label == "..."){
        this.childPagination.pages.pop()
        this.childPagination.pages.pop()
      }
      this.changeDetectorRef.detectChanges();

    } catch (error) {

    } */
  }

  irLink(link : string){
    window.open(link,"_blank")
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }
}
