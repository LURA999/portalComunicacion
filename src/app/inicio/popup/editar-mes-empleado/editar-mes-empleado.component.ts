import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, lastValueFrom } from 'rxjs';
import { EmpleadoMesService } from 'src/app/core/services/empleado-mes.service';
import { localService } from 'src/app/core/services/local.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import { fechaCambio } from '../../opcion-config/empleado-mes-config/empleado-del-mes.component';
import { locales } from '../editar-slider/editar-slider.component';

@Component({
  selector: 'app-editar-mes-empleado',
  templateUrl: './editar-mes-empleado.component.html',
  styleUrls: ['./editar-mes-empleado.component.css']
})
export class EditarMesEmpleadoComponent implements OnInit {
  @ViewChild("picker2") abrirCalendario : any
  fechaMes : FormGroup = this.fb.group({
    fecha : ["", Validators.required ],
  })
  $sub : Subscription = new Subscription()
  localInterfaz :locales[] = []
  modalidad : boolean = false;

  constructor(
    private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data:fechaCambio,
    public dialogRef: MatDialogRef<EditarMesEmpleadoComponent>,
    private mesService : EmpleadoMesService,
    private users : UsuarioService) {
      this.fechaMes = this.fb.group({
        fecha : [ '' , Validators.required],
      })
  }

  ngOnInit(): void {
    if (this.data.fecha !== undefined) {
      this.fechaMes = this.fb.group({
        fecha : [new Date(this.data.fecha+"T00:00:00"), Validators.required]
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
      console.log(this.data);

      let idUsuario = this.data.idUsuario;
        this.data = this.fechaMes.value;
        this.data.idUsuario = idUsuario;
      if (this.modalidad == true) {
        await lastValueFrom(this.mesService.insertarFecha(this.fechaMes.value));
      } else {
        await lastValueFrom(this.mesService.actualizarFecha(this.fechaMes.value));
      }
      this.users.selectAllusers(2).subscribe(async (resp:ResponseInterfaceTs)=>{
        if (resp.status.toString() === '200') {
          this.dialogRef.close(await resp.container);
        }
      })
    }
  }
}
