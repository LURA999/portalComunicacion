import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AraizaAprendeComponent } from './custionarios.component';

describe('AraizaAprendeComponent', () => {
  let component: AraizaAprendeComponent;
  let fixture: ComponentFixture<AraizaAprendeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AraizaAprendeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AraizaAprendeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
