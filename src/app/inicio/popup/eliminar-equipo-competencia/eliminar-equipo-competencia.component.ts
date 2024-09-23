import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, concatMap, map, Observable, of, startWith } from 'rxjs';
import { localService } from 'src/app/core/services/local.service';
import { Equipo, votacionesEquipoService } from 'src/app/core/services/votaciones_equipo.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { locales } from '../editar-slider/editar-slider.component';
import { MatSelectChange } from '@angular/material/select';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { votaciones } from '../../opcion-config/votaciones-config/votaciones-config.component';

@Component({
  selector: 'app-eliminar-equipo-competencia',
  templateUrl: './eliminar-equipo-competencia.component.html',
  styleUrl: './eliminar-equipo-competencia.component.css'
})
export class EliminarEquipoCompetenciaComponent {

  myControlEquipo = new FormControl('');
  filteredOptionsEquipo!: Observable<Equipo[]>;
  equipoSeleccionado! : Equipo ;
  localInterfaz : locales[] = [];
  optionsEquipo: Array<Equipo> = [ ];
  idCompentencia : number = 0;
  readonly dialog = inject(MatDialog);

  constructor(
    private vce : votacionesEquipoService,
    public dialogRef: MatDialogRef<EliminarEquipoCompetenciaComponent>,
    private local : localService){

      this.vce.mostrarEquipos().subscribe( async (resp : ResponseInterfaceTs)=>{
        if (resp.status.toString() === '200') {
          this.optionsEquipo = resp.container;
          /* this.filteredOptionsEquipo = this.myControlEquipo.valueChanges.pipe(
            startWith(''),
            map(value => this._filterEquipo(value)),
          ); */
        }
      })

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

  selectedEvento(e : MatAutocompleteSelectedEvent) {
    this.equipoSeleccionado = e.option.value as Equipo;
    this.idCompentencia = (e.option.value as Equipo).idEquipo!;
    this.myControlEquipo.patchValue(
      this.equipoSeleccionado.nombreEquipo
    )
  }

  // selectedLocal(e : MatSelectChange){
  //   this.optionsEventos = [];
  //   this.ccia.imprimirDatosCompetencia(e.value," ").subscribe( async (resp : ResponseInterfaceTs)=>{

  //     if (resp.status.toString() === '200') {
  //       this.optionsEventos = resp.container;
  //       this.filteredOptionsEventos = this.myControlEventos.valueChanges.pipe(
  //         startWith(''),
  //         map(value => this._filterEventos(value)),
  //       );
  //     }

  //   })

  // }

  ngOnInit(): void {
    this.filteredOptionsEquipo = this.myControlEquipo.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEquipo(value)),
    );
  }

  private _filterEquipo(value: any) : Equipo[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.nombreEquipo.toLowerCase();
    return this.optionsEquipo.filter(option => option.nombreEquipo.toLowerCase().includes(filterValue));
  }

  async enviarDatos(salir : boolean){

    //Elimina tanto la imagen como el equipo
    let dialogRef = this.dialog.open(EliminarComponent, {
      height: 'auto',
      width: 'auto',
      data: {id: this.idCompentencia,seccion: "equipo"}
    });

    dialogRef.afterClosed().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:Array<votaciones>)=>{
        this.dialogRef.close(resp)
    })
  }

}
