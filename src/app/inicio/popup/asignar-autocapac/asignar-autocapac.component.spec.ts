import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarAutocapacComponent } from './asignar-autocapac.component';

describe('AsignarAutocapacComponent', () => {
  let component: AsignarAutocapacComponent;
  let fixture: ComponentFixture<AsignarAutocapacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarAutocapacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarAutocapacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
