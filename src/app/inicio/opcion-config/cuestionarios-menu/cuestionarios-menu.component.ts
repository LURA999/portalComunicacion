import { Component } from '@angular/core';
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
    // cuest.getTitulos().subscribe((resp: any) => {
    //   console.log(resp);
      
    // })
  }


  ngOnInit() {
    this.loadCuestionarios();
  }

  loadCuestionarios() {
    this.cuest.getCuestionarios().subscribe(
      (data: ResponseInterfaceTs) => {
        this.dataSource = data.container;
      }
    );
  }

  ngAfterContentInit(): void {
    this.DataService.open.emit(this.paramUrl);
  }

  nuevoCuestionario(){
    this.route.navigate(["/general/questionnaires-setting"]);
  }

  mandarCuestionario(id: number){
    this.route.navigate(["/general/questionnaires-modify", id]);
  }

  eliminar(id: number){
    this.cuest.eliminarCuestionario(id).subscribe((resp:ResponseInterfaceTs) =>{
        if(resp.status === "200") {
          this.loadCuestionarios();
        }else{
          alert("Ah occured an error");
        }
    })
  }

  goQuiz(id: number){
    this.route.navigate(["/general/questionnaires/questionnaires-form/", id]);
  }
}