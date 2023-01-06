import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClazzScheduleComponent } from './clazz-schedule.component';

describe('ClazzScheduleComponent', () => {
  let component: ClazzScheduleComponent;
  let fixture: ComponentFixture<ClazzScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClazzScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClazzScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
