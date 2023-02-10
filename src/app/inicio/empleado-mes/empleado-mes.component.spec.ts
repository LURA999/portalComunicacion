import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoMesComponent } from './empleado-mes.component';

describe('EmpleadoMesComponent', () => {
  let component: EmpleadoMesComponent;
  let fixture: ComponentFixture<EmpleadoMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadoMesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpleadoMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
