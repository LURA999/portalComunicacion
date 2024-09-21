import { Component,EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'create-answer-question',
  template: `
    <div class="row">
  <div class="col-1 text-center" >

    <input *ngIf="valorSelect == 2"
          class="form-check-input"
          [id]="'radioButton' + id_option"
          type="radio"
          (change)="onCheckboxChange($event)"
          name="valorRadio" />
    

    <input *ngIf="valorSelect == 3"
          class="form-check-input"
          [id]="'checkBox' + id_option"
          type="checkbox"
          (change)="onRadioChange($event)"
          name="valorCheckbox" />
    

  </div>

  <div class="col-1 text-center">
    <ng-container [ngSwitch]="iconType">
      <i *ngSwitchCase="'Texto'" class="fas fa-align-left mt-3"></i>
      <i *ngSwitchCase="'Radio Button'" class="far fa-dot-circle mt-3"></i>
      <i *ngSwitchCase="'Checkbox'" class="fas fa-check-square mt-3"></i>
      <i *ngSwitchCase="'Dragdrop'" class="fas fa-arrows-alt mt-3"></i>
    </ng-container>
  </div>
  
  <div class="col-9">
    <mat-form-field class="example-full-width">
      <input matInput [placeholder]="placeholder" [(ngModel)]="respuesta">
    </mat-form-field>
  </div>
  
  <div class="col-1">
    <button *ngIf="canDelete" (click)="eliminarOpcion()" class="btn btn-sm">
      <i class="fas fa-times"></i>
    </button>
  </div>
</div>

  `,
  styles: ['.example-full-width { width: 100%; }']
})
export class CreateAnswerQuestionComponent  {
  @Input() placeholder: string = 'Enter value';
  @Input() respuesta: string = '';
  @Input() valorSelect: number = 0;
  @Input()id_option: number = 0;
  @Input()canDelete: boolean = true; 
  actualizar : number = 0;
  @Output() buttonClicked = new EventEmitter<number>();
  @Output() selectionChanged = new EventEmitter<{ id: number, type: string, selected: boolean }>();
  iconType: string = '';

  constructor(){}

  onCheckboxChange(event: Event) {
    this.selectionChanged.emit({ id: this.id_option, type: 'radio', selected: true });
  }

  onRadioChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    this.selectionChanged.emit({ id: this.id_option, type: 'checkbox', selected: isChecked });
  
  }

  eliminarOpcion(): void {
    
    this.buttonClicked.emit(this.id_option); 

  } 
}
