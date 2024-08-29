import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarVotarCompetenciaComponent } from './editar-votar-competencia.component';

describe('EditarVotarCompetenciaComponent', () => {
  let component: EditarVotarCompetenciaComponent;
  let fixture: ComponentFixture<EditarVotarCompetenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarVotarCompetenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarVotarCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
