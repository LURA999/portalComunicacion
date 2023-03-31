import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription } from 'rxjs';
import { ComidaService } from 'src/app/core/services/comida.service';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { localService } from 'src/app/core/services/local.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { MyCustomPaginatorIntl } from '../../MyCustomPaginatorIntl';
import { ComidaFormComponent } from '../../popup/editar-comida/comida-form.component';
import { EliminarComponent } from '../../popup/eliminar/eliminar.component';
import { local } from '../usuarios-config/usuarios.component';

export interface comida {
  idMenu:number;
  nombre:string;
  descripcion:string;
  fecha:Date;
  cveLocal: number;
  local:string;
  activo?:number;
}


@Component({
  selector: 'app-menu-config',
  templateUrl: './menu-config.component.html',
  styleUrls: ['./menu-config.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],
})
export class MenuConfigComponent implements OnInit {

  paramUrl : string = this.route.url.split("/")[2];
  ELEMENT_DATA: comida[] = [ ];
  $sub : Subscription = new Subscription()

  displayedColumns: string[] = ['nombre', 'descripcion','fecha', 'hotel', 'opciones'];
  dataSource = new MatTableDataSource<comida>(this.ELEMENT_DATA);
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
      this.locales.shift()
    }))
    this.cargando = false;

    this.comidaService.todoComida(0,1).subscribe(async (resp:ResponseInterfaceTs)=>{
      if (Number(resp.status) == 200) {
      for await (const c of resp.container) {
        this.ELEMENT_DATA.push(c)
      }

      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator;
      }
      this.cargando = true;
    })
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private DataService : DataNavbarService,
    public route : Router,
    private comidaService : ComidaService,
    private dialog : NgDialogAnimationService,
    private loc : localService,
    private fb : FormBuilder){

  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

  agregar(){
    let dialogRef = this.dialog.open(ComidaFormComponent, {
      height: 'auto',
      width: '450px',
      data: undefined
    });
    dialogRef.afterClosed().subscribe(async (resp:any)=>{
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

  editar(com : comida){
    let dialogRef = this.dialog.open(ComidaFormComponent, {
      height: 'auto',
      width: '450px',
      data: com
    });
    dialogRef.afterClosed().subscribe(async (resp:any)=>{
      if (resp !== undefined) {
        this.paginator.firstPage();
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
      data: {id: usuario,seccion: "Comida"}
    });
    dialogRef.afterClosed().subscribe(async (resp:ResponseInterfaceTs)=>{
      console.log(resp);

      if (Number(resp.status) == 200) {
        this.paginator.firstPage();
        if (resp.container.length > 0) {
          this.formBuscar.reset();
          this.cargando = false;
          this.ELEMENT_DATA = []
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          for await (const c of resp.container) {
            this.ELEMENT_DATA.push(c)
          }
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.cargando = true;
        }
      }else{
        this.ELEMENT_DATA = []
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      }
     })
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

  ifSeccion() : number{
    if (Number(this.formBuscar.value["seccion"]) === -1 || this.formBuscar.value["seccion"] === undefined || this.formBuscar.value["seccion"] === '') {
      return 0
    }else{
      return Number(this.formBuscar.value["seccion"])
    }
  }
  buscador(){

    if(this.formBuscar.value["buscador"] === "" || this.formBuscar.value["buscador"] === undefined || this.formBuscar.value["buscador"] === null){
      this.$sub.add(this.comidaService.todoComida(this.ifSeccion(),1).subscribe(async (resp:ResponseInterfaceTs)=>{
        if (Number(resp.status) == 200) {
          this.cargando = false;
          this.ELEMENT_DATA = [];
          for await (const c of resp.container) {
            this.ELEMENT_DATA.push(c);
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
    }else {
      this.$sub.add(this.comidaService.buscarComida(this.ifSeccion(),this.formBuscar.value["buscador"]).subscribe(async (resp:ResponseInterfaceTs)=>{
        if (Number(resp.status) == 200) {
          this.cargando = false;
          this.ELEMENT_DATA = [];
          for await (const c of resp.container) {
            this.ELEMENT_DATA.push(c);
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



  }

  hayElementos() : boolean{
    if(this.ELEMENT_DATA.length != 0 || this.cargando ===false){
      return true;
    }else{
      return false;
    }
  }
}
