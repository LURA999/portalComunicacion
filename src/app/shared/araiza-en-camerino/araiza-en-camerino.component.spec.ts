import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AraizaEnCamerinoComponent } from './araiza-en-camerino.component';

describe('AraizaEnCamerinoComponent', () => {
  let component: AraizaEnCamerinoComponent;
  let fixture: ComponentFixture<AraizaEnCamerinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AraizaEnCamerinoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AraizaEnCamerinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
