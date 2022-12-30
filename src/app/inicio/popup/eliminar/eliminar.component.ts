import { Component, Inject, OnInit,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { imgVideoModel } from 'src/app/interfaces/img-video.model';
import { lastValueFrom, Subscription } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import { UsuarioService } from 'src/app/core/services/usuario.service';

export interface eliminar {
  seccion: string,
  id: number,
  opc?: boolean
}

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {
  $sub : Subscription = new Subscription()


  constructor( public dialogRef: MatDialogRef<EliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: eliminar,private serviceImgVideo : SubirImgVideoService,
    private usService:UsuarioService, private servImgVideo : SubirImgVideoService) { }

  ngOnInit(): void {

  }


  async delete(eliminar : boolean){
    if (eliminar === false) {
      this.dialogRef.close(eliminar);
    } else {
      switch (this.data.seccion.toString()) {
        case "foto/imagen":
          if (this.data.opc === true) {
            await lastValueFrom(this.serviceImgVideo.eliminarImgVideo(Number(this.data.id),"imgVideoNoticia"))
            this.$sub.add(this.serviceImgVideo.todoImgVideo("imgVideoNoticia",-1,1).subscribe(async (resp : ResponseInterfaceTs)=>{
              this.dialogRef.close(await resp.container===undefined?[]:resp.container);
            }))
          } else {
            await lastValueFrom(this.serviceImgVideo.eliminarImgVideo(Number(this.data.id),"imgVideo"))
            this.$sub.add(this.serviceImgVideo.todoImgVideo("imgVideo",-1,1).subscribe(async (resp : ResponseInterfaceTs)=>{
              this.dialogRef.close(await resp.container===undefined?[]:resp.container);
            }))
          }
          break;
        case "usuario":
            await lastValueFrom(this.servImgVideo.eliminarDirImgUsuario(Number(this.data.id)));
            await lastValueFrom(this.usService.deleteUser(Number(this.data.id)))
            this.usService.selectAllusers().subscribe(async (resp1:ResponseInterfaceTs) =>{
              this.dialogRef.close(await resp1.container);
            })
          break;
        }
      }
  }

  ngOnDestroy(): void {
   this.$sub.unsubscribe()
  }


}
