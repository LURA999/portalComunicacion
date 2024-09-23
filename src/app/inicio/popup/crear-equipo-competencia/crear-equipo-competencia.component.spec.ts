import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEquipoCompetenciaComponent } from './crear-equipo-competencia.component';

describe('CrearEquipoCompetenciaComponent', () => {
  let component: CrearEquipoCompetenciaComponent;
  let fixture: ComponentFixture<CrearEquipoCompetenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEquipoCompetenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEquipoCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
