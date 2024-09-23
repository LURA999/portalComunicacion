import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarEquipoCompetenciaComponent } from './eliminar-equipo-competencia.component';

describe('EliminarEquipoCompetenciaComponent', () => {
  let component: EliminarEquipoCompetenciaComponent;
  let fixture: ComponentFixture<EliminarEquipoCompetenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarEquipoCompetenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarEquipoCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
