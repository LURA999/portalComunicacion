import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
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
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { format } from 'date-fns';
import { EditarDepartamentoComponent } from '../../popup/editar-departamento/editar-departamento.component';
import { EliminarDepartamentoComponent } from '../../popup/eliminar-departamento/eliminar-departamento.component';
import { AgregarDepartamentoComponent } from '../../popup/agregar-departamento/agregar-departamento.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepickerIntl } from '@angular/material/datepicker';

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
  departamento: number;
  contrato : number;
  fecha : number;
  aniversario : number;
  cumple : number;
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
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl },
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    provideMomentDateAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");

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

  private readonly _adapter =
  inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private readonly _intl = inject(MatDatepickerIntl);
  private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));
  readonly dateFormatString = computed(() => {
     if (this._locale() === 'es-MX') {
      return 'DD/MM/YYYY';
    }
    return '';
  });

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
      console.log(resp);

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


  async exportar(){
    if (this.ELEMENT_DATA.length > 0) {
      const today = new Date();
    const formattedDate = format(today, 'MM-dd-yyyy');

    this.contenedor_carga.style.display = "block";
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Employee Data");
    worksheet.addRow(['', '', '', '', 'Fecha:', formattedDate]);
    worksheet.addRow(['', '', '', '', '']);
    let header : string[]= ['No.', 'Nombre completo', 'Correo', 'Hotel', 'Visita', 'Departamento'];
    worksheet.addRow(header);

    for  (let x1=0; x1<this.ELEMENT_DATA.length; x1++ ) {
      let temp : any=[]
        temp.push(this.ELEMENT_DATA[x1].usuario)
        temp.push(this.ELEMENT_DATA[x1].apellidoPaterno+" "+this.ELEMENT_DATA[x1].apellidoMaterno+", "+this.ELEMENT_DATA[x1].nombres)
        temp.push(this.ELEMENT_DATA[x1].correo)
        temp.push(this.ELEMENT_DATA[x1].local)
        temp.push(this.ELEMENT_DATA[x1].fecha)
        temp.push(this.ELEMENT_DATA[x1].departamento)
        worksheet.addRow(temp)
    }
    // Aplicar estilos para la palabra "Fecha" (celda A1)
    worksheet.getCell('E1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E1').font = { bold: true };

    worksheet.getCell('A3').font = { bold: true };
    worksheet.getCell('B3').font = { bold: true };
    worksheet.getCell('C3').font = { bold: true };
    worksheet.getCell('D3').font = { bold: true };
    worksheet.getCell('E3').font = { bold: true };
    worksheet.getCell('F3').font = { bold: true };

    //establecer medidas manualmente
    /* worksheet.columns.forEach((column) => {
      column.eachCell!({ includeEmpty: true }, (cell) => {
        const desiredWidth = 30; // Tamaño deseado para la columna (puedes ajustarlo según tus necesidades)
        const cellWidth = (cell.value && cell.value.toString().length) || 10; // Ancho actual de la celda (con un valor predeterminado de 10)
        column.width = Math.max(desiredWidth, cellWidth);
      });
    }); */

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell!({ includeEmpty: true }, (cell) => {
        const cellValue = cell.text || '';
        const cellLength = cellValue.length;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });
      column.width = maxLength + 2; // Agregar un poco de espacio adicional para mejorar la visualización
    });
    let fname="ExcelEmpleados"

    workbook.xlsx.writeBuffer().then((data : any) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
    });
    this.contenedor_carga.style.display = "none";

    }else{
      alert("No hay empleados en la tabla");
    }

  }

  agregarDepartamento(){
    this.dialog.open(AgregarDepartamentoComponent, {
      height: 'auto',
      width: '450px',
      data: undefined
    });
  }

  eliminarDepartamento(){
    this.dialog.open(EliminarDepartamentoComponent, {
      height: 'auto',
      width: '450px',
      data: undefined
    });
  }

  modificarDepartamento(){
    this.dialog.open(EditarDepartamentoComponent, {
      height: 'auto',
      width: '450px',
      data: undefined
    });
  }


  updateCloseButtonLabel(label: string) {
    this._intl.closeCalendarLabel = label;
    this._intl.changes.next();
  }
}
