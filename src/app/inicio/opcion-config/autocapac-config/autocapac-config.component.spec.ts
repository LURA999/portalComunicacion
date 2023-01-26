import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCapacConfigComponente } from './autocapac-config.component';

describe('AutocapacitacionesConfigComponent', () => {
  let component: AutoCapacConfigComponente;
  let fixture: ComponentFixture<AutoCapacConfigComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoCapacConfigComponente ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoCapacConfigComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
