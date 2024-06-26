import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { BuzonSugerenciaService } from 'src/app/core/services/buzonSugerencia.service';
import { metodosRepetidos } from 'src/app/metodos-repetidos';

export interface correoAyuda{
  experencia : String;
  numero : Number;
  asunto : String;
  local : String;
}

@Component({
  selector: 'app-linea-de-ayuda',
  templateUrl: './linea-de-ayuda.component.html',
  styleUrls: ['./linea-de-ayuda.component.css']
})
export class LineaDeAyudaComponent {
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
    public dialogRef: MatDialogRef<LineaDeAyudaComponent>,){}

  async enviandoDatos(){
    let input : correoAyuda = {
      asunto : this.formSugerencia.controls['asunto'].value,
      experencia : this.formSugerencia.controls['mensaje'].value,
      numero: this.id,
      local : this.local.toString()
    }

    if (this.formSugerencia.valid) {
      this.enviar.disabled = true;
      await lastValueFrom(this.enviarService.enviarAyuda(input))
      this.enviar.disabled = false;
      this.dialogRef.close(true);
    }else{
      alert('A complete el formulario, por favor');
    }


  }
}
