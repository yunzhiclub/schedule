import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ClazzSelectComponent} from './clazz-select.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {MockApiTestingInterceptor} from '@yunzhi/ng-mock-api/testing';


@Component({
  template: '<h1>Test:</h1><app-clazz-select [formControl]="clazzIdFormControl"></app-clazz-select>'
})
class TestComponent implements OnInit {
  clazzIdFormControl = new FormControl(1);

  ngOnInit(): void {
    console.log('父组件初始化');
  }

  onTest(): void {
    console.log('clazzId值为', this.clazzIdFormControl.value);
  }
}


describe('admin -> clazz -> ClazzSelectComponent', () => {
  let component: ClazzSelectComponent;
  let fixture: ComponentFixture<ClazzSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClazzSelectComponent, TestComponent],
      imports: [
        HttpClientModule,
        FormsModule,
        // MockApiTestingModule,
        ReactiveFormsModule,
      ],
      // providers: [
      //   {
      //     provide: HTTP_INTERCEPTORS, multi: true,
      //     useClass: MockApiTestingInterceptor.forRoot([
      //       ClazzMockApi
      //     ])
      //   }
      // ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClazzSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  //
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  //   fixture.autoDetectChanges();
  //   // 手动控制MockApi发送数据
  //   getTestScheduler().flush();
  //   fixture.detectChanges();
  // });
  //
  // it('响应式表单', () => {
  //   // 创建一个组件夹具（容器）
  //   console.log('开始创建父组件');
  //   const fixture1 = TestBed.createComponent(TestComponent);
  //
  //   const component1 = fixture1.componentInstance;
  //   // 调用detectChanges()渲染V层，开始渲染V层中的子组件。
  //   console.log('首次渲染组件');
  //   fixture1.detectChanges();
  //
  //   // 模拟返回数据后，进行变更检测重新渲染子组件V层
  //   console.log('触发后台模拟数据发送');
  //   getTestScheduler().flush();
  //   console.log('重新渲染组件');
  //   fixture1.detectChanges();
  // });
  //
  // it('先传值，然后再获取到所有的乡镇', () => {
  //   component.writeValue(4);
  //   getTestScheduler().flush();
  //   fixture.detectChanges();
  // });
  //
  // it('先获取到所有的乡镇，再接收到的传值', () => {
  //   getTestScheduler().flush();
  //   component.writeValue(4);
  //   fixture.detectChanges();
  // });
});
