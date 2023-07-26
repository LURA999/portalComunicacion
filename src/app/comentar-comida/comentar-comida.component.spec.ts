import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentarComidaComponent } from './comentar-comida.component';

describe('ComentarComidaComponent', () => {
  let component: ComentarComidaComponent;
  let fixture: ComponentFixture<ComentarComidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComentarComidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentarComidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
