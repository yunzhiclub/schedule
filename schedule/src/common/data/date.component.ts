import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => DateComponent)
    }
  ]
})
export class DateComponent implements OnInit, ControlValueAccessor {

  date = new FormControl();

  constructor(private datePipe: DatePipe) { }

  registerOnTouched(fn: any): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  registerOnChange(fn: any): void {
    this.date.valueChanges
      .subscribe(date => {
        date = new Date(date).getTime() / 1000;
        console.log('data组件向外传时间戳', date);
        // 转换字符串
        fn(date + '');
      });
  }

  writeValue(data: string): void {
    const time = +data;
    // +空字符串的 结果为 0, +非法字符串(如'123-123')的结果为 NaN
    if (data !== '' && !isNaN(time) && time !== null && time !== undefined) {
      const result = this.datePipe.transform(time * 1000, 'yyyy-MM-dd');
      console.log('向data组件内传时间戳', result);
      this.date.setValue(result);
    }
  }
}
