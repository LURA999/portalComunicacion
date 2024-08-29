import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-examen-enviado',
  templateUrl: './examen-enviado.component.html',
  styleUrl: './examen-enviado.component.css'
})
export class ExamenEnviadoComponent {

  private link : String = '';
  private local : Number = this.auth.getCveLocal();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private auth : AuthService) { }

  imagen() : String{


    switch(Number(this.local)){
      case 0:
        this.link = '../../../../assets/img/logos/logomxl.svg';
      break;
      case 1:
        this.link = '../../../../assets/img/logos/logocal.svg';
      break;
      case 2:
        this.link = '../../../../assets/img/logos/logosl.svg';
      break;
      case 3:
        this.link = '../../../../assets/img/logos/logopal.svg';
      break;
      default:
        this.link = '../../../../assets/img/logos/logohmo.svg';
      break;

    }
    return this.link
  }
}
