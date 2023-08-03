import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AraizaAprendeService } from 'src/app/core/services/araiza_aprende.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { categoriaInterfaz, temaInterfaz } from '../../opcion-config/araiza-aprende-config/araiza-aprende-config.component';

@Component({
  selector: 'app-add-araiza-aprende',
  templateUrl: './add-araiza-aprende.component.html',
  styleUrls: ['./add-araiza-aprende.component.css']
})
export class AddAraizaAprendeComponent {
  formAdd : FormGroup = this.fb.group({
    nombre : ['', Validators.required],

  })
  categorias : categoriaInterfaz  [] = [];
  temas : temaInterfaz  [] = [];

  @ViewChild('cancelarBtn') cancelarBtn!: MatButton;
  @ViewChild('agregarBtn') agregarBtn!: MatButton;

  constructor(private fb : FormBuilder,@Inject(MAT_DIALOG_DATA) public data : Number, private araizaAprende : AraizaAprendeService,
  private service : AraizaAprendeService,
  public dialogRef: MatDialogRef<AddAraizaAprendeComponent>){

  }

  async enviandoDatos() {

    if (this.formAdd.valid) {
      this.cancelarBtn.disabled = true;
    this.agregarBtn.disabled = true;
    if(this.data == 1){
      let res =Number((await lastValueFrom(this.araizaAprende.insertarCategoria(this.formAdd.value['nombre']))).status)

      if(res == 200){
        this.service.todoCategorias().subscribe((resp:ResponseInterfaceTs) =>{
          for (let i = 0; i < resp.container.length; i++) {
            this.categorias.push(resp.container[i]);
          }
          this.cancelarBtn.disabled = true;
          this.agregarBtn.disabled = true;
          this.dialogRef.close(this.categorias);
        })

      }else{
        this.cancelarBtn.disabled = false;
        this.agregarBtn.disabled = false;
      }
    }else{
        let res =Number((await lastValueFrom(this.araizaAprende.insertarTema(this.formAdd.value['nombre']))).status)
      if(res == 200){
        this.service.todoTemas().subscribe((resp:ResponseInterfaceTs) =>{
          for (let i = 0; i < resp.container.length; i++) {
            this.temas.push(resp.container[i]);
          }
          this.cancelarBtn.disabled = true;
          this.agregarBtn.disabled = true;
          this.dialogRef.close(this.temas);
        })
      }else{
        this.cancelarBtn.disabled = false;
        this.agregarBtn.disabled = false;
      }
    }
  }


  }

}
