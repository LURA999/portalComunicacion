import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AraizaAprendeFormularioComponent } from './araiza-aprende-formulario.component';

describe('AraizaAprendeFormularioComponent', () => {
  let component: AraizaAprendeFormularioComponent;
  let fixture: ComponentFixture<AraizaAprendeFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AraizaAprendeFormularioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AraizaAprendeFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
