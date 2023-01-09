import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialNoticiasComponent } from './historial-noticias.component';

describe('HistorialNoticiasComponent', () => {
  let component: HistorialNoticiasComponent;
  let fixture: ComponentFixture<HistorialNoticiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialNoticiasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialNoticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
