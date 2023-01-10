import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {Clazz} from '../../entity/clazz';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ClazzService} from '../../service/clazz.service';

/**
 * 班级选择组件
 */
@Component({
  selector: 'app-clazz-select',
  templateUrl: './clazz-select.component.html',
  styleUrls: ['./clazz-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => ClazzSelectComponent)
    }
  ]
})
export class ClazzSelectComponent implements OnInit, ControlValueAccessor {

  /**
   * 所有班级
   */
  clazzes = new Array<Clazz>();
  clazzSelected = new FormControl(null);

  /**
   * 是否显示 请选择
   */
  isShowPleaseSelect = true;

  @Input()
  set showAllClazz(isShowAllClazz: boolean) {
    this.isShowPleaseSelect = isShowAllClazz;
  }

  constructor(private clazzService: ClazzService) {
  }

  ngOnInit(): void {
    this.clazzService.getAll().subscribe(clazzes => {
      this.clazzes = clazzes;
    });
  }

  /**
   * 子组件需要向父组件弹值时，直接调参数中的fn方法
   * 相当于@Ouput()
   * @param fn 此类型取决于当前组件的弹出值类型，当前弹出为clazzId number
   */
  registerOnChange(fn: (data: number) => void): void {
    console.log('clazz-select向外传值');
    this.clazzSelected.valueChanges
      .subscribe((data: number) => {
        console.log(data);
        fn(data);
      });
  }

  registerOnTouched(fn: any): void {
    console.warn('registerOnTouched not implemented');
  }

  /**
   * 将FormControl中的值通过此方法写入
   * FormControl的值每变换一次，该方法被重新执行一次
   * 相当于@Input set XXX
   * @param obj 此类型取决于当前组件的接收类型，当前接收为clazzId number
   */
  writeValue(obj: number): void {
    console.log('向clazz-select组件传值', obj);
    this.clazzSelected.setValue(obj);
  }
}
