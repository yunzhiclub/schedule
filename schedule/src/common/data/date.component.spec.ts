import {TestBed} from '@angular/core/testing';

import { DateComponent } from './date.component';
import {Component} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {getTestScheduler} from 'jasmine-marbles';

@Component({
  template: '<h1>Test:</h1> <app-date [formControl]="dateFormControl"></app-date>'
})
class TestComponent {
  dateFormControl = new FormControl('2021-09-01');
}

describe('admin => term => DateComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateComponent, TestComponent ],
      imports: [
        ReactiveFormsModule,
      ],
    })
    .compileComponents();
  });

  it('响应式表单', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    getTestScheduler().flush();
    fixture.detectChanges();
  });
});
