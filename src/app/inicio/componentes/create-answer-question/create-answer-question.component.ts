import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dynamic-input',
  template: `
    <div class="row">
      <div class="col-1 text-center">
      <ng-container [ngSwitch]="iconType">
          <i *ngSwitchCase="'Texto'" class="fas fa-align-left	 mt-3"></i>
          <i *ngSwitchCase="'Radio Button'" class="far fa-dot-circle mt-3"></i>
          <i *ngSwitchCase="'Checkbox'" class="fas fa-check-square mt-3"></i>
          <i *ngSwitchCase="'Dragdrop'" class="fas fa-arrows-alt mt-3"></i>
        </ng-container>
      </div> 
      <div class="col-10">
        <mat-form-field [id]="id_option" class="example-full-width">
          <input matInput [placeholder]="placeholder" [(ngModel)]="respuesta">
        </mat-form-field>
      </div>
      <div class="col-1">
        <button *ngIf="canDelete" (click)="eliminarOpcion()" class="btn btn-sm"><i class="fas fa-times"></i></button>
      </div>
    </div>  
  `,
  styles: ['.example-full-width { width: 100%; }']
})
export class CreateAnswerQuestionComponent  {
  placeholder: string = 'Enter value';
  respuesta: string = '';
  id_option: number = 0;
  canDelete: boolean = true; 
  @Output() buttonClicked = new EventEmitter<number>();
  iconType: string = '';

  eliminarOpcion(): void {
    this.buttonClicked.emit(this.id_option); 
  } 
}
