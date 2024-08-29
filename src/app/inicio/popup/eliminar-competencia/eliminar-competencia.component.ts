import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, concatMap, map, Observable, of, startWith } from 'rxjs';
import { locales } from '../editar-slider/editar-slider.component';
import { votaciones } from '../../opcion-config/votaciones-config/votaciones-config.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { VotacionesService } from 'src/app/core/services/votaciones_service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { localService } from 'src/app/core/services/local.service';
import { MatSelectChange } from '@angular/material/select';
import { EliminarCompetenciaSeguridadComponent } from '../eliminar-competencia-seguridad/eliminar-competencia-seguridad.component';

@Component({
  selector: 'app-eliminar-competencia',
  templateUrl: './eliminar-competencia.component.html',
  styleUrl: './eliminar-competencia.component.css'
})
export class EliminarCompetenciaComponent {
  myControlEventos = new FormControl('');
  filteredOptionsEventos!: Observable<votaciones[]>;
  eventoSeleccionado! : votaciones ;
  localInterfaz : locales[] = [];
  optionsEventos: Array<votaciones> = [ ];
  idCompentencia : number = 0;
  readonly dialog = inject(MatDialog);

  constructor(
    private ccia : VotacionesService,
    public dialogRef: MatDialogRef<EliminarCompetenciaComponent>,
    private local : localService){

      this.local.todoLocal(1).pipe(
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
        })
    }

  selectedEvento(e : MatAutocompleteSelectedEvent){
    this.eventoSeleccionado = e.option.value as votaciones

    this.idCompentencia = (e.option.value as votaciones).idCompetencia;
    this.myControlEventos.patchValue(
      this.eventoSeleccionado.nombre
    )
  }

  selectedLocal(e : MatSelectChange){

    this.ccia.imprimirDatosCompetencia(e.value," ").subscribe( async (resp : ResponseInterfaceTs)=>{
      this.optionsEventos = [];
      if (resp.status.toString() === '200') {
        this.optionsEventos = resp.container;
      }
    })

  }

  ngOnInit(): void {
    this.filteredOptionsEventos = this.myControlEventos.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEventos(value)),
    );
  }

  private _filterEventos(value: any) : votaciones[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.nombre.toLowerCase();
    return this.optionsEventos.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  async enviarDatos(salir : boolean){
    if (salir) {
      let dialogRef = this.dialog.open(EliminarCompetenciaSeguridadComponent, {
        width: '50%'
      });

      dialogRef.afterClosed().subscribe(async (result :boolean)=> {
      if (result) {
        this.ccia.eliminarCompetencia(this.idCompentencia).pipe(
          concatMap((resp:ResponseInterfaceTs) =>{
            return this.ccia.imprimirDatosCompetencia(-1," ").pipe(
              concatMap((resp2 : ResponseInterfaceTs) => {
              if (resp2.status.toString() === '200') {
                this.dialogRef.close(resp2.container)
              }else{
                this.dialogRef.close(undefined)
              }
              return of("")
            }))
          })
        ).subscribe()
      }
    })

    }
  }

}
