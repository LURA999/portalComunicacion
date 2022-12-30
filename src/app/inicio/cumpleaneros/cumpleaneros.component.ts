import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cumpleaneros',
  templateUrl: './cumpleaneros.component.html',
  styleUrls: ['./cumpleaneros.component.css']
})
export class CumpleanerosComponent implements OnInit {
  link : string =  environment.production === true ? "": "../../../";
  date : Date  = new Date();
  mes : string = ""

  color_primary : string =  "#DC994D";

  constructor() { }

  ngOnInit(): void {
    let opciones : any = { month: 'long', day: 'numeric', year: 'numeric' };
   this.mes = this.date.toLocaleDateString('es',opciones).split(" ")[2].toUpperCase();

  }


}
