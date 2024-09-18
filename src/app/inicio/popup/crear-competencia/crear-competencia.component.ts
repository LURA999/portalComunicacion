import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, concatMap, forkJoin, lastValueFrom, Observable, of, Subscription } from 'rxjs';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { localService } from 'src/app/core/services/local.service';
import { locales } from '../editar-slider/editar-slider.component';
import { competencia, VotacionesService } from 'src/app/core/services/votaciones_service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatDialogRef } from '@angular/material/dialog';


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
 options: Array<opcion> = [ ];
 seleccionadas : Array<opcion> = []
 $sub : Subscription = new Subscription()
 localInterfaz : locales[] = []
 cveSeccion: number = 1;
 readonly separatorKeysCodes: number[] = [ENTER, COMMA];

 constructor(
  private fb : FormBuilder,
  private local : localService,
  private user : UsuarioService,
  private ccia : VotacionesService,
  public dialogRef: MatDialogRef<CrearCompetenciaComponent>
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
  }

  remove(competencia: opcion){
    let id : number= this.seleccionadas.indexOf(competencia)
    this.seleccionadas.splice(id, 1)
    this.seleccionadasNumber.splice(id, 1)
  }

  selectedUsuario(e : MatAutocompleteSelectedEvent){
    console.log(this.seleccionadasNumber.indexOf((e.option.value as opcion).id));

    if (this.seleccionadasNumber.indexOf((e.option.value as opcion).id) == -1) {
      this.seleccionadasNumber.push((e.option.value as opcion).id)
      this.seleccionadas.push(e.option.value as opcion)
      this.options = []
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

  async buscarUsuario(){
    if (this.formCompetencia.value["cveLocal"].length !== 0) {
      this.options = (await lastValueFrom(this.user.selectUsuariosHotel(String(this.myControl.value), Number(this.formCompetencia.value["cveLocal"])))).container
    }
  }

  private filterOptions(value: string): Observable<ResponseInterfaceTs> {
    return this.user.selectUsuariosHotel(String(value), Number(this.formCompetencia.value["cveLocal"]))
  }


  enviarDatos(){

    if (this.formCompetencia.valid && this.myControl.valid && this.seleccionadas.length > 0) {
      // let opciones : any = { month: 'short', day: 'numeric', year: 'numeric' };
      let objeto : competencia = this.formCompetencia.value;
      /* let date1 : string [] = new Date((this.formCompetencia.value["fechaFinal"] as Date)+"T00:00:00").toLocaleDateString('es',opciones).split(" ")
      objeto.fechaFinal = date1[0]+" "+date1[1]+", "+date1[2]
      let date2 : string [] = new Date((this.formCompetencia.value["fechaInicial"] as Date)+"T00:00:00").toLocaleDateString('es',opciones).split(" ")
      objeto.fechaInicial = date2[0]+" "+date2[1]+", "+date2[2] */
      this.ccia.insertarCompetencia(objeto).subscribe((resp: ResponseInterfaceTs) => {
        let arrObservable : Observable<ResponseInterfaceTs>[] = []
        for (let h = 0; h < this.seleccionadas.length; h++) {
          arrObservable.push(this.ccia.insertarUsuariosCompetencia(Number(resp.container[0]["ultimoId"]), this.seleccionadas[h].id))
        }
        forkJoin(arrObservable).subscribe(async (resp:Array<ResponseInterfaceTs>) =>{
          let tabla = (await lastValueFrom(  this.ccia.imprimirDatosCompetencia(-1," ")))
          if (tabla.status.toString() === '200') {
            this.dialogRef.close(tabla.container)
          }else{
            this.dialogRef.close(undefined)
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
    this.options = []
    this.seleccionadas = []
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
