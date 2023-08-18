import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { BuzonSugerenciaService } from 'src/app/core/services/buzonSugerencia.service';
import { metodosRepetidos } from 'src/app/metodos-repetidos';
import { MatButton } from '@angular/material/button';
import {lastValueFrom} from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog';

export interface correoSugerencia{
  sugerencia : String;
  numero : Number;
  asunto : String;
  local : String;
}

@Component({
  selector: 'app-buzon-sugerencia',
  templateUrl: './buzon-sugerencia.component.html',
  styleUrls: ['./buzon-sugerencia.component.css']
})
export class BuzonSugerenciaComponent {
  metodos = new metodosRepetidos();
  formSugerencia : FormGroup = this.fb.group({
    asunto : ['', Validators.required],
    mensaje : ['', Validators.required]
  })

  private local : Number = this.auth.getCveLocal();
  private id : Number = this.auth.getId();

  @ViewChild('enviar') enviar! : MatButton;

  constructor(
    private fb : FormBuilder,
    private auth : AuthService,
    private enviarService : BuzonSugerenciaService,
    public dialogRef: MatDialogRef<BuzonSugerenciaComponent>,){}

  async enviandoDatos(){
    let input : correoSugerencia = {
      asunto : this.formSugerencia.controls['asunto'].value,
      sugerencia : this.formSugerencia.controls['mensaje'].value,
      numero: this.id,
      local : this.local.toString()
    }

    if (this.formSugerencia.valid) {
      this.enviar.disabled = true;
      await lastValueFrom(this.enviarService.enviarSugerencia(input))
      this.enviar.disabled = false;
      this.dialogRef.close(true);
    }else{
      alert('A complete el formulario, por favor');
    }


  }
}
