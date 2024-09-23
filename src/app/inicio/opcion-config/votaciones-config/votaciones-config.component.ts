import { Component, ViewChild } from '@angular/core';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { Router } from '@angular/router';
import { locales } from '../noticia-config/noticia.component';
import { localService } from 'src/app/core/services/local.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { catchError, concatMap, lastValueFrom, of, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { local } from '../usuarios-config/usuarios.component';
import { CrearCompetenciaComponent } from '../../popup/crear-competencia/crear-competencia.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { MatPaginator } from '@angular/material/paginator';
import { VotacionesService } from 'src/app/core/services/votaciones_service';
import { EditarVotarCompetenciaComponent } from '../../popup/editar-votar-competencia/editar-votar-competencia.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { format } from 'date-fns';
import { EliminarCompetenciaComponent } from '../../popup/eliminar-competencia/eliminar-competencia.component';
import { CrearEquipoCompetenciaComponent } from '../../popup/crear-equipo-competencia/crear-equipo-competencia.component';
import { votacionesEquipoService } from 'src/app/core/services/votaciones_equipo.service';
import { EliminarEquipoCompetenciaComponent } from '../../popup/eliminar-equipo-competencia/eliminar-equipo-competencia.component';

export interface votaciones {
  cveLocal : number;
  fecha_final : Date;
  fecha_inicial : Date;
  hotel : string;
  idCompetencia : number;
  nombre : string;
  activar : boolean;
}

export interface DatosGeneralExcel{
  cveCompetencia : number;
  cveUsuario : number;
  cveUsuario_competidor : number;
  fecha : Date;
  idVotacion : number;
  nombre : string
  nombre_comp : string
}

export interface VotosExcel{
  cveCompetencia : number;
  cveUsuario_competidor : number;
  nombre_comp : string;
  votos : number;
}

@Component({
  selector: 'app-votaciones',
  templateUrl: './votaciones-config.component.html',
  styleUrls: ['./votaciones-config.component.css']
})
export class VotacionesConfigComponent {
  $sub : Subscription = new Subscription()
  localInterfaz : locales[] = []
  ELEMENT_DATA: votaciones[] = [];
  formBuscar : FormGroup = this.fb.group<any>({
    seccion : "",
    buscador : ""
  })
  locales : local [] = [];
  cargando : boolean = false;
  displayedColumns: string[] = ['nombre', 'fecha_inicial', 'fecha_final', 'hotel', 'opciones', 'opciones2'];
  paramUrl : string = this.route.url.split("/")[2];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  excelDatosGenerales : DatosGeneralExcel[] = []
  votosExcel : VotosExcel[] = []

  constructor(
    public route : Router,
    private DataService : DataNavbarService,
    private local : localService,
    private fb : FormBuilder,
    private loc : localService,
    private ccia : VotacionesService,
    private dialog : NgDialogAnimationService,
    private ceService : votacionesEquipoService
  ){

    this.$sub.add(this.loc.todoLocal(-1).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe( async (resp:ResponseInterfaceTs) =>{
      for await (const i of resp.container) {
        this.locales.push({idLocal:i.idLocal, local:i.nombre})
      }
    }))
  //subscribe
  this.$sub.add(this.local.todoLocal(2).pipe(
    catchError( _ => {
      throw "Error in source."
  })
  ).subscribe(async (resp:ResponseInterfaceTs)=>{
      for await (const i of resp.container) {
        this.localInterfaz.push({
          idLocal : i.idLocal,
          local : i.nombre,
          cantidad : i.cantidad
        })
      }
  }))

  }

  ngOnInit(): void {
   this.rellenarTabla();
  }

  async clear(){
    this.formBuscar.reset();
  }

  buscador() {
     this.ccia.imprimirDatosCompetencia(this.formBuscar.value["seccion"], this.formBuscar.value["buscador"])
    .subscribe( async(resp : ResponseInterfaceTs)=>{
      this.ELEMENT_DATA = [];
      if (resp.status.toString() === '200') {
        this.cargando = false;
        for await (const c of resp.container) {
          this.ELEMENT_DATA.push( c )
        }
      }
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator;
      this.cargando = true;
    })

  }

  rellenarTabla(){

    this.ccia.imprimirDatosCompetencia(-1," ").subscribe( async (resp : ResponseInterfaceTs)=>{
      this.ELEMENT_DATA = []
      if (resp.status.toString() === '200') {
        for await (const c of resp.container) {
          this.ELEMENT_DATA.push( c )
        }

        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator =  this.paginator;
        this.cargando = true;
      }else{
        this.cargando = true;
      }

    })
  }

