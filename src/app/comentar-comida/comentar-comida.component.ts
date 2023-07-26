import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ThanksComponent } from './popup/thanks/thanks.component';
import { FoodExtService } from '../core/services_ext/food_ext.service';
import { lastValueFrom, catchError } from 'rxjs';
import { ResponseInterfaceTs } from '../interfaces_modelos/response.interface';
import { MatButton } from '@angular/material/button';

export interface commentarInteface{
  employee_num: number
  rate: number
  suggestion : String
  comment : String
}

@Component({
  selector: 'app-comentar-comida',
  templateUrl: './comentar-comida.component.html',
  styleUrls: ['./comentar-comida.component.css'],
})
export class ComentarComidaComponent {
rating: number = 0;
@Input() maxStars: number = 5;
@Input() selectedStars: number = 3;
@ViewChild('btnEnv') btnEnv! : MatButton;
@Output() ratingSelected: EventEmitter<number> = new EventEmitter<number>();
stars: number[] = [];
screenHeight: number = 0;
screenWidth: number = 0;

formComment : FormGroup = this.fb.group({
  employee_num : ["", Validators.required],
  suggestion : ["", Validators.nullValidator],
  comment : ["", Validators.required],

})


  constructor(
    private fb : FormBuilder,
    public dialog: MatDialog,
    private serviceExt: FoodExtService) {

    this.getScreenSize();
    for (let i = 1; i <= this.maxStars; i++) {
      this.stars.push(i);
    }
  }

  starFilled(star: number): boolean {
    return star <= this.selectedStars;
  }

  rate(star: number): void {
    this.selectedStars = star;
    this.ratingSelected.emit(star);
  }

  async answers()  {
    if (this.formComment.valid) {
    let commentarInteface  : commentarInteface = this.formComment.value;
    commentarInteface.rate = this.selectedStars;
    this.btnEnv!.disabled = true;
    let res: ResponseInterfaceTs = await lastValueFrom(this.serviceExt.postComment(commentarInteface));
     if (res.status === '200') {
      this.btnEnv!.disabled = false;
      this.formComment.reset();
      let dialogRef = this.dialog.open(ThanksComponent, {
        height: '300px',
        width: '280px',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`); // Pizza!
      });
     }else{
      this.btnEnv.disabled = false;
      alert("El empleado no existe");
     }

    }

  }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

  }

}
