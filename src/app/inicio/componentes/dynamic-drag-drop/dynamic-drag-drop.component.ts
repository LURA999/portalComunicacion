import { Component, Input } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { opcionRadioButton } from '../dynamic-radio-group/dynamic-radio-group.component';

@Component({
  selector: 'app-dynamic-drag-drop',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag],
  template: `<div
  cdkDropList
  [cdkDropListData]="opciones"
  class="example-list"
  (cdkDropListDropped)="drop($event)">
  @for (i of opciones; track i) {
    <div class="example-box" cdkDrag>{{i.title}}</div>
  }
  </div>`,
  styles: `
  .example-list {
  border: solid 1px #ccc;
  min-height: 60px;
  background: white;
  border-radius: 4px;
  overflow: hidden;
  display: block;
}

.example-box {
  padding: 10px;
  border-bottom: solid 1px #ccc;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  cursor: move;
  background: white;
}

  `
})
export class DynamicDragDropComponent {
  @Input() opciones: Array<opcionRadioButton> | any = []; //Array que se envia desde el exterior (respaldo del array original)

  constructor(){

  }

  ngOnInit(): void {
    /*
      Si se dan cuenta, en este apartado, yo cree la copia del array "opciones" con la funcion "slice"
      incluso lo declare en una variable const, y todo esto para que no modificara el array principal,
      y se creara un nuevo array como auxiliar
    */
    const opcionesAux =  this.opciones.slice()
    for (let k = 0; k < this.opciones.length; k++) {
      this.opciones[k] = opcionesAux[Number(opcionesAux[k].stateDrag)]
    }
  }

  ngAfterViewInit(): void {

  }

  drop(event: CdkDragDrop<any[]>) {
    /**
     * Este codigo, esta en la documentación oficial de angular, por lo tanto esta funcionalidad
     * es nativa del mismo drag-drop
     */
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

    }
    this.opciones = (event.container.data);
  }
}
