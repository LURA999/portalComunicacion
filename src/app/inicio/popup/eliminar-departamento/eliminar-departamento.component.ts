import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { departamento } from '../editar-usuario/usuario-form.component';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/core/services/usuario.service';


@Component({
  selector: 'app-eliminar-departamento',
  templateUrl: './eliminar-departamento.component.html',
  styleUrls: ['./eliminar-departamento.component.css']
})
export class EliminarDepartamentoComponent {
  departamentos : departamento  [] = [];


  @ViewChild('cancelarBtn') cancelarBtn!: MatButton;
  @ViewChild('agregarBtn') agregarBtn!: MatButton;

  formRest! : FormGroup;

  constructor(private fb : FormBuilder,@Inject(MAT_DIALOG_DATA) public data : Number,
  private service : UsuarioService,
  public dialogRef: MatDialogRef<EliminarDepartamentoComponent>){

  }

  ngOnInit(): void {
       this.formRest = this.fb.group({
        idDepartamento : ["", Validators.required]
      })
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
      let res =Number((await lastValueFrom(this.service.eliminarDepartamento(this.formRest.value))).status)
      if(res == 200){
          this.cancelarBtn.disabled = true;
          this.agregarBtn.disabled = true;
          this.dialogRef.close();
        }else{
          alert('Esta siendo utilizado');
          this.cancelarBtn.disabled = false;
          this.agregarBtn.disabled = false;

        }

      }else{
        this.cancelarBtn.disabled = false;
        this.agregarBtn.disabled = false;
      }
    }
}
