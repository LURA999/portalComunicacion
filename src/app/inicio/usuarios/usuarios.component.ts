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
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import { EliminarComponent } from '../popup/eliminar/eliminar.component';
import { UsuarioFormComponent } from '../popup/usuario-form/usuario-form.component';
import { MyCustomPaginatorIntl } from './../MyCustomPaginatorIntl';

export interface local {
  idLocal : number;
  local : string;
}


export interface usuarios {
  idUsuario : number;
  usuario : number;
  nombres: string;
  apellidoPaterno:string;
  apellidoMaterno: string;
  correo: string;
  local: string;
  cveLocal:string;
  cveRol:string;
  opciones : string;
  contrasena? : string;
  img?: string;
  fechaNacimiento:Date;
  fechaIngreso:Date;
}
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})
export class UsuariosComponent implements OnInit {

  paramUrl : string = this.route.url.split("/")[2];
  ELEMENT_DATA: usuarios[] = [ ];
  $sub : Subscription = new Subscription()

  displayedColumns: string[] = ['no', 'nombre', 'correo', 'hotel', 'opciones'];
  dataSource = new MatTableDataSource<usuarios>(this.ELEMENT_DATA);
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

    this.users.selectAllusers().subscribe(async (resp:ResponseInterfaceTs)=>{
      console.log(resp.container);

      for await (const c of resp.container) {
        this.ELEMENT_DATA.push({idUsuario:Number(c.idUsuario),usuario:c.usuario,nombres:c.nombres,correo:c.correo,local:c.local,cveLocal:c.cveLocal,cveRol: c.cveRol,apellidoMaterno: c.apellidoMaterno, apellidoPaterno:c.apellidoPaterno,fechaNacimiento:c.fechaNacimiento,fechaIngreso:c.fechaIngreso,img:c.img,opciones:""})
      }
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator;
      this.cargando = true;
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
          this.cargando = false;
          this.ELEMENT_DATA = []
          for await (const c of resp) {
            this.ELEMENT_DATA.push({idUsuario:Number(c.idUsuario),usuario:c.usuario,nombres:c.nombres,correo:c.correo,local:c.local,cveLocal:c.cveLocal,cveRol: c.cveRol,apellidoMaterno: c.apellidoMaterno, apellidoPaterno:c.apellidoPaterno,fechaNacimiento:c.fechaNacimiento,fechaIngreso:c.fechaIngreso,img:c.img,opciones:""})
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
          this.cargando = false;
          this.ELEMENT_DATA = []
          for await (const c of resp) {
            this.ELEMENT_DATA.push({idUsuario:Number(c.idUsuario),usuario:c.usuario,nombres:c.nombres,correo:c.correo,local:c.local,cveLocal:c.cveLocal,cveRol: c.cveRol,apellidoMaterno: c.apellidoMaterno, apellidoPaterno:c.apellidoPaterno,fechaNacimiento:c.fechaNacimiento,fechaIngreso:c.fechaIngreso,img:c.img,opciones:""})
          }
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator =  this.paginator;
          this.cargando = true;
        }
      }

     })
  }

  borrar(usuario : number){
    let dialogRef = this.dialog.open(EliminarComponent, {
      height: 'auto',
      width: 'auto',
      data: {id: usuario,seccion: "usuario"}
    });
    dialogRef.afterClosed().subscribe(async (resp:any)=>{
      if (resp !== undefined) {
        if (resp.length > 0) {
          this.formBuscar.reset();
          this.cargando = false;
          this.ELEMENT_DATA = []
          for await (const c of resp) {
            this.ELEMENT_DATA.push({idUsuario:Number(c.idUsuario),usuario:c.usuario,nombres:c.nombres,correo:c.correo,local:c.local,cveLocal:c.cveLocal,cveRol: c.cveRol,apellidoMaterno: c.apellidoMaterno, apellidoPaterno:c.apellidoPaterno,fechaNacimiento:c.fechaNacimiento,fechaIngreso:c.fechaIngreso,img:c.img,opciones:""})
          }
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator =  this.paginator;
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
    this.formBuscar.value["seccion"]===-1 ?-1:this.formBuscar.value["seccion"]).subscribe(async (resp:ResponseInterfaceTs)=>{
      if (Number(resp.status) == 200) {
        this.cargando = false;
        this.ELEMENT_DATA = [];
        for await (const c of resp.container) {
          this.ELEMENT_DATA.push({idUsuario:Number(c.idUsuario),usuario:c.usuario,nombres:c.nombres,correo:c.correo,local:c.local,cveLocal:c.cveLocal,cveRol: c.cveRol,apellidoMaterno: c.apellidoMaterno, apellidoPaterno:c.apellidoPaterno,fechaNacimiento:c.fechaNacimiento,fechaIngreso:c.fechaIngreso,img:c.img,opciones:""})
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