  agregar(){
    let dialogRef = this.dialog.open(CrearCompetenciaComponent, {
      height: 'auto',
      width: '700px',
      data: undefined
    });
    dialogRef.afterClosed().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:any)=>{
      if (resp !== undefined) {
        if (resp.length > 0) {
          this.paginator.firstPage();
          this.formBuscar.reset();
          this.cargando = false;
          this.ELEMENT_DATA = []
          for await (const c of resp) {
            this.ELEMENT_DATA.push(c)
          }
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator =  this.paginator;
          this.cargando = true;
        }
      }
    })
  }

  hayElementos() : boolean{
    if(this.ELEMENT_DATA.length != 0 || this.cargando ===false){
      return true;
    }else{
      return false;
    }
  }

  async exportar(obj : votaciones){


    this.ccia.imprimirDatosGeneralExcel(obj.idCompetencia).pipe(
      concatMap((resp1: ResponseInterfaceTs) =>{
        if (resp1.status === '200') {
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet(obj.nombre);
        this.excelDatosGenerales.push(resp1.container)
        return this.ccia.imprimirVotosExcel(obj.idCompetencia).pipe(
          concatMap((resp2:ResponseInterfaceTs) =>{
            const today = new Date();
            const formattedDate = format(today, 'MM-dd-yyyy');
            this.excelDatosGenerales = resp1.container;
            this.votosExcel = resp2.container;

            let filasDatosGenerales : (string|number|Date)[][] = []
            let filaVotosExcel : (string|number)[][] = []

            worksheet.addRow([obj.nombre]);
            worksheet.getCell('A1').font = { bold: true };
            worksheet.addRow([,,,,,,,,formattedDate])

            for (let y = 0; y < this.excelDatosGenerales.length; y++) {
              filasDatosGenerales.push([
                this.excelDatosGenerales[y].cveUsuario,
                this.excelDatosGenerales[y].nombre,
                this.excelDatosGenerales[y].nombre_comp,
                this.excelDatosGenerales[y].fecha
              ]);
            }

            worksheet.addTable({
              name: 'MyTable',
              ref: "A3:D"+this.excelDatosGenerales.length,
              headerRow: true,
              totalsRow: false,
              style: {
                theme: 'TableStyleMedium9',
                showFirstColumn: false,
                showLastColumn: false,
                showRowStripes: true,
                showColumnStripes: true
              },
              columns: [
                { name: 'Num. de empleado' },
                { name: 'Nombre del votante' },
                { name: 'Competidor votado' },
                { name: 'Capturado' }
              ],
              rows:  filasDatosGenerales
            });


            for (let y = 0; y < this.votosExcel.length; y++) {
              filaVotosExcel.push([
                this.votosExcel[y].cveUsuario_competidor,
                this.votosExcel[y].nombre_comp,
                this.votosExcel[y].votos
              ]);
            }
            //SEGUNDA TABLA
            worksheet.addTable({
              name: 'MyTable2',
              ref: 'F3:H'+(this.votosExcel.length),
              headerRow: true,
              totalsRow: false,
              style: {
                theme: 'TableStyleMedium9',
                showFirstColumn: false,
                showLastColumn: false,
                showRowStripes: true,
                showColumnStripes: true
              },
              columns: [
                { name: 'Numero de empleado'},
                { name: 'Nombre del competidor' },
                { name: 'votos' }
              ],
              rows: filaVotosExcel
            });

            //ajustando columnas

            worksheet.columns.forEach((column :any) => {
              let maxLength = 10; // establecer una longitud mínima
              column.eachCell({ includeEmpty: true }, (cell :any, rowNumber:any) => {
                const cellLength = cell.value ? cell.value.toString().length : 0;
                if (cellLength > maxLength) {
                  maxLength = cellLength;
                }
              });
              column.width = maxLength + 2; // Agregar algo de margen extra
            });
            workbook.xlsx.writeBuffer().then((data : any) => {
              let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              fs.saveAs(blob, obj.nombre+'-'+new Date().valueOf()+'.xlsx');
            });

          return of("");
        })
        )

      }else{
        alert("No hay votos registrados");
        //Este else es para omitir una llamada de datos, cuando no se tienen votos registrados.
        return of("");
      }
      })
    ).subscribe();

  }

  async eliminarCompetencia(){
    let dialogRef = this.dialog.open(EliminarCompetenciaComponent, {
      height: 'auto',
      width: '700px',
      data: undefined
    });
    dialogRef.afterClosed().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:any)=>{
      if (resp !== undefined) {
        if (resp.length > 0) {
          this.paginator.firstPage();
          this.formBuscar.reset();
          this.cargando = false;
          this.ELEMENT_DATA = []
          for await (const c of resp) {
            this.ELEMENT_DATA.push(c)
          }
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator =  this.paginator;
          this.cargando = true;
        }
      }
    })
  }

  async activar(l : number, c : number, a : number){
    await lastValueFrom(this.ccia.actualizarActividad(l, c, a))

    this.rellenarTabla();
  }

  crearEquipo(){
    let dialogRef = this.dialog.open(CrearEquipoCompetenciaComponent, {
      height: 'auto',
      width: '700px',
      data: false
    });
    dialogRef.afterClosed().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:any)=>{

    })

  }

  modificarCompentencia(){
    let dialogRef = this.dialog.open(EditarVotarCompetenciaComponent, {
      height: 'auto',
      width: '700px',
      data: undefined
    });
    dialogRef.afterClosed().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:any)=>{
      if (resp !== undefined) {
        if (resp.length > 0) {
          this.paginator.firstPage();
          this.formBuscar.reset();
          this.cargando = false;
          this.ELEMENT_DATA = []
          for await (const c of resp) {
            this.ELEMENT_DATA.push(c)
          }
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator =  this.paginator;
          this.cargando = true;
        }
      }
    })
  }

  eliminarEquipo(){
    let dialogRef = this.dialog.open(EliminarEquipoCompetenciaComponent, {
      height: 'auto',
      width: '700px',
      data: undefined
    });
    dialogRef.afterClosed().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:Array<votaciones>)=>{

    })
    /* this.ceService.eliminarEquipo().subscribe((resp: ResponseInterfaceTs)=>{

    }) */
  }

  modificarEquipo(){
    let dialogRef = this.dialog.open(CrearEquipoCompetenciaComponent, {
      height: 'auto',
      width: '700px',
      data: true
    });
    dialogRef.afterClosed().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:Array<votaciones>)=>{
      if (resp.length > 0) {
        this.rellenarTabla()
      }

    })

    /* this.ceService.eliminarImg().subscribe((resp: ResponseInterfaceTs)=>{

    }) */
  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

}
