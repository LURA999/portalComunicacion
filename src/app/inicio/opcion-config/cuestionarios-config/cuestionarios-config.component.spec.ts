import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuestionariosConfigComponent } from './cuestionarios-config.component';

describe('CuestionariosConfigComponent', () => {
  let component: CuestionariosConfigComponent;
  let fixture: ComponentFixture<CuestionariosConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuestionariosConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuestionariosConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
