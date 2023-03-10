import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, lastValueFrom } from 'rxjs';
import { EmpleadoMesService, fechaServ } from 'src/app/core/services/empleado-mes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { dosParamInt } from 'src/app/interfaces_modelos/dosParamInt.interface';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';
import { fechaCambio } from '../../opcion-config/empleado-mes-config/empleado-del-mes.component';
import { locales } from '../editar-slider/editar-slider.component';

@Component({
  selector: 'app-editar-mes-empleado',
  templateUrl: './editar-mes-empleado.component.html',
  styleUrls: ['./editar-mes-empleado.component.css']
})
export class EditarMesEmpleadoComponent implements OnInit {
  link : string =  environment.production === true ? "": "../../../";
  @ViewChild("picker2") abrirCalendario : any
  fechaMes : FormGroup = this.fb.group({
    fecha : ["", Validators.required ],
    posicion : ["", Validators.required ],
    fechaInicio : ["", Validators.required],
    fechaFinal : ["", Validators.required]
  })

  $sub : Subscription = new Subscription()
  localInterfaz :locales[] = []
  modalidad : boolean = false;
  cant : number = 0
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");

  constructor(
    private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:fechaCambio,
    public dialogRef: MatDialogRef<EditarMesEmpleadoComponent>,
    private mesService : EmpleadoMesService,
    private users : UsuarioService) {
      this.fechaMes = this.fb.group({
        fecha : [ '' , Validators.required],
        posicion : [ '' , Validators.required],
        fechaInicio : ["", Validators.required],
        fechaFinal : ["", Validators.required]
      })

  }

  ngOnInit(): void {
    console.log(this.data);

    if (this.data.fecha !== undefined) {
      this.fechaMes = this.fb.group({
        fecha : [Number(this.data.fecha), Validators.required],
        posicion : [this.data.posicion, Validators.required],
        fechaInicio : [new Date(this.data.fechaInicio+"T00:00:00"), Validators.required],
        fechaFinal : [new Date(this.data.fechaFinal+"T00:00:00"), Validators.required]
      })


      this.modalidad = false;
    }else{
      this.modalidad = true;
    }
  }


  async enviandoDatos(){
    if (this.fechaMes.valid == false) {
      alert("Por favor llene todos los campos");
    } else {
      this.contenedor_carga.style.display = "block";

      const posAnt = this.data.posicion;
      const cveLocal = this.data.cveLocal;
      const idUsuario = this.data.idUsuario;
      this.data = this.fechaMes.value;
      this.data["cveLocal"] = cveLocal;
      this.data.idUsuario = idUsuario;
      if (this.modalidad == true) {
        //insertando a un empleado con una posicion NUEVA
       await lastValueFrom(this.mesService.insertarFecha(this.data)).then(async (res:ResponseInterfaceTs) =>{
          // if (Number(res.container[0]["pos"]) == 1) {

          //   let dosParamInt : dosParamInt = {
          //     idP : Number(this.data.posicion),
          //     idS : 0,
          //     cveLocal : cveLocal
          //   }

          //   await lastValueFrom(this.mesService.actualizarTUFechaCambio(dosParamInt));
          //   dosParamInt = {
          //     idP : Number(this.data.idUsuario),
          //     idS : Number(this.data.posicion),
          //     cveLocal : cveLocal
          //   }
          //  await lastValueFrom(this.mesService.actualizarUFechaCambio(dosParamInt));
          // }
        });
      } else {
        console.log("paso aqui");

        /* let actPos : fechaServ = ({
          fecha : this.fechaMes.value["fecha"],
          idUsuario : this.data.idUsuario,
          posicion : this.fechaMes.value["posicion"],
          posicionAnt : posAnt,
          cveLocal : cveLocal,
          update:true
        })
        //actualizando un empleado con una posicion ya existe
        if(Number(posAnt) != this.data.posicion ){
          await lastValueFrom(this.mesService.actualizarFecha(actPos))
        }
        */
        let actUsuario : fechaServ = ({
          fecha : this.fechaMes.value["fecha"],
          fechaInicio : this.fechaMes.value["fechaInicio"],
          fechaFinal : this.fechaMes.value["fechaFinal"],
          posicion : this.fechaMes.value["posicion"],
          posicionAnt : posAnt,
          cveLocal : cveLocal,
          idUsuario :  this.data.idUsuario,
          update: false
        })
        await lastValueFrom(this.mesService.actualizarFecha(actUsuario));
      }

      this.$sub.add(this.users.selectAllusers(2).subscribe(async (resp:ResponseInterfaceTs)=>{
        if (resp.status.toString() === '200') {
          console.log(resp.container);

          this.dialogRef.close(await resp.container);
          this.contenedor_carga.style.display = "none";

        }
      }))
    }
  }
}
