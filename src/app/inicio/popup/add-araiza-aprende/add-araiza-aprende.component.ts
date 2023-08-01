import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-araiza-aprende',
  templateUrl: './add-araiza-aprende.component.html',
  styleUrls: ['./add-araiza-aprende.component.css']
})
export class AddAraizaAprendeComponent {
  formAdd : FormGroup = this.fb.group({
    nombre : ['', Validators.required],

  })

  constructor(private fb : FormBuilder){

  }

  enviandoDatos(){

  }

}
