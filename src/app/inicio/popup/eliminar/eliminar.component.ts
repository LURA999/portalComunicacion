import { Component, Inject, OnInit,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { imgVideoModel } from 'src/app/interfaces/img-video.model';
import { lastValueFrom, Subscription } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';

export interface eliminar {
  id: number,
  opc: boolean
}

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {
  $sub : Subscription = new Subscription()


  constructor( public dialogRef: MatDialogRef<EliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data: eliminar,private serviceImgVideo : SubirImgVideoService) { }

  ngOnInit(): void {

  }


  async delete(eliminar : boolean){
    if (eliminar === false) {
      this.dialogRef.close(eliminar);
    } else {
      if (this.data.opc === true) {
        await lastValueFrom(this.serviceImgVideo.eliminarImgVideo(Number(this.data.id),"imgVideoNoticia"))
        this.$sub.add(this.serviceImgVideo.todoImgVideo("imgVideoNoticia",-1,1).subscribe(async (resp : ResponseInterfaceTs)=>{
          this.dialogRef.close(resp.container===undefined?[]:resp.container);
        }))
      } else {
        await lastValueFrom(this.serviceImgVideo.eliminarImgVideo(Number(this.data.id),"imgVideo"))
        this.$sub.add(this.serviceImgVideo.todoImgVideo("imgVideo",-1,1).subscribe(async (resp : ResponseInterfaceTs)=>{
          this.dialogRef.close(resp.container===undefined?[]:resp.container);
        }))
      }
    }

  }

  ngOnDestroy(): void {
   this.$sub.unsubscribe()
  }


}
