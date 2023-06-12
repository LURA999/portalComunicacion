import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription, catchError } from 'rxjs';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { localService } from 'src/app/core/services/local.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { EliminarComponent } from '../../popup/eliminar/eliminar.component';
import { UsuarioFormComponent } from '../../popup/editar-usuario/usuario-form.component';
import { MyCustomPaginatorIntl } from '../../MyCustomPaginatorIntl';

export interface local {
  idLocal : Number;
  local : string;
}


export interface usuarios {
  usuario : number;
  nombres: string;
  apellidoPaterno:string;
  idUsuario: number;
  apellidoMaterno: string;
  correo: string;
  local: string;
  cveLocal:string;
  usuarion:number;
  cveRol:string;
  opciones : string;
  contrasena? : string;
  img?: string;
  imgn? : string;
  fechaNacimiento:Date;
  fechaIngreso:Date;
  departamento: string;
  contrato : number;
  fecha : number;
}

export interface formBuscadorUsuario {
  seccion : number | string;
  buscador : string;
  tipoVisita? : number;
  fechaInicial? : Date | string;
  fechaFinal? : Date | string;

}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})
export class UsuariosComponent implements OnInit {

  /**
   * @paramUrl : obtiene el link de la pagina, o mas bien el segmento de la pagina actual
   *  @ELEMENT_DATA : almacena el array que se utilizara para la atabla
   *  @displayedColumns : se define las columnas que se usan en la tabla
   *  @dataSource : variable importante que ayuda a imprimir el array element_Data en la tabla
   *  @locales : array que llama a llamar todos los locales del araiza
   *  @paginator : variable ayudante para realizar cualquier cambio que este relacionado con el contenido
   *  de la tabla
   *  @cargando : variable que ayuda a finalizar e iniciar un "loading".
   *  @$sub : variable que almacena los observables para despues liberarlos al terminar la pagina
   *  @formBuscar : en esta variable se asignan todas las variables que deben de existir en el formulario
  */

  paramUrl : string = this.route.url.split("/")[2];
  ELEMENT_DATA: usuarios[] = [ ];
  $sub : Subscription = new Subscription()

  displayedColumns: string[] = ['no', 'nombre', 'correo', 'hotel', 'visita', 'opciones'];
  dataSource = new MatTableDataSource<usuarios>(this.ELEMENT_DATA);
  locales : local [] = []
  cargando : boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  formBuscar : FormGroup = this.fb.group<formBuscadorUsuario>({
    seccion : "",
    buscador : "",
    fechaInicial : "",
    fechaFinal : "",
    tipoVisita : -1
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

    this.$sub.add(this.users.selectAllusers(1).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:ResponseInterfaceTs)=>{
      for await (const c of resp.container) {
        this.ELEMENT_DATA.push( c )
      }
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator;
      this.cargando = true;
    }))
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

  agregar(){
    let dialogRef = this.dialog.open(UsuarioFormComponent, {
      height: 'auto',
      width: '450px',
      data: undefined
    });
    dialogRef.afterClosed().subscribe(async (resp:any)=>{
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

  editar(usuario : usuarios){
    let dialogRef = this.dialog.open(UsuarioFormComponent, {
      height: 'auto',
      width: '450px',
      data: usuario
    });
    dialogRef.afterClosed().subscribe(async (resp:any)=>{
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

  borrar(idUsuario : string, img : string){
    let dialogRef = this.dialog.open(EliminarComponent, {
      height: 'auto',
      width: 'auto',
      data: {id: idUsuario, img: img,seccion: "usuario"}
    });
    dialogRef.afterClosed().subscribe(async (resp:any)=>{
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

    this.$sub.add(this.usService.selectUser(this.formBuscar.value,1).pipe(
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

  async clear(){
    this.formBuscar.reset();
  }

  hayElementos() : boolean{
    if(this.ELEMENT_DATA.length != 0 || this.cargando ===false){
      return true;
    }else{
      return false;
    }
  }

}
