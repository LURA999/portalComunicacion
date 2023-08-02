import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Observable, Subscription, catchError, from } from 'rxjs';
import { AraizaAprendeService, videoAraizaAprende } from 'src/app/core/services/araiza_aprende.service';
import { EditarVideoComponent } from 'src/app/inicio/popup/editar-video/editar-video.component';
import { EliminarComponent } from 'src/app/inicio/popup/eliminar/eliminar.component';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video-img-araiza-apr',
  templateUrl: './video-img-araiza-apr.component.html',
  styleUrls: ['./video-img-araiza-apr.component.css']
})
export class VideoImgAraizaAprComponent implements OnInit {

  videoAraiza : videoAraizaAprende [] = [];
  cargando : boolean = false;
  $sub : Subscription = new Subscription()
  api : string = environment.api
  @Input() tipoNoticias! : number;
  constructor(
    private service : AraizaAprendeService,
    private sanitizer : DomSanitizer,
    private dialog:NgDialogAnimationService,) { }


  ngOnInit(): void {
    this.cargando = false;
    this.$sub.add(this.service.todoVideo().pipe(
      catchError(_ =>{
        throw 'Error in source.'
     })
    ).subscribe(async (resp:ResponseInterfaceTs) =>{
      if (resp.status.toString() === "200") {
        for (let i =0; i<resp.container.length; i++) {
          this.videoAraiza.push({
            idCategoria: resp.container[i]['fk_idCategoria'],
            idArApr: resp.container[i]['idArApr'],
            link: resp.container[i]['link'],
            idTema: resp.container[i]['fk_idTema'],
            nombre: resp.container[i]['nombre'],
            img: resp.container[i]['img'],
            formato: resp.container[i]['formato']
          })
        }
      }
      this.cargando = true;
    }))
  }
  modificar( obj : videoAraizaAprende){
      //abriendo noticia
     let dialogRef = this.dialog.open(EditarVideoComponent, {
        height: 'auto',
        width: '450px',
        data: obj,
      });

      dialogRef.afterClosed().pipe(
        catchError(_ =>{
          throw 'Error in source.'
       })
      ).subscribe(async (resp:any)=>{
        if (resp !== "" && resp !== undefined) {
        this.cargando = false;
          for await (const i of resp) {

          }
          this.cargando = true;
        }
      })
    }


  recursoUrl(src : String) : SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+"imgVideo/galeria-video-araiza-aprende/fotos/"+src);
  }

  hayElementos() : boolean{
    if(this.videoAraiza.length != 0   || this.cargando ===false){
      return true;
    }else{
      return false;
    }
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

  eliminar(id :any){
      //abriendo noticia
      let dialogRef = this.dialog.open(EliminarComponent, {
        height: 'auto',
        width: 'auto',
        data:{id:Number(id), seccion: "Video"}
      });

      dialogRef.afterClosed().pipe(
        catchError(_ =>{
          throw 'Error in source.'
       })
      ).subscribe(async (resp:any)=>{
        //OPCION 2 PARA ELIMINAR UN ELEMENTO
        if(typeof resp !== 'boolean' && resp !== undefined ){
          this.videoAraiza = [];
          for (let i = 0; i < resp.length; i++) {
            this.videoAraiza.push(resp[i]);
          }
        }
      })

  }


  recursoUrlStr(src :String) : Observable<string> {
    return from([this.api+"imgVideo/galeria-video-araiza-aprende/fotos/"+src]);

  }

}
