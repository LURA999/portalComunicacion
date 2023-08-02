import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription, catchError } from 'rxjs';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { localService } from 'src/app/core/services/local.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { EliminarComponent } from '../../popup/eliminar/eliminar.component';
import { MyCustomPaginatorIntl } from '../../MyCustomPaginatorIntl';
import { AutocapacitacionService } from 'src/app/core/services/autocapacitacion.service';
import { EditarAutocapacComponent } from '../../popup/editar-autocapac/editar-autocapac.component';

export interface local {
  idLocal : number;
  local : string;
}


export interface autocapacitacionInt {
  nombre: string;
  fechaInicial:Date;
  fechaFinal:Date;
  cveLocal: string;
  local:string;
  opciones:boolean;
  idAutoCap: number;
  link:string;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './autocapac-config.component.html',
  styleUrls: ['./autocapac-config.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})
export class AutoCapacConfigComponente implements OnInit {
/**
   * @paramUrl : obtiene el link de la pagina, o mas bien el segmento de la pagina actual, para verifcar si esadmin
   *
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
  ELEMENT_DATA: autocapacitacionInt[] = [ ];
  $sub : Subscription = new Subscription()

  displayedColumns: string[] = [ 'nombre', 'fechaInicial', 'fechaFinal', 'hotel', 'opciones'];
  dataSource = new MatTableDataSource<autocapacitacionInt>(this.ELEMENT_DATA);
  locales : local [] = []
  cargando : boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  formBuscar : FormGroup = this.fb.group({
    seccion : [""],
    buscador : [""],

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
    this.$sub.add(this.autoCap.mostrarTodoAutocapacitacion(0).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:ResponseInterfaceTs)=>{
    if (resp.status === '200') {
      for await (const c of resp.container) {
        this.ELEMENT_DATA.push({
          idAutoCap:c.idAutoCap,
          nombre:c.nombre,
          fechaInicial:c.fechaInicial,
          fechaFinal:c.fechaFinal,
          cveLocal:c.cveLocal,
          local:c.local,
          opciones:false,
          link:c.link
        })
      }
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator;
      }
      this.cargando = true;
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
    private autoCap : AutocapacitacionService){

  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

  agregar(){
    let dialogRef = this.dialog.open(EditarAutocapacComponent, {
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
          this.formBuscar.reset();
          this.formBuscar.patchValue({
            buscador : ""
          })
          this.cargando = false;
          this.ELEMENT_DATA = []
          for await (const c of resp) {
            this.ELEMENT_DATA.push({
              idAutoCap:c.idAutoCap,
              nombre:c.nombre,
              fechaInicial:c.fechaInicial,
              fechaFinal:c.fechaFinal,
              cveLocal:c.cveLocal,
              local:c.local,
              opciones:false,
              link:c.link
            })
          }
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator =  this.paginator;
          this.cargando = true;
        }
      }
    })
  }

  editar(usuario : autocapacitacionInt){
    let dialogRef = this.dialog.open(EditarAutocapacComponent, {
      height: 'auto',
      width: '450px',
      data: usuario
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
            this.ELEMENT_DATA.push({
              idAutoCap:c.idAutoCap,
              nombre:c.nombre,
              fechaInicial:c.fechaInicial,
              fechaFinal:c.fechaFinal,
              cveLocal:c.cveLocal,
              local:c.local,
              opciones:false,
              link:c.link
            })
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
      data: {id: usuario,seccion: "autocapacitacion"}
    });
    dialogRef.afterClosed().pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:ResponseInterfaceTs)=>{
      console.log(Number(resp.status));

      if (Number(resp.status) == 200) {
        if (resp.container.length > 0) {
          this.formBuscar.reset();
          this.formBuscar.patchValue({
            buscador : ""
          })
          this.cargando = false;
          this.ELEMENT_DATA = []
          for await (const c of resp.container) {
            this.ELEMENT_DATA.push({
              idAutoCap:c.idAutoCap,
              nombre:c.nombre,
              fechaInicial:c.fechaInicial,
              fechaFinal:c.fechaFinal,
              cveLocal:c.cveLocal,
              local:c.local,
              opciones:false,
              link:c.link
          })
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

  //envia la peticion y despues guarda el resutado en su respectivo element_Data
  buscador(){
    this.$sub.add(this.autoCap.mostrarAutocapacitacion(this.formBuscar.value["buscador"],this.formBuscar.value["seccion"]==="" ||
    this.formBuscar.value["seccion"]===-1 ?-1:this.formBuscar.value["seccion"]).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe(async (resp:ResponseInterfaceTs)=>{
      if (Number(resp.status) == 200) {
        this.cargando = false;
        this.ELEMENT_DATA = [];
        for await (const c of resp.container) {
          this.ELEMENT_DATA.push({
            idAutoCap:c.idAutoCap,
            nombre:c.nombre,
            fechaInicial:c.fechaInicial,
            fechaFinal:c.fechaFinal,
            cveLocal:c.cveLocal,
            local:c.local,
            opciones:false,
            link:c.link
        })
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

  hayElementos() : boolean{
    if(this.ELEMENT_DATA.length != 0 || this.cargando ===false){
      return true;
    }else{
      return false;
    }
  }

}
