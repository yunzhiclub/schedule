import {ComponentFixture, TestBed} from '@angular/core/testing';

import {YzStatusSelectComponent} from './yz-status-select.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TEST_STATUS} from '../../entity/enum/test-status';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';

@Component({
  template: `
    <app-yz-status-select
      *ngIf="show"
      [statuses]="statuses"
      [showSelectAll]="showSelectAll"></app-yz-status-select>`
})
class TestComponent {
  show = true;
  statuses = {};
  showSelectAll = true;
}

describe('func -> YzStatusSelectComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let yzComponent: YzStatusSelectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YzStatusSelectComponent, TestComponent],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    yzComponent = fixture.debugElement.query(By.directive(YzStatusSelectComponent)).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('作业状态示例', () => {
    // 先隐藏
    component.show = false;
    fixture.detectChanges();

    // 再显示
    component.statuses = TEST_STATUS;
    component.showSelectAll = true;
    component.show = true;
    fixture.detectChanges();
  });
});
