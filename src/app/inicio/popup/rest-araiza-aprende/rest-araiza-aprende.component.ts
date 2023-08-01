import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rest-araiza-aprende',
  templateUrl: './rest-araiza-aprende.component.html',
  styleUrls: ['./rest-araiza-aprende.component.css']
})
export class RestAraizaAprendeComponent {


  constructor(private fb : FormBuilder,@Inject(MAT_DIALOG_DATA) public data : any){

  }

  enviandoDatos(){
  }
}
