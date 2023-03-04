
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  $sub : Subscription = new Subscription()

  logo:any;
  email = new FormControl('', [Validators.required, Validators.email])
  hide = true;
  formSesion : FormGroup =  this.fb.group({
    usuario: ['', Validators.required],
    contrasena:  ['', Validators.required],
  });
  link : string =  environment.production === true ? "": "../../../";


  constructor( private usuarioServicio : LoginService, private router:Router, private fb :FormBuilder,
    private auth : AuthService) { }

  ngOnInit(): void {

  }

  //Validacion de correo en input
  getErrorMessage() {

  }

  form(){
    if(this.formSesion.valid){
      this.$sub.add(this.usuarioServicio.login(btoa(this.formSesion.controls['usuario'].value),btoa(this.formSesion.controls['contrasena'].value)).subscribe((response:any) =>{
      if(response.status === "ok"){
       this.auth.crearSesion(response.container);
       this.router.navigateByUrl('/general')
      }else{
        alert(response.info)
      }
    }));
  }else{
    alert("Por favor acomplete los campos");
  }
}

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }
}
