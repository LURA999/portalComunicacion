import { Component } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { catchError, lastValueFrom, map, Observable, startWith, Subscription } from 'rxjs';
import { VotacionesService } from 'src/app/core/services/votaciones_service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { opcion } from '../crear-competencia/crear-competencia.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { localService } from 'src/app/core/services/local.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { locales } from '../editar-slider/editar-slider.component';
import { votaciones } from '../../opcion-config/votaciones-config/votaciones-config.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-votar-competencia',
  templateUrl: './editar-votar-competencia.component.html',
  styleUrl: './editar-votar-competencia.component.css'
})
export class EditarVotarCompetenciaComponent {
  date : Date = new Date()
  rango : Date | undefined
  rango2 : Date | undefined
  formCompetencia : FormGroup = this.fb.group({
    cveLocal : [ 0 , Validators.required],
    fechaInicial : [ '' , Validators.required],
    fechaFinal : [ '' , Validators.required]
 })

 formCompetenciaRespaldo : FormGroup = this.fb.group({
    cveLocal : [ 0 , Validators.required],
    fechaInicial : [ '' , Validators.required],
    fechaFinal : [ '' , Validators.required]
 })

 filteredOptionsEventos!: Observable<votaciones[]>;

 myControlEventos = new FormControl('');
 myControlEventosNuevo = new FormControl('');

 myControlUsuarios = new FormControl('');
 optionsEventos: Array<votaciones> = [ ];
 optionsUsuarios: Array<opcion> = [ ];

 seleccionadas : Array<opcion> = []
 seleccionadasNumber : Array<number> = []
 seleccionadasNumberRespaldo : Array<number> = []

 $sub : Subscription = new Subscription()
 localInterfaz : locales[] = []
 cveSeccion: number = 1;
 readonly separatorKeysCodes: number[] = [ENTER, COMMA];
 eventoSeleccionado! : votaciones ;

