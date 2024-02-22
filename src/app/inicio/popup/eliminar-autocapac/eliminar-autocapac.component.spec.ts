import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarAutocapacComponent } from './eliminar-autocapac.component';

describe('EliminarAutocapacComponent', () => {
  let component: EliminarAutocapacComponent;
  let fixture: ComponentFixture<EliminarAutocapacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EliminarAutocapacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarAutocapacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
