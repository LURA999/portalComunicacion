import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';
import { Router } from '@angular/router';
import { CuestionariosService } from 'src/app/core/services/cuestionarios.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';

export interface Cuestionario {
  idFormulario: number;
  titulo: string;
  idLocal: number;
  hotel: string;
}

@Component({
  selector: 'app-cuestionarios-menu',
  templateUrl: './cuestionarios-menu.component.html',
    styleUrl: './cuestionarios-menu.component.css'
})
export class CuestionariosMenuComponent  {
  paramUrl : string = this.route.url.split("/")[2];

  dataSource : Cuestionario[] = [];

  constructor(private DataService : DataNavbarService,public route : Router,private cuest : CuestionariosService){

  }

  
  ngOnInit() {
    this.loadCuestionarios();
  }

  loadCuestionarios() {
    this.cuest.getCuestionarios().subscribe(
      (data: ResponseInterfaceTs) => {
        this.dataSource = data.container;
        console.log(data.container);
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

  nuevoCuestionario(){
    this.route.navigate(["/general/cuestionarios-config"]);
  }
  mandarCuestionario(id: number){
    this.route.navigate(["/general/cuestionarios-modificar", id]);
  }
}
