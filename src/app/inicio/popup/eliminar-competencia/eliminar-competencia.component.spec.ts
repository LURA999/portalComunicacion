import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarCompetenciaComponent } from './eliminar-competencia.component';

describe('EliminarCompetenciaComponent', () => {
  let component: EliminarCompetenciaComponent;
  let fixture: ComponentFixture<EliminarCompetenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarCompetenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
