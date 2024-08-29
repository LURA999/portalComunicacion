import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarCompetenciaSeguridadComponent } from './eliminar-competencia-seguridad.component';

describe('EliminarCompetenciaSeguridadComponent', () => {
  let component: EliminarCompetenciaSeguridadComponent;
  let fixture: ComponentFixture<EliminarCompetenciaSeguridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarCompetenciaSeguridadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarCompetenciaSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
