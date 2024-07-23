import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotacionesConfigComponent } from './votaciones-config.component';

describe('VotacionesComponent', () => {
  let component: VotacionesConfigComponent;
  let fixture: ComponentFixture<VotacionesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotacionesConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotacionesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
