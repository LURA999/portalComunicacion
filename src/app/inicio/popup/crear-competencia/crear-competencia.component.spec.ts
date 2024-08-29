import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCompetenciaComponent } from './crear-competencia.component';

describe('EditarCompetenciaComponent', () => {
  let component: EditarCompetenciaComponent;
  let fixture: ComponentFixture<EditarCompetenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarCompetenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
