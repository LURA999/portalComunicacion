import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMesEmpleadoComponent } from './editar-mes-empleado.component';

describe('EditarMesEmpleadoComponent', () => {
  let component: EditarMesEmpleadoComponent;
  let fixture: ComponentFixture<EditarMesEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarMesEmpleadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarMesEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
