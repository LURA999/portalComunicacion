import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ButtonType } from '@coreui/angular';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription } from 'rxjs';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { localService } from 'src/app/core/services/local.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { EliminarComponent } from '../../popup/eliminar/eliminar.component';
import { UsuarioFormComponent } from '../../popup/editar-usuario/usuario-form.component';
import { MyCustomPaginatorIntl } from '../../MyCustomPaginatorIntl';
import { EditarMesEmpleadoComponent } from '../../popup/editar-mes-empleado/editar-mes-empleado.component';

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
  cveLocal:string;
  opciones : string;
  fecha : string;
  posicion : number;
}

export interface fechaCambio {
  idUsuario:number;
  fecha:Date;
  cveLocal:number;
  posicion:number;
  contrato:number;
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

  displayedColumns: string[] = ['no', 'nombre', 'hotel', 'fecha','contrato', 'posicion', 'opciones'];
  dataSource = new MatTableDataSource<usuariosDelMes>(this.ELEMENT_DATA);
  locales : local [] = []
  cargando : boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  formBuscar : FormGroup = this.fb.group({
    seccion : ["", Validators.required],
    buscador : ["", Validators.required],

  })

  ngOnInit(): void {
    this.$sub.add(this.loc.todoLocal(-1).subscribe( async (resp:ResponseInterfaceTs) =>{
      for await (const i of resp.container) {
        this.locales.push({idLocal:i.idLocal, local:i.nombre})
      }
    }))
    this.cargando = false;

    this.users.selectAllusers(2).subscribe(async (resp:ResponseInterfaceTs)=>{
      console.log(resp.container);

      if (resp.status.toString() === '200') {
      for await (const c of resp.container) {
        this.ELEMENT_DATA.push( c )
      }
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator;
      this.cargando = true;
    }
    })
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private DataService : DataNavbarService,
    public route : Router,
    private users : UsuarioService,
    private dialog : NgDialogAnimationService,
    private loc : localService,
    private fb : FormBuilder,
    private usService : UsuarioService){

  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

  editar_agregar(usuario : usuariosDelMes){
    let dialogRef : any;
    if (usuario.fecha === null) {
       dialogRef = this.dialog.open(EditarMesEmpleadoComponent, {
        height: 'auto',
        width: '450px',
        data: {idUsuario : usuario.idUsuario}
      });
    } else {
      dialogRef = this.dialog.open(EditarMesEmpleadoComponent, {
        height: 'auto',
        width: '450px',
        data: usuario
      });
    }

    dialogRef.afterClosed().subscribe(async (resp:any)=>{
      if (resp !== undefined) {
        if (resp.length > 0) {
          this.formBuscar.reset();
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

  borrar(usuario : string){
    let dialogRef = this.dialog.open(EliminarComponent, {
      height: 'auto',
      width: 'auto',
      data: {id: usuario,seccion: "fecha"}
    });
    dialogRef.afterClosed().subscribe(async (resp:any)=>{
      if (resp !== undefined) {
        if (resp.length > 0) {
          this.formBuscar.reset();
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
    this.$sub.add(this.usService.selectUser(this.formBuscar.value["buscador"],this.formBuscar.value["seccion"]==="" ||
    this.formBuscar.value["seccion"]===-1 ?-1:this.formBuscar.value["seccion"],2).subscribe(async (resp:ResponseInterfaceTs)=>{
      if (Number(resp.status) == 200) {
        this.cargando = false;
        this.ELEMENT_DATA = [];
        for await (const c of resp.container) {
          this.ELEMENT_DATA.push( c )
        }
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator =  this.paginator;
        this.cargando = true;
      }else{
        this.ELEMENT_DATA = [];
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
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
