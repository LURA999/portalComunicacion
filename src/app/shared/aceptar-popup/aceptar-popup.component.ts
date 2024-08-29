import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { metodosRepetidos } from 'src/app/metodos-repetidos';

@Component({
  selector: 'app-aceptar-popup',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './aceptar-popup.component.html',
  styleUrl: './aceptar-popup.component.css'
})
export class AceptarPopupComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialogRef: MatDialogRef<AceptarPopupComponent>,
  ){
    let n = new metodosRepetidos();
    console.log(n.detectBrowser());

  }

  cerrar(sino : boolean){
    this.dialogRef.close(sino)
  }


}
