import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoNoticiasComponent } from './todo-noticias.component';

describe('TodoNoticiasComponent', () => {
  let component: TodoNoticiasComponent;
  let fixture: ComponentFixture<TodoNoticiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoNoticiasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoNoticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
