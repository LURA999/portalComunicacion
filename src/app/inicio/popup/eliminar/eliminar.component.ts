import { Component, Inject, OnInit,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { imgVideoModel } from 'src/app/interfaces_modelos/img-video.model';
import { concatMap, lastValueFrom, of, Subscription } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ComidaService } from 'src/app/core/services/comida.service';
import { AutocapacitacionService } from 'src/app/core/services/autocapacitacion.service';
import { EmpleadoMesService } from 'src/app/core/services/empleado-mes.service';
import { dosParamInt } from 'src/app/interfaces_modelos/dosParamInt.interface';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {
  $sub : Subscription = new Subscription()
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");


  constructor( public dialogRef: MatDialogRef<EliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private serviceImgVideo : SubirImgVideoService,
    private usService:UsuarioService, private servImgVideo : SubirImgVideoService,
    private comidaServ : ComidaService, private autocap : AutocapacitacionService,
    private mesService:EmpleadoMesService) { }

  ngOnInit(): void {

  }


  async delete(eliminar : boolean){
    if (eliminar === false) {
      this.dialogRef.close(eliminar);
    } else {
      this.contenedor_carga.style.display = "block";

      switch (this.data.seccion.toString()) {
        case "foto/imagen":

          /*if (this.data.opc === true) {
            await lastValueFrom(this.serviceImgVideo.eliminarImgVideo(Number(this.data.id),"imgVideoNoticia"))
            this.$sub.add(this.serviceImgVideo.todoImgVideo("imgVideoNoticia",-1,1,0,-1).subscribe(async (resp : ResponseInterfaceTs)=>{
              this.dialogRef.close(await resp.container===undefined?[]:resp.container);
            }))
          } else {

            await lastValueFrom(this.serviceImgVideo.eliminarImgVideo(Number(this.data.obj.idImgVideo),"imgVideo"))
            let deleteSlide : dosParamInt = {
              cveLocal: Number(this.data.obj.cveLocal),
              cveSeccion: Number(this.data.obj.cveSeccion),
              idP: Number(this.data.obj.posicion),
              idS:0
            }
            await lastValueFrom(this.servImgVideo.eliminarPosicionTDSlide(deleteSlide));


            this.$sub.add(this.serviceImgVideo.todoImgVideo("imgVideo",-1,1,0,-1).subscribe(async (resp : ResponseInterfaceTs)=>{
              this.dialogRef.close(await resp.container===undefined?[]:resp.container);
            }))
          }*/

          of('').pipe(
            concatMap(()=>{
              if (this.data.opc === true) {
              return this.serviceImgVideo.eliminarImgVideo(Number(this.data.id),"imgVideoNoticia").pipe(
                concatMap(() =>
                this.serviceImgVideo.todoImgVideo("imgVideoNoticia",-1,1,0,-1)
              ))
              }else{
                return this.serviceImgVideo.eliminarImgVideo(Number(this.data.obj.idImgVideo),"imgVideo").pipe(concatMap(()=>{
                let deleteSlide : dosParamInt = {
                  cveLocal: Number(this.data.obj.cveLocal),
                  cveSeccion: Number(this.data.obj.cveSeccion),
                  idP: Number(this.data.obj.posicion),
                  idS:0
                }
                return this.servImgVideo.eliminarPosicionTDSlide(deleteSlide).pipe(concatMap(()=>
                this.serviceImgVideo.todoImgVideo("imgVideo",-1,1,0,-1)
                ))
              }))
              }

            })).subscribe((resp : ResponseInterfaceTs)=>{
              this.dialogRef.close( resp.container===undefined?[]:resp.container)
              this.contenedor_carga.style.display = "none";

            })
            
            /*  await lastValueFrom(this.serviceImgVideo.eliminarImgVideo(Number(this.data.id),"imgVideoNoticia"))
              this.$sub.add(this.serviceImgVideo.todoImgVideo("imgVideoNoticia",-1,1,0,-1).subscribe(async (resp : ResponseInterfaceTs)=>{
                this.dialogRef.close(await resp.container===undefined?[]:resp.container);
              }))
            } else {
  
              await lastValueFrom(this.serviceImgVideo.eliminarImgVideo(Number(this.data.obj.idImgVideo),"imgVideo"))
              let deleteSlide : dosParamInt = {
                cveLocal: Number(this.data.obj.cveLocal),
                cveSeccion: Number(this.data.obj.cveSeccion),
                idP: Number(this.data.obj.posicion),
                idS:0
              }
              await lastValueFrom(this.servImgVideo.eliminarPosicionTDSlide(deleteSlide));
  
  
              this.$sub.add(this.serviceImgVideo.todoImgVideo("imgVideo",-1,1,0,-1).subscribe(async (resp : ResponseInterfaceTs)=>{
                this.dialogRef.close(await resp.container===undefined?[]:resp.container);
              }))
            }
          */

          break;
        case "usuario":
            this.servImgVideo.eliminarDirImgUsuario(this.data.id).pipe(
              concatMap(()=> this.usService.deleteUser(Number(this.data.id.split("_")[0])).pipe(
                concatMap(()=> this.usService.selectAllusers(1))
              ))
            ).subscribe(async (resp1:ResponseInterfaceTs) =>{
              this.dialogRef.close(await resp1.container);
              this.contenedor_carga.style.display = "none";

            })      
            
          break;
        case 'Comida':
          await lastValueFrom(this.comidaServ.eliminarComida(Number(this.data.id)))
          this.$sub.add(this.usService.selectAllusers(1).subscribe(async (resp1:ResponseInterfaceTs) =>{
            this.dialogRef.close(await resp1.container);
          }))
          break;
        case 'autocapacitacion':
            await lastValueFrom(this.autocap.eliminarAutocapacitacion(Number(this.data.id)))
            this.$sub.add(this.autocap.mostrarTodoAutocapacitacion(0).subscribe(async (resp1:ResponseInterfaceTs) =>{
              this.dialogRef.close(await resp1.container);
            }))
          break;
        case 'fecha':

          await lastValueFrom(this.mesService.eliminarFecha(Number(this.data.obj.idUsuario)))
          await lastValueFrom(this.mesService.actualizarDFechaCambio(this.data.obj))
          this.$sub.add(this.usService.selectAllusers(2).subscribe(async (resp1:ResponseInterfaceTs) =>{
            this.dialogRef.close(await resp1.container);
          }))
          break;
        }
      }
  }

  ngOnDestroy(): void {
   this.$sub.unsubscribe()
  }


}
