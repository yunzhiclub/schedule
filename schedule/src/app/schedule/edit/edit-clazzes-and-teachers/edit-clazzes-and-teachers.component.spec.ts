import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClazzesAndTeachersComponent } from './edit-clazzes-and-teachers.component';

describe('EditClazzesAndTeachersComponent', () => {
  let component: EditClazzesAndTeachersComponent;
  let fixture: ComponentFixture<EditClazzesAndTeachersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClazzesAndTeachersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClazzesAndTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
