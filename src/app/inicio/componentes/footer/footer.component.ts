import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  /**
   * @link : variable que ayuda a poder ubicar el recurso que es en una carpeta interna del proyecto
   */
  link : string =  environment.production === true ? "": "../../";

  constructor() { }

  ngOnInit(): void {
  }

  abrirPagina(str:string){
    window.open(str, "_blank");
  }
}
