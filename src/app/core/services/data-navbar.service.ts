import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'any'
})
export class DataNavbarService {

  constructor() { }
  @Output() open : EventEmitter<any> = new EventEmitter();

}
