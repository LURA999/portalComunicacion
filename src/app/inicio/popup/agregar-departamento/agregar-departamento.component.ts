import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { departamento } from '../editar-usuario/usuario-form.component';
@Component({
  selector: 'app-agregar-departamento',
  templateUrl: './agregar-departamento.component.html',
  styleUrls: ['./agregar-departamento.component.css']
})
export class AgregarDepartamentoComponent {
  formAdd : FormGroup = this.fb.group({
    departamento : ['', Validators.required],
  })

  @ViewChild('cancelarBtn') cancelarBtn!: MatButton;
  @ViewChild('agregarBtn') agregarBtn!: MatButton;

  constructor(private fb : FormBuilder,@Inject(MAT_DIALOG_DATA) public data : Number,
  private service : UsuarioService,
  public dialogRef: MatDialogRef<AgregarDepartamentoComponent>){

  }

  async enviandoDatos() {
    if (this.formAdd.valid) {
    this.cancelarBtn.disabled = true;
    this.agregarBtn.disabled = true;

    let res =Number((await lastValueFrom(this.service.insertarDepartamento(this.formAdd.value))).status)
    if(res == 200){
        this.cancelarBtn.disabled = true;
        this.agregarBtn.disabled = true;
        this.dialogRef.close();
      }else{
        this.cancelarBtn.disabled = false;
        this.agregarBtn.disabled = false;

      }
    }else{
      this.cancelarBtn.disabled = false;
      this.agregarBtn.disabled = false;
    }
  }

}
