import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComidaService } from 'src/app/core/services/comida.service';
import { localService } from 'src/app/core/services/local.service';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import { comida } from '../../opcion-config/menu-config/menu-config.component';
import { local } from '../../opcion-config/usuarios-config/usuarios.component';
import {lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-comida-form',
  templateUrl: './comida-form.component.html',
  styleUrls: ['./comida-form.component.css']
})
export class ComidaFormComponent implements OnInit {

    hoyDate :Date = new Date()
    modalidad : boolean = false;
    formComida : FormGroup = this.fb.group({
      fecha : ['', Validators.required],
      nombre : ['', Validators.required],
      descripcion : [ '' , Validators.required],
      cveLocal : [ '' , Validators.required]
    })

  constructor(private fb : FormBuilder,public dialogRef: MatDialogRef<ComidaFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: comida, private local : localService, private comidaService : ComidaService) {
      console.log(this.data);

    }



  localesArray : local [] = []

  ngOnInit(): void {
      if (this.data !== undefined) {
      this.formComida = this.fb.group({
        fecha : [new Date(this.data.fecha+"T00:00:00"), Validators.required],
        nombre : [this.data.nombre, Validators.required],
        descripcion : [ this.data.descripcion , Validators.required],
        cveLocal : [ this.data.cveLocal , Validators.required]
      })
      this.modalidad = false;
    }else{
      this.modalidad = true;
    }

    this.local.todoLocal(-1).subscribe(async(resp:ResponseInterfaceTs) =>{
      for await (const i of resp.container) {
        this.localesArray.push({idLocal:i.idLocal, local:i.nombre})
      }
      this.localesArray.shift()
    })


  }

  async enviandoDatos(){
    if (this.formComida.valid == false) {
      alert("Por favor llene todos los campos");
    } else {
      if (this.modalidad == true) {
        await lastValueFrom(this.comidaService.insertarComida(this.formComida.value));
        this.comidaService.todoComida(0,1).subscribe(async (resp:ResponseInterfaceTs)=>{
           this.dialogRef.close(await resp.container);
        })
      } else {
        let idMenu = this.data.idMenu;
        this.data = this.formComida.value;
        this.data.idMenu = idMenu;
        await lastValueFrom(this.comidaService.actualizarComida(this.formComida.value));
        this.comidaService.todoComida(0,1).subscribe(async (resp:ResponseInterfaceTs)=>{
           this.dialogRef.close(await resp.container);
        })
      }
    }
  }
}
