import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAraizaAprendeComponent } from './add-araiza-aprende.component';

describe('AddAraizaAprendeComponent', () => {
  let component: AddAraizaAprendeComponent;
  let fixture: ComponentFixture<AddAraizaAprendeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAraizaAprendeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAraizaAprendeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
