import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AraizaAprendeConfigComponent } from './araiza-aprende-config.component';

describe('AraizaAprendeConfigComponent', () => {
  let component: AraizaAprendeConfigComponent;
  let fixture: ComponentFixture<AraizaAprendeConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AraizaAprendeConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AraizaAprendeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
