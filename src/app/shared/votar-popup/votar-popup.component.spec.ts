import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotarPopupComponent } from './votar-popup.component';

describe('VotarPopupComponent', () => {
  let component: VotarPopupComponent;
  let fixture: ComponentFixture<VotarPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotarPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotarPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
