import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Subscription } from 'rxjs';
import { localService } from 'src/app/core/services/local.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import { local, usuarios } from '../../usuarios/usuarios.component';
import { EditarSliderComponent } from '../editar-slider/editar-slider.component';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})

export class UsuarioFormComponent implements OnInit {

  hide = true;
  $sub : Subscription = new Subscription()
  locales : local [] = []

  formUsuario : FormGroup = this.fb.group({
    usuario : ["", Validators.required ],
    apellidoPaterno : ["", Validators.required ],
    apellidoMaterno : ["", Validators.required ],
    correo : ["", Validators.required ],
    cveLocal : ["", Validators.required ],
    cveRol: [ "" , Validators.required ],
    nombres: [ "", Validators.required ],
    contrasena: [ '' ]
  })

  constructor(private fb : FormBuilder,@Inject(MAT_DIALOG_DATA) public data: usuarios | undefined,public dialogRef: MatDialogRef<EditarSliderComponent>,
  private loc : localService, private usService : UsuarioService
  ) {
    if (data !== undefined) {
      this.formUsuario = this.fb.group({
        usuario : [this.data!.usuario, Validators.required],
        apellidoPaterno : [this.data!.apellidoPaterno, Validators.required],
        apellidoMaterno : [this.data!.apellidoMaterno, Validators.required],
        correo : [this.data!.correo, Validators.required],
        cveLocal : [this.data!.cveLocal, Validators.required],
        cveRol: [ this.data!.cveRol , Validators.required],
        nombres: [ this.data!.nombres, Validators.required],
        contrasena: [ '' ]
      })
    }
   }

  ngOnInit(): void {
    this.$sub.add(this.loc.todoLocal(-1).subscribe( async (resp:ResponseInterfaceTs) =>{
      for await (const i of resp.container) {
        this.locales.push({idLocal:i.idLocal, local:i.nombre})
      }
    }))
  }

  async enviandoDatos(){
    if (this.data ===undefined) {
      this.data = this.formUsuario.value
      await lastValueFrom(this.usService.createuser(this.data!))
      this.usService.selectAllusers().subscribe(async (resp1:ResponseInterfaceTs) =>{
        this.dialogRef.close(await resp1.container);
      })
    } else {
      let id :number = this.data?.idUsuario;
      this.data = this.formUsuario.value
      this.data!.idUsuario = id
      await lastValueFrom(this.usService.updateUser(this.data!))
      this.usService.selectAllusers().subscribe(async (resp1:ResponseInterfaceTs) =>{
        this.dialogRef.close(await resp1.container);
      })
    }


  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

  seleccionandoHotel(){
    if (Number(this.formUsuario.value["cveLocal"]) == 0) {
      this.formUsuario.patchValue({
        cveRol: "1"
      })
    }else{
      this.formUsuario.patchValue({
        cveRol: "2"
      })
    }
  }

  seleccionandoRol(){
    if (Number(this.formUsuario.value["cveRol"]) == 1) {
      this.formUsuario.patchValue({
        cveLocal: "0"
      })
    }else{
      this.formUsuario.patchValue({
        cveLocal: "1"
      })
    }
  }
}
