import { Component, ViewChild } from '@angular/core';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { Router } from '@angular/router';
import { locales } from '../noticia-config/noticia.component';
import { localService } from 'src/app/core/services/local.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { catchError, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { local } from '../usuarios-config/usuarios.component';
import { EditarCompetenciaComponent } from '../../popup/editar-competencia/editar-competencia.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-votaciones',
  templateUrl: './votaciones-config.component.html',
  styleUrls: ['./votaciones-config.component.css']
})
export class VotacionesConfigComponent {
  $sub : Subscription = new Subscription()
  localInterfaz : locales[] = []
  ELEMENT_DATA: any[] = [ ];
  formBuscar : FormGroup = this.fb.group<any>({
    seccion : "",
    buscador : ""
  })
  locales : local [] = [];
  cargando : boolean = false;
  displayedColumns: string[] = ['nombre', 'fecha_inicial', 'fecha_final', 'hotel', 'opciones'];
  paramUrl : string = this.route.url.split("/")[2];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public route : Router,
    private DataService : DataNavbarService,
    private local : localService,
    private fb : FormBuilder,
    private loc : localService,
    private dialog : NgDialogAnimationService,
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
    this.cargando = false;
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

  async clear(){
    this.formBuscar.reset();
  }

  buscador(){


  }

  agregar(){
    let dialogRef = this.dialog.open(EditarCompetenciaComponent, {
      height: 'auto',
      width: '450px',
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

  async exportar(){


  }


  agregarDepartamento(){

  }

  eliminarDepartamento(){

  }

  modificarCompentencia(){
    let dialogRef = this.dialog.open(EditarCompetenciaComponent, {
      height: 'auto',
      width: '450px',
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

  editar(){

  }

  borrar(){

  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

}
