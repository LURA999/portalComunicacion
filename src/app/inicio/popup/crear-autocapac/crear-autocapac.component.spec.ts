import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearAutocapacComponent } from './crear-autocapac.component';

describe('CrearAutocapacComponent', () => {
  let component: CrearAutocapacComponent;
  let fixture: ComponentFixture<CrearAutocapacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearAutocapacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearAutocapacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
