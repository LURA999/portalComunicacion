import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaDeAyudaComponent } from './linea-de-ayuda.component';

describe('LineaDeAyudaComponent', () => {
  let component: LineaDeAyudaComponent;
  let fixture: ComponentFixture<LineaDeAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineaDeAyudaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineaDeAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
