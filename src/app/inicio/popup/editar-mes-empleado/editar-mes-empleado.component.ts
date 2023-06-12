import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, catchError, lastValueFrom } from 'rxjs';
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
  /**
   * @link : variable que obtiene el link si el proyecto esta en produccion o no,
   * @formFechaMes : en esta variable se asignan todas las variables que deben de existir en el formulario
   * @$sub : variable que almacena a todos los observables para despues liberarlos cuando se cierra este componente
   * @modalidad : con esta variable se puede identificar si estas actualizando o insertando
   * a un empleado, para convertirlo o no, al empleado del mes
   * @contenedor_carga : variable ayudante para activar el loading
   */
  link : string =  environment.production === true ? "": "../../../";
  formFechaMes : FormGroup = this.fb.group({
    fecha : ["", Validators.required ],
    posicion : ["", Validators.required ],
    fechaInicio : ["", Validators.required],
    fechaFinal : ["", Validators.required]
  })

  $sub : Subscription = new Subscription()
  modalidad : boolean = false;
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");

  constructor(
    private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:fechaCambio,
    public dialogRef: MatDialogRef<EditarMesEmpleadoComponent>,
    private mesService : EmpleadoMesService,
    private users : UsuarioService) {
      this.formFechaMes = this.fb.group({
        fecha : [ '' , Validators.required],
        posicion : [ '' , Validators.required],
        fechaInicio : ["", Validators.required],
        fechaFinal : ["", Validators.required]
      })

  }

  ngOnInit(): void {

    if (this.data.fecha !== undefined) {
      this.formFechaMes = this.fb.group({
        fecha : [Number(this.data.fecha), Validators.required],
        posicion : [Number(this.data.posicion), Validators.required],
        fechaInicio : [new Date(this.data.fechaInicio+"T00:00:00"), Validators.required],
        fechaFinal : [new Date(this.data.fechaFinal+"T00:00:00"), Validators.required]
      })


      this.modalidad = false;
    }else{
      this.modalidad = true;
    }
  }


  async enviandoDatos(){
    if (this.formFechaMes.valid == false) {
      alert("Por favor llene todos los campos");
    } else {
      this.contenedor_carga.style.display = "block";

      const posAnt = this.data.posicion;
      const cveLocal = this.data.cveLocal;
      const idUsuario = this.data.idUsuario;
      this.data = this.formFechaMes.value;
      this.data["cveLocal"] = cveLocal;
      this.data.idUsuario = idUsuario;
      if (this.modalidad == true) {
        //insertando a un empleado con una posicion NUEVA
       await lastValueFrom(this.mesService.insertarFecha(this.data).pipe(
        catchError(_ =>{
          throw 'Error in source.'
       })
       )).then(async (res:ResponseInterfaceTs) =>{

        });
      } else {

        let actUsuario : fechaServ = ({
          fecha : this.formFechaMes.value["fecha"],
          fechaInicio : this.formFechaMes.value["fechaInicio"],
          fechaFinal : this.formFechaMes.value["fechaFinal"],
          posicion : this.formFechaMes.value["posicion"],
          posicionAnt : posAnt,
          cveLocal : cveLocal,
          idUsuario :  this.data.idUsuario,
          update: false
        })
        await lastValueFrom(this.mesService.actualizarFecha(actUsuario).pipe(
          catchError(_ =>{
            throw 'Error in source.'
         })
        ));
      }

      this.$sub.add(this.users.selectAllusers(2).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:ResponseInterfaceTs)=>{
        if (resp.status.toString() === '200') {
          this.dialogRef.close(await resp.container);
          this.contenedor_carga.style.display = "none";

        }
      }))
    }
  }
}
