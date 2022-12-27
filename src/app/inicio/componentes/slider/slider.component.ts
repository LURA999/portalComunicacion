import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  constructor(private render2 : Renderer2, private route : Router) { }
  @Input()imageObject :any ;

  ngOnInit(): void {


  }


  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    /*if(this.route.url.split("/")[2] !== "bookings")
    location.reload()*/
  }
}
