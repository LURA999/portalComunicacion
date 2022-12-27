import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataNavbarService {

  constructor() { }
  @Output() open : EventEmitter<any> = new EventEmitter();

}
