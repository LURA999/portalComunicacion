import { Component,Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, lastValueFrom, Subscription } from 'rxjs';
import { AutocapacitacionService } from 'src/app/core/services/autocapacitacion.service';
import { localService } from 'src/app/core/services/local.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { autocapacitacionInt } from '../../opcion-config/autocapac-config/autocapac-config.component';
import { local } from '../../opcion-config/usuarios-config/usuarios.component';
import { locales } from '../editar-slider/editar-slider.component';

@Component({
  selector: 'app-editar-autocapac',
  templateUrl: './editar-autocapac.component.html',
  styleUrls: ['./editar-autocapac.component.css']
})
export class EditarAutocapacComponent implements OnInit {
  modalidad : boolean = false;
  localInterfaz :locales[] = []
  date : Date = new Date()
  rango : Date | undefined
  rango2 : Date | undefined
  $sub : Subscription = new Subscription()

  constructor(private fb : FormBuilder,public dialogRef: MatDialogRef<EditarAutocapacComponent>, private autoService : AutocapacitacionService,
    @Inject(MAT_DIALOG_DATA) private data: autocapacitacionInt,private local : localService) {
      this.$sub.add(this.local.todoLocal(1).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async(resp: ResponseInterfaceTs)=>{
        for await (const i of resp.container) {
          this.localInterfaz.push({
            idLocal : i.idLocal,
            local : i.nombre,
            cantidad : i.cantidad
          })
        }
        this.localInterfaz.shift()
      }))
     }
  formAutoCapac : FormGroup = this.fb.group({
    fechaFinal : ['', Validators.required],
    fechaInicial : ['', Validators.required],
    nombre : [ '' , Validators.required],
    cveLocal : [ '' , Validators.required],
    link : [ '' , Validators.required]
  })

  fecha1(fecha : Date){
    this.rango = fecha
  }

  fecha2(fecha : Date){
    this.rango2 = fecha
  }

  ngOnInit(): void {
    if (this.data !== undefined) {
      this.formAutoCapac = this.fb.group({
        fechaFinal : [new Date(this.data.fechaFinal+"T00:00:00"), Validators.required],
        fechaInicial : [new Date(this.data.fechaInicial+"T00:00:00"), Validators.required],
        nombre : [this.data.nombre, Validators.required],
        cveLocal : [ this.data.cveLocal , Validators.required],
        link : [ this.data.link , Validators.required]

      })
      this.modalidad = false;
    }else{
      this.modalidad = true;
    }
  }


  async enviandoDatos(){
    if (this.formAutoCapac.valid == false) {
      alert("Por favor llene todos los campos");
    } else {
      if (this.modalidad == true) {
        await lastValueFrom(this.autoService.insertarAutocapacitacion(this.formAutoCapac.value));
      } else {
        let idAutoCap = this.data.idAutoCap;
        this.data = this.formAutoCapac.value;
        this.data.idAutoCap = idAutoCap;
        await lastValueFrom(this.autoService.actualizarAutocapacitacion(this.formAutoCapac.value));
      }
      this.$sub.add(this.autoService.mostrarTodoAutocapacitacion(0).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:ResponseInterfaceTs)=>{
        this.dialogRef.close(await resp.container);
     }))
    }
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }
}
