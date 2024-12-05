import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AraizaAprendeClickComponent } from './custionarios-click.component';

describe('AraizaAprendeClickComponent', () => {
  let component: AraizaAprendeClickComponent;
  let fixture: ComponentFixture<AraizaAprendeClickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AraizaAprendeClickComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AraizaAprendeClickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
