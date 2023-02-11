import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlianzasConfigComponent } from './alianzas-config.component';

describe('AlianzasConfigComponent', () => {
  let component: AlianzasConfigComponent;
  let fixture: ComponentFixture<AlianzasConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlianzasConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlianzasConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
