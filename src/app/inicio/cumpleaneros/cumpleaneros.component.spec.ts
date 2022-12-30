import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CumpleanerosComponent } from './cumpleaneros.component';

describe('CumpleanerosComponent', () => {
  let component: CumpleanerosComponent;
  let fixture: ComponentFixture<CumpleanerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CumpleanerosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CumpleanerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
