import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceptarPopupComponent } from './aceptar-popup.component';

describe('AceptarPopupComponent', () => {
  let component: AceptarPopupComponent;
  let fixture: ComponentFixture<AceptarPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AceptarPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceptarPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
