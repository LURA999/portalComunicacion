import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { videoAraizaAprende } from 'src/app/core/services/araiza_aprende.service';

@Component({
  selector: 'app-password-popup',
  templateUrl: './password-popup.component.html',
  styleUrl: './password-popup.component.css'
})
export class PasswordPopupComponent {
  formRest : FormGroup = this.fb.group({
    contrasena : ["", Validators.required]
  })

  hide = true;

  constructor(private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: videoAraizaAprende,
    public dialogRef: MatDialogRef<PasswordPopupComponent>){

  }

  async enviandoDatos(){
    if (this.formRest.value['contrasena'] == this.data.contrasena) {
      this.dialogRef.close(true);
    }else{
      // this.dialogRef.close(false);
    }
  }



}
