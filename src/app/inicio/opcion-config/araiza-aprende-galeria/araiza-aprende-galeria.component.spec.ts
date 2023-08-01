import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AraizaAprendeGaleriaComponent } from './araiza-aprende-galeria.component';

describe('AraizaAprendeGaleriaComponent', () => {
  let component: AraizaAprendeGaleriaComponent;
  let fixture: ComponentFixture<AraizaAprendeGaleriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AraizaAprendeGaleriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AraizaAprendeGaleriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
