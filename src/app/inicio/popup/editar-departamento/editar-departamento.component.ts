import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { departamento } from '../editar-usuario/usuario-form.component';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-editar-departamento',
  templateUrl: './editar-departamento.component.html',
  styleUrls: ['./editar-departamento.component.css']
})
export class EditarDepartamentoComponent {
  departamentos : departamento  [] = [];

  @ViewChild('cancelarBtn') cancelarBtn!: MatButton;
  @ViewChild('agregarBtn') agregarBtn!: MatButton;

  formRest : FormGroup = this.fb.group({
    departamento : ["", Validators.required],
    idDepartamento : ["", Validators.required]
  });

  constructor(private fb : FormBuilder,@Inject(MAT_DIALOG_DATA) public data : Number,
  private service : UsuarioService,
  public dialogRef: MatDialogRef<EditarDepartamentoComponent>){

  }

  ngOnInit(): void {
      this.service.buscarDepartamentos().subscribe((resp:ResponseInterfaceTs) =>{
        for (let i = 0; i < resp.container.length; i++) {
          this.departamentos.push(resp.container[i]);
        }
      })

  }

  async enviandoDatos(){

    if (this.formRest.valid) {
    this.cancelarBtn.disabled = true;
    this.agregarBtn.disabled = true;
      let res =Number((await lastValueFrom(this.service.actualizarDepartamento(this.formRest.value))).status)
      if(res == 200){
        this.cancelarBtn.disabled = true;
        this.agregarBtn.disabled = true;
        this.dialogRef.close();
      }else{
        this.cancelarBtn.disabled = false;
        this.agregarBtn.disabled = false;
      }
    }
  }
}
