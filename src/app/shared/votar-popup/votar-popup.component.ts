import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { VotacionesService } from 'src/app/core/services/votaciones_service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';
import { AceptarPopupComponent } from '../aceptar-popup/aceptar-popup.component';

@Component({
  selector: 'app-votar-popup',
  templateUrl: './votar-popup.component.html',
  styleUrls: ['./votar-popup.component.css']
})
export class VotarPopupComponent {
  resp : any = [];
  api : string = environment.api
  activar : boolean = false;
  readonly dialog = inject(MatDialog);
  mensaje = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: number,
    private ccia : VotacionesService,
    private auth : AuthService,
    public dialogRef: MatDialogRef<VotarPopupComponent>,
    @Inject(DomSanitizer)private sanitizer : DomSanitizer
  ){
      this.ccia.imprimirUsuariosCompetenciaActivado(data).subscribe((resp:ResponseInterfaceTs) =>{
        this.resp = resp.container;
      })

      this.ccia.comprobarVotacion(data, this.auth.getId()).subscribe((resp: ResponseInterfaceTs) =>{
        if(Number(resp.container[0]["votar"]) == 0){
          this.activar = true;
        }else{
          this.mensaje = "Usted ya votó en esta competencia ✅. ¡Gracias por su participación!";
        }
      })
  }

  recursoUrl(src : string) : SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.api+'imgVideo/galeria-equipos/fotos/'+src);
  }

  async clickVotar(resp : any){

    let dialogRef = this.dialog.open(AceptarPopupComponent, {
      width: '400px',
      data: resp["nombre"]
    });

    dialogRef.afterClosed().subscribe(async (result :boolean)=> {
      if (result) {
        try {
          await lastValueFrom(this.ccia.insertarVotacion(Number(resp["cveCompentencia"]), this.auth.getId(), Number(resp["idEquipo"])))
          this.mensaje = "Usted ya votó en esta competencia ✅. ¡Gracias por su participación!";

        } catch (error) {
          this.mensaje = "Acabá de ocurrir un error ❌, por favor inténtelo más tarde.";
        }
        this.activar = false;
      }
    });
  }
}
