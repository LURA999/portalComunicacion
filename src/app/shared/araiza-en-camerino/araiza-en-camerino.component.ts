import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { BuzonSugerenciaService } from 'src/app/core/services/buzonSugerencia.service';
import { metodosRepetidos } from 'src/app/metodos-repetidos';
import { BuzonSugerenciaComponent } from '../buzon-sugerencia/buzon-sugerencia.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface correoEnCamerino{
  sugerencia : String;
  numero : Number;
  local : String;
  correo: String;
}

@Component({
  selector: 'app-araiza-en-camerino',
  templateUrl: './araiza-en-camerino.component.html',
  styleUrls: ['./araiza-en-camerino.component.css']
})
export class AraizaEnCamerinoComponent {
  metodos = new metodosRepetidos();
  formSugerencia : FormGroup = this.fb.group({
    mensaje : ['', Validators.required]
  })

  private local : Number = this.auth.getCveLocal();
  private id : Number = this.auth.getId();

  @ViewChild('enviar') enviar! : MatButton;

  constructor(
    private fb : FormBuilder,
    private auth : AuthService,
    private enviarService : BuzonSugerenciaService,
    public dialogRef: MatDialogRef<BuzonSugerenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any){


    }

  async enviandoDatos(){

    let input : correoEnCamerino = {
      correo:this.data['correo'],
      sugerencia : this.formSugerencia.controls['mensaje'].value,
      numero: this.id,
      local : this.local.toString()
    }

    if (this.formSugerencia.valid) {
      this.enviar.disabled = true;
      await lastValueFrom(this.enviarService.enviarEnCamerino(input))
      this.enviar.disabled = false;
      this.dialogRef.close(true);
    }else{
      alert('A complete el formulario, por favor');
    }


  }
}
