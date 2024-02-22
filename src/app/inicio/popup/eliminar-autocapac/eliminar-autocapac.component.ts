import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { capacitacion } from '../crear-autocapac/crear-autocapac.component';
import { AutocapacitacionService } from 'src/app/core/services/autocapacitacion.service';

@Component({
  selector: 'app-eliminar-autocapac',
  templateUrl: './eliminar-autocapac.component.html',
  styleUrls: ['./eliminar-autocapac.component.css']
})
export class EliminarAutocapacComponent {
  capacitacion : capacitacion  [] = [];


  @ViewChild('cancelarBtn') cancelarBtn!: MatButton;
  @ViewChild('agregarBtn') agregarBtn!: MatButton;

  formRest! : FormGroup;

  constructor(private fb : FormBuilder,
  @Inject(MAT_DIALOG_DATA) public data : Number,
  private autocapacServ : AutocapacitacionService,
  public dialogRef: MatDialogRef<EliminarAutocapacComponent>){

  }

  ngOnInit(): void {
       this.formRest = this.fb.group({
        idCapacitacion : ["", Validators.required]
      })
      this.autocapacServ.mostrarTodoAutocapacitacion().subscribe(async (resp:ResponseInterfaceTs) => {
        for await (const i of resp.container) {
          this.capacitacion.push({
            idCapacitacion : i.idCapacitacion,
            nombre : i.nombre,
            img : i.img,
            link : i.link
          })
        }
      })
  }

  async enviandoDatos(){
    if (this.formRest.valid) {
    this.cancelarBtn.disabled = true;
    this.agregarBtn.disabled = true;
      let res =Number((await lastValueFrom(this.autocapacServ.eliminarAutocapacitacion(Number(this.formRest.value['idCapacitacion'].toString())))).status)
      if(res == 200){
          this.cancelarBtn.disabled = true;
          this.agregarBtn.disabled = true;
          this.dialogRef.close();
        }else{
          alert('Esta siendo utilizado');
          this.cancelarBtn.disabled = false;
          this.agregarBtn.disabled = false;

        }

        }else{
          this.cancelarBtn.disabled = false;
          this.agregarBtn.disabled = false;
        }
    }
}
