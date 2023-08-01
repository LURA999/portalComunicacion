import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { AddAraizaAprendeComponent } from '../../popup/add-araiza-aprende/add-araiza-aprende.component';
import { RestAraizaAprendeComponent } from '../../popup/rest-araiza-aprende/rest-araiza-aprende.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';

@Component({
  selector: 'app-araiza-aprende-config',
  templateUrl: './araiza-aprende-config.component.html',
  styleUrls: ['./araiza-aprende-config.component.css']
})
export class AraizaAprendeConfigComponent {

  formAraizaAprende : FormGroup = this.fb.group({
    categoria : ["", Validators.required],
    tema : ["", Validators.required],
    nombre : ["", Validators.required],
    link : ["", Validators.required],
    input : ["", Validators.required],
  })


  formData : FormData = new FormData();
  target: any
  activar : boolean = false
  sliderListo :boolean = false;
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");
  @ViewChild('miBoton') miBoton!: MatButton;

constructor(
  private fb : FormBuilder,
  private dialog : NgDialogAnimationService){

}

activarBut(){
  if((this.formAraizaAprende.valid ===false && this.activar === false || this.formAraizaAprende.valid ===true && this.activar === true) || this.sliderListo === false){
    this.miBoton.disabled = true;
  }else{
    this.miBoton.disabled = false;
  }
}

async subirImg(evt : any){
  if (this.target.type.split("/")[0] == "image") {

  this.target = <DataTransfer>(evt.target).files[0];
  const image = new Image();

  image.onload = () => {
  // if (Number(image.naturalWidth) == 2550 && Number(image.naturalHeight) == 800) {
    if( ((this.target.size/1024)<=2048 )){
      this.formAraizaAprende = this.target.type
      this.formData.forEach((file :any)=> {
        this.formAraizaAprende.patchValue({
          imgVideo : file.name
        })
      });
      this.sliderListo = true;
      this.activarBut();
    }else{
      this.sliderListo = false;
      this.activarBut();
      alert("Solo se permiten imagenes menores o igual a 2MB");
      this.target  = new DataTransfer()
      let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
      inpimg2.value="";

      }
  }
  image.src = URL.createObjectURL(this.target);
  } else {
    alert('Solo se permiten imagenes')
  }


}


  async enviandoDatos(){
    this.activarBut();

    if(this.miBoton.disabled === false){

    if (this.formAraizaAprende.valid == false) {
      alert("Por favor llene todos los campos");
    } else {
      this.contenedor_carga.style.display = "block";

      this.activar = true
      /* let intfz : imgVideoModel  =  */this.formAraizaAprende.value
      /* intfz.cveSeccion = this.cveSeccion */
      /* intfz.formato =  this.formatoVideo */
      //en este paso se cambiara el nombre dependiendo de la seccion (pagina) en la que esten


    }
  }
  }

  add(){
    let dialogRef = this.dialog.open(AddAraizaAprendeComponent, {
      height: 'auto',
      width: '450px',
      data: ''
    });
    dialogRef.afterClosed().subscribe(async (resp:any)=>{


     })
  }

  rest(){
    let dialogRef = this.dialog.open(RestAraizaAprendeComponent, {
      height: 'auto',
      width: '450px',
      data: ''
    });
    dialogRef.afterClosed().subscribe(async (resp:any)=>{


     })
  }
}
