import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { categoriaInterfaz, temaInterfaz } from '../../opcion-config/araiza-aprende-config/araiza-aprende-config.component';
import { AraizaAprendeService } from 'src/app/core/services/araiza_aprende.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { MatButton } from '@angular/material/button';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-rest-araiza-aprende',
  templateUrl: './rest-araiza-aprende.component.html',
  styleUrls: ['./rest-araiza-aprende.component.css']
})
export class RestAraizaAprendeComponent {

  categorias : categoriaInterfaz  [] = [];
  temas : temaInterfaz  [] = [];

  @ViewChild('cancelarBtn') cancelarBtn!: MatButton;
  @ViewChild('agregarBtn') agregarBtn!: MatButton;

  formRest : FormGroup = this.fb.group({
    categoria : ["", Validators.nullValidator],
    tema : ["", Validators.nullValidator]
  })

  constructor(private fb : FormBuilder,@Inject(MAT_DIALOG_DATA) public data : Number,
  private service : AraizaAprendeService,
  public dialogRef: MatDialogRef<RestAraizaAprendeComponent>){

  }

  ngOnInit(): void {
    if (this.data == 11) {
      this.service.todoCategorias().subscribe((resp:ResponseInterfaceTs) =>{
        for (let i = 0; i < resp.container.length; i++) {
          this.categorias.push(resp.container[i]);
        }
      })
    } else {
      this.service.todoTemas().subscribe((resp:ResponseInterfaceTs) =>{
        for (let i = 0; i < resp.container.length; i++) {
          this.temas.push(resp.container[i]);
        }
      })
    }



  }

  async enviandoDatos(){
    this.cancelarBtn.disabled = true;
    this.agregarBtn.disabled = true;
    if(this.data == 11){
      let res =Number((await lastValueFrom(this.service.eliminarCategoria(this.formRest.value['categoria']))).status)
      if(res == 200){
        this.service.todoCategorias().subscribe((resp:ResponseInterfaceTs) =>{
          this.categorias = []
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
      let res =Number((await lastValueFrom(this.service.eliminarTema(this.formRest.value['tema']))).status)
      if(res == 200){
        this.service.todoTemas().subscribe((resp:ResponseInterfaceTs) =>{
          this.temas = []
          for (let i = 0; i < resp.container.length; i++) {
            this.temas.push(resp.container[i]);
          }
        })
        this.cancelarBtn.disabled = true;
        this.agregarBtn.disabled = true;
        this.dialogRef.close(this.temas);
      }else{
        this.cancelarBtn.disabled = false;
        this.agregarBtn.disabled = false;
      }
    }
  }
}
