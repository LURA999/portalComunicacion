import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ButtonType } from '@coreui/angular';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
export interface usuarios {
  nombre: string;
  no: number;
  correo: string;
  hotel: string;
  opciones : string
}
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  paramUrl : string = this.route.url.split("/")[2];
  ELEMENT_DATA: usuarios[] = [
    {no: 0, nombre: '', correo: '', hotel: '', opciones: ''},
  ];

  displayedColumns: string[] = ['no', 'nombre', 'correo', 'hotel', 'opciones'];
  dataSource = new MatTableDataSource<usuarios>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.users.selectAllusers().subscribe((resp:ResponseInterfaceTs)=>{

    })
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private DataService : DataNavbarService,
    public route : Router,
    private users : UsuarioService){

  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

}
