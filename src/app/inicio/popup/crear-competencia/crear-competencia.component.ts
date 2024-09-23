import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, concatMap, forkJoin, lastValueFrom, map, Observable, of, startWith, Subscription } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { localService } from 'src/app/core/services/local.service';
import { locales } from '../editar-slider/editar-slider.component';
import { competencia, VotacionesService } from 'src/app/core/services/votaciones_service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatDialogRef } from '@angular/material/dialog';
import { Equipo, votacionesEquipoService } from 'src/app/core/services/votaciones_equipo.service';


export interface opcion {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-crear-competencia',
  templateUrl: './crear-competencia.component.html',
  styleUrls: ['./crear-competencia.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrearCompetenciaComponent {
  date : Date = new Date()
  rango : Date | undefined
  rango2 : Date | undefined
  seleccionadasNumber : Array<number> = []
  formCompetencia : FormGroup = this.fb.group({
    nombre : [ '' , Validators.required],
    cveLocal : [ '' , Validators.required],
    fechaInicial : [ '' , Validators.required],
    fechaFinal : [ '' , Validators.required]
    /**
    fechaInicial : [new Date(this.data.obj.fechaInicial+"T00:00:00"), Validators.required],
    fechaFinal : [new Date(this.data.obj.fechaFinal+"T00:00:00"), Validators.required],
    */
 })
 myControl = new FormControl('');
 seleccionadas : Array<Equipo> = []
 $sub : Subscription = new Subscription()
 localInterfaz : locales[] = []
 cveSeccion: number = 1;
 readonly separatorKeysCodes: number[] = [ENTER, COMMA];

 opcionEquipo : Array<Equipo> = []
 filteredOptionsEquipo!: Observable<Equipo[]>;
 desactivarBoton : boolean = false

 constructor(
  private fb : FormBuilder,
  private local : localService,
  private user : UsuarioService,
  private ccia : VotacionesService,
  private vce : votacionesEquipoService,
  public dialogRef: MatDialogRef<CrearCompetenciaComponent>
  ) {

    this.vce.mostrarEquipos().subscribe( async (resp : ResponseInterfaceTs)=>{
      if (resp.status.toString() === '200') {
        this.opcionEquipo = resp.container;
        this.filteredOptionsEquipo = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterEquipo(value)),
        );
      }
    })

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
  private _filterEquipo(value: any) : Equipo[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.nombreEquipo.toLowerCase();
    return this.opcionEquipo.filter(option => option.nombreEquipo.toLowerCase().includes(filterValue));
  }


  remove(competencia: Equipo){
    let id : number= this.seleccionadas.indexOf(competencia)
    this.seleccionadas.splice(id, 1)
    this.seleccionadasNumber.splice(id, 1)
  }

  selectedUsuario(e : MatAutocompleteSelectedEvent){

    if (this.seleccionadasNumber.indexOf((e.option.value as Equipo).idEquipo!) == -1) {
      this.seleccionadasNumber.push((e.option.value as Equipo).idEquipo!)
      this.seleccionadas.push(e.option.value as Equipo)
      //this.opcionEquipo = []
      // (e.option.value as opcion).nombre
      this.myControl.patchValue((
        ""
      ))
    }else{
      this.myControl.patchValue((
        ""
      ))
      alert("El usuario ya esta agregado en la competencia.")
    }
  }

/*   async buscarUsuario(){
    if (this.formCompetencia.value["cveLocal"].length !== 0) {
      this.options = (await lastValueFrom(this.user.selectUsuariosHotel(String(this.myControl.value), Number(this.formCompetencia.value["cveLocal"])))).container
    }
  } */

  private filterOptions(value: string): Observable<ResponseInterfaceTs> {
    return this.user.selectUsuariosHotel(String(value), Number(this.formCompetencia.value["cveLocal"]))
  }


  enviarDatos(){
    if (this.formCompetencia.valid && this.myControl.valid && this.seleccionadas.length > 0) {
    this.desactivarBoton = true
      // let opciones : any = { month: 'short', day: 'numeric', year: 'numeric' };
      let objeto : competencia = this.formCompetencia.value;
      /* let date1 : string [] = new Date((this.formCompetencia.value["fechaFinal"] as Date)+"T00:00:00").toLocaleDateString('es',opciones).split(" ")
      objeto.fechaFinal = date1[0]+" "+date1[1]+", "+date1[2]
      let date2 : string [] = new Date((this.formCompetencia.value["fechaInicial"] as Date)+"T00:00:00").toLocaleDateString('es',opciones).split(" ")
      objeto.fechaInicial = date2[0]+" "+date2[1]+", "+date2[2] */
      this.ccia.insertarCompetencia(objeto).subscribe((resp: ResponseInterfaceTs) => {
        let arrObservable : Observable<ResponseInterfaceTs>[] = []
        for (let h = 0; h < this.seleccionadas.length; h++) {
          arrObservable.push(this.ccia.insertarUsuariosCompetencia(Number(resp.container[0]["ultimoId"]), this.seleccionadas[h].idEquipo!))
        }
        forkJoin(arrObservable).subscribe(async (resp:Array<ResponseInterfaceTs>) =>{
          let tabla = (await lastValueFrom(  this.ccia.imprimirDatosCompetencia(-1," ")))
          if (tabla.status.toString() === '200') {
            this.dialogRef.close(tabla.container)
            this.desactivarBoton = false
          }else{
            this.dialogRef.close(undefined)
            this.desactivarBoton = false
          }
        })
      })
    }else{
      if (this.seleccionadas.length == 0) {
        alert("Por favor seleccione a los competidores")
      }
    }
  }

  vaciarAutocomplete(){
    //this.opcionEquipo = []
    //this.seleccionadas = []
  }

  fecha1(fecha : Date){
    this.rango = fecha
  }

  fecha2(fecha : Date){
    this.rango2 = fecha
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }
}