 constructor(
  private fb : FormBuilder,
  private local : localService,
  private user : UsuarioService,
  private ccia : VotacionesService,
  public dialogRef: MatDialogRef<EditarVotarCompetenciaComponent>
  ) {

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
    //para comprender completamente por que -1 y una cadena vacia, hay que ver la logica de la API
    this.ccia.imprimirDatosCompetencia(-1," ").subscribe( async (resp : ResponseInterfaceTs)=>{
      if (resp.status.toString() === '200') {
        this.optionsEventos = resp.container;
        this.filteredOptionsEventos = this.myControlEventos.valueChanges.pipe(
          startWith(''),
          map(value => this._filterEventos(value)),
        );
      }
    })

  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {

  }

  private _filterEventos(value: any) : votaciones[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.nombre.toLowerCase();
    return this.optionsEventos.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  selectedEvento(e : MatAutocompleteSelectedEvent){
    this.eventoSeleccionado = e.option.value as votaciones

    this.myControlEventos.patchValue(
      this.eventoSeleccionado.nombre
    )

    this.myControlEventosNuevo.patchValue(
      this.eventoSeleccionado.nombre
    )

    this.formCompetencia = this.fb.group({
      cveLocal : [ this.eventoSeleccionado.cveLocal, Validators.required],
      fechaInicial : [ new Date(this.eventoSeleccionado.fecha_inicial+"T00:00:00"), Validators.required],
      fechaFinal : [ new Date(this.eventoSeleccionado.fecha_final+"T00:00:00"), Validators.required],
    })

    this.formCompetenciaRespaldo = this.fb.group({
      cveLocal : [ this.eventoSeleccionado.cveLocal, Validators.required],
      fechaInicial : [ new Date(this.eventoSeleccionado.fecha_inicial+"T00:00:00"), Validators.required],
      fechaFinal : [ new Date(this.eventoSeleccionado.fecha_final+"T00:00:00"), Validators.required],
    })

    this.seleccionadas = []
    this.seleccionadasNumber = []
    this.seleccionadasNumberRespaldo = []
    this.ccia.imprimirUsuariosCompetencia(this.eventoSeleccionado.idCompetencia,-1).subscribe((resp:ResponseInterfaceTs) => {
      for (let i = 0; i < resp.container.length; i++) {
        this.seleccionadas.push(resp.container[i] as opcion)
        this.seleccionadasNumber.push((resp.container[i] as opcion).id)
        this.seleccionadasNumberRespaldo.push((resp.container[i] as opcion).id)
      }

    });
  }

  async buscarUsuario(){
    if (Number(this.formCompetencia.value["cveLocal"]) !== 0) {
      this.optionsUsuarios = (await lastValueFrom(this.user.selectUsuariosHotel(String(this.myControlUsuarios.value),
      Number(this.formCompetencia.value["cveLocal"])))).container
    }
  }

  remove(competencia: opcion){
    let id : number= this.seleccionadas.indexOf(competencia)
    this.seleccionadasNumber.splice(id, 1)
    this.seleccionadas.splice(id, 1)
  }

  selectedUsuario(e : MatAutocompleteSelectedEvent){
    this.seleccionadasNumber.push((e.option.value as opcion).id)
    this.seleccionadas.push(e.option.value as opcion)
    this.optionsUsuarios = []
    // (e.option.value as opcion).nombre
    this.myControlUsuarios.patchValue(
      ""
    )
  }

  async enviarDatos(){
    if (this.formCompetencia.valid) {

      //En el siguiente bloque se analizan las diferentes secciones para actualizar el evento o competencia
      let actualizar : boolean = false;
      if (this.myControlEventos.value?.toString() !== this.myControlEventosNuevo.value?.toString()) {
        actualizar = true;
      }

      for (const key in this.formCompetencia.value) {
        if (this.formCompetencia.value[key].toString() !== this.formCompetenciaRespaldo.value[key].toString()) {
          actualizar = true;
        }
      }

      if (actualizar) {
        let icom : votaciones = this.formCompetencia.value;
        icom.nombre = this.myControlEventosNuevo.value!.toString();
        icom.idCompetencia = this.eventoSeleccionado.idCompetencia;
        await lastValueFrom(this.ccia.actualizarCompetencia(icom))
      }



      if (this.seleccionadasNumber.toString() !== this.seleccionadasNumberRespaldo.toString()) {

        /**
         * En el primer for es para ver que usuario hay que agregar.
         * En el segundo for, es para ver que usuarios hay que eliminar.
         *
         * En cada for, se recorre un array que "podria" tener diferente longitud.
         *
        */

        for (let x = 0; x < this.seleccionadasNumber.length; x++) {
          //Se comparan los usuarios de respaldo, con los usuarios insertados
          if (this.seleccionadasNumberRespaldo.indexOf(this.seleccionadasNumber[x]) == -1) {
            //En el dado caso, en el que el usuario sea nuevo y no se encuentre en los usuarios de respaldo, este se inserta
            await lastValueFrom(this.ccia.insertarUsuariosCompetencia(this.eventoSeleccionado.idCompetencia, this.seleccionadasNumber[x]))
          }
        }

        for (let x = 0; x < this.seleccionadasNumberRespaldo.length; x++) {
          //Se comparan los usuarios de respaldo, con los usuarios insertados

          if (this.seleccionadasNumber.indexOf(this.seleccionadasNumberRespaldo[x]) == -1) {
            //En el dado caso, en el que el usuario sea nuevo y no se encuentre en los usuarios de respaldo, este se inserta
            await lastValueFrom(this.ccia.eliminarUsuariosCompetencia(this.seleccionadasNumberRespaldo[x], this.eventoSeleccionado.idCompetencia))
          }

          /*
            En el dado caso que no haya usuarios seleccionados, pero inicialmente tuvo usuarios,
            estos se borran de la base de datos
          */
          if (this.seleccionadasNumber.length == 0) {
            await lastValueFrom(this.ccia.eliminarUsuariosCompetencia(this.seleccionadasNumberRespaldo[x], this.eventoSeleccionado.idCompetencia))
          }
        }
      }

      this.ccia.imprimirDatosCompetencia(-1," ").subscribe( async (resp : ResponseInterfaceTs)=>{
        if (resp.status.toString() === '200') {
          this.dialogRef.close(resp.container)
        }else{
          this.dialogRef.close(undefined)
        }
      })
    }
  }

  vaciarAutocomplete(){
    this.optionsUsuarios = []
    this.seleccionadas = []
    this.seleccionadasNumber = []
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
