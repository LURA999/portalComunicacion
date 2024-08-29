import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenEnviadoComponent } from './examen-enviado.component';

describe('ExamenEnviadoComponent', () => {
  let component: ExamenEnviadoComponent;
  let fixture: ComponentFixture<ExamenEnviadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamenEnviadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenEnviadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
