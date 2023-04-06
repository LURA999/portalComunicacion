import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription,catchError,lastValueFrom } from 'rxjs';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { localService } from 'src/app/core/services/local.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { EliminarComponent } from '../../popup/eliminar/eliminar.component';
import { MyCustomPaginatorIntl } from '../../MyCustomPaginatorIntl';
import { EditarMesEmpleadoComponent } from '../../popup/editar-mes-empleado/editar-mes-empleado.component';
import { EmpleadoMesService } from 'src/app/core/services/empleado-mes.service';
import { formBuscadorUsuario } from '../usuarios-config/usuarios.component';

export interface local {
  idLocal : number;
  local : string;
}


export interface usuariosDelMes {
  idUsuario : number;
  usuario : number;
  nombres: string;
  apellidoPaterno:string;
  apellidoMaterno: string;
  local: string;
  cveLocal:number;
  opciones : string;
  fecha : string;
  fechaInicio : string;
  fechaFinal : string;
  posicion : number;
  contratoNombre: string;
}

export interface fechaCambio {
  idUsuario:number;
  fecha:Date;
  fechaInicio:Date;
  fechaFinal:Date;
  cveLocal:number;
  posicion:number;
  contrato:number;
  total:number;
  arr:number[];
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './empleado-del-mes.component.html',
  styleUrls: ['./empleado-del-mes.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})
export class EmpleadoDelMesComponent implements OnInit {

  paramUrl : string = this.route.url.split("/")[2];
  ELEMENT_DATA: usuariosDelMes[] = [ ];
  $sub : Subscription = new Subscription()
   meses : string []= ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  displayedColumns: string[] = ['no', 'nombre', 'hotel', 'fecha','fechaInicio','fechaFinal','contrato', 'posicion', 'opciones'];
  dataSource = new MatTableDataSource<usuariosDelMes>(this.ELEMENT_DATA);
  locales : local [] = []
  cargando : boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  formBuscar : FormGroup = this.fb.group<formBuscadorUsuario>({
    seccion : "",
    buscador : "",

  })

  ngOnInit(): void {
    this.$sub.add(this.loc.todoLocal(-1).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe( async (resp:ResponseInterfaceTs) =>{
      for await (const i of resp.container) {
        this.locales.push({idLocal:i.idLocal, local:i.nombre})
      }
    }))
    this.cargando = false;

    this.$sub.add(this.usService.selectAllusers(2).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:ResponseInterfaceTs)=>{
      if (resp.status.toString() === '200') {
      for await (const c of resp.container) {
        this.ELEMENT_DATA.push( c )
      }
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator;
      this.cargando = true;
    }
    }))
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private DataService : DataNavbarService,
    public route : Router,
    private dialog : NgDialogAnimationService,
    private loc : localService,
    private fb : FormBuilder,
    private usService : UsuarioService,
    private mesService : EmpleadoMesService){

  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

  async editar_agregar(usuario : usuariosDelMes){
    let dialogRef : any;

    if (usuario.fecha === null) {
      let arr :number[] = (await lastValueFrom(this.mesService.totalEmpleado(Number(usuario.cveLocal)))).container;
       dialogRef = this.dialog.open(EditarMesEmpleadoComponent, {
        height: 'auto',
        width: '450px',
        data: {idUsuario : usuario.idUsuario, cveLocal: usuario.cveLocal, posicion: usuario.posicion, total: arr.length, arr : arr }
      });
    } else {

      dialogRef = this.dialog.open(EditarMesEmpleadoComponent, {
        height: 'auto',
        width: '450px',
        data: usuario
      });
    }

    dialogRef.afterClosed().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:any)=>{
      if (resp !== undefined) {
        if (resp.length > 0) {
          this.formBuscar.reset();
          this.formBuscar.patchValue({
            buscador : ""
          })
          this.cargando = false;
          this.ELEMENT_DATA = []
          for await (const c of resp) {
            this.ELEMENT_DATA.push( c )
          }
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator =  this.paginator;
          this.cargando = true;
        }
      }

     })
  }
  obtenerMes(mes : number) : string{
    return this.meses[mes-1]
  }
  borrar(usuario : usuariosDelMes){
    let dialogRef = this.dialog.open(EliminarComponent, {
      height: 'auto',
      width: 'auto',
      data: {obj: usuario,seccion: "fecha"}
    });
    dialogRef.afterClosed().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:any)=>{
      if (resp !== undefined) {
        if (resp.length > 0) {
          this.formBuscar.reset();
          this.formBuscar.patchValue({
            buscador : ""
          })
          this.cargando = false;
          this.ELEMENT_DATA = []
          for await (const c of resp) {
            this.ELEMENT_DATA.push( c )
          }
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.cargando = true;
        }
      }
     })
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

  buscador(){
    this.$sub.add(this.usService.selectUser(this.formBuscar.value,2).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:ResponseInterfaceTs)=>{
      if (Number(resp.status) == 200) {
        this.cargando = false;
        this.ELEMENT_DATA = [];
        for await (const c of resp.container) {
          this.ELEMENT_DATA.push( c )
        }
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator =  this.paginator;
        this.dataSource.paginator =  this.paginator;
        this.dataSource.paginator.firstPage();
        this.cargando = true;
      }else{
        this.ELEMENT_DATA = [];
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator =  this.paginator;
        this.dataSource.paginator.firstPage();
      }
    }))
  }

  hayElementos() : boolean{
    if(this.ELEMENT_DATA.length != 0 || this.cargando ===false){
      return true;
    }else{
      return false;
    }
  }

}
