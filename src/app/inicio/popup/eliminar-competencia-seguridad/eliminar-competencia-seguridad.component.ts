import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-eliminar-competencia-seguridad',
  templateUrl: './eliminar-competencia-seguridad.component.html',
  styleUrl: './eliminar-competencia-seguridad.component.css'
})
export class EliminarCompetenciaSeguridadComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialogRef: MatDialogRef<EliminarCompetenciaSeguridadComponent>,
  ){

  }
  cerrar(sino : boolean){
    this.dialogRef.close(sino)
  }
}
