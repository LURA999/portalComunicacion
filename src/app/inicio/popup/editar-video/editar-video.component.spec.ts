import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarVideoComponent } from './editar-video.component';

describe('EditarVideoComponent', () => {
  let component: EditarVideoComponent;
  let fixture: ComponentFixture<EditarVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
