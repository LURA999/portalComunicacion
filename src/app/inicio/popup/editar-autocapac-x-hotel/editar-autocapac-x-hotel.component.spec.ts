import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAutocapacComponent } from './editar-autocapac-x-hotel.component';

describe('EditarAutocapacComponent', () => {
  let component: EditarAutocapacComponent;
  let fixture: ComponentFixture<EditarAutocapacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarAutocapacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarAutocapacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
