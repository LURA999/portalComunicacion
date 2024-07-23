import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, Subscription } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { localService } from 'src/app/core/services/local.service';
import { locales } from '../editar-slider/editar-slider.component';

@Component({
  selector: 'app-editar-competencia',
  templateUrl: './editar-competencia.component.html',
  styleUrls: ['./editar-competencia.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditarCompetenciaComponent {
  formAutoCapac : FormGroup = this.fb.group({
    nombre : [ '' , Validators.required],
    cveLocal : [ '' , Validators.required]
 })
 myControl = new FormControl('');
 options: string[] = ['One', 'Two', 'Three'];
 $sub : Subscription = new Subscription()
 localInterfaz : locales[] = []
 cveSeccion: number = 1;

 constructor(
  private fb : FormBuilder,
  private local : localService) {
    this.$sub.add(this.local.todoLocal(1).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:ResponseInterfaceTs)=>{
      for await (const i of resp.container) {
        if( (this.cveSeccion == 1 ||  this.cveSeccion == -1) && Number(i.idLocal) >= 0 ||
          this.cveSeccion > 1 && Number(i.idLocal) > 0){
          this.localInterfaz.push({
            idLocal : i.idLocal,
            local : i.nombre,
            cantidad : i.cantidad
          })
        }
      }
    }))
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }
}
