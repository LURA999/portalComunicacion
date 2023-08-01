import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestAraizaAprendeComponent } from './rest-araiza-aprende.component';

describe('RestAraizaAprendeComponent', () => {
  let component: RestAraizaAprendeComponent;
  let fixture: ComponentFixture<RestAraizaAprendeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestAraizaAprendeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestAraizaAprendeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
