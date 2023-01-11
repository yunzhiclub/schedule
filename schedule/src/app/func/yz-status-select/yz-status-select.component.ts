import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {StatusEnum} from '../../entity/enum/statusEnum';
import {Assert} from '../../common/utils';

@Component({
  selector: 'app-yz-status-select',
  templateUrl: './yz-status-select.component.html',
  styleUrls: ['./yz-status-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => YzStatusSelectComponent)
    }
  ]
})
export class YzStatusSelectComponent implements OnInit, ControlValueAccessor {
  currentSelectFormControl = new FormControl();
  options = new Array<StatusEnum<any>>();

  @Input()
  showSelectAll = false;

  @Input()
  statuses: Record<string, StatusEnum<any>>;

  constructor() {
  }

  ngOnInit(): void {
    Assert.isDefined(this.statuses, '必须传入状态值');
    if (this.showSelectAll) {
      this.options.push({value: null, description: '全部状态', clazz: ''});
    }
    for (const key in this.statuses) {
      if (this.statuses[key]) {
        this.options.push(this.statuses[key]);
      }
    }
  }

  registerOnChange(fn: (data: number) => void): void {
    this.currentSelectFormControl.valueChanges
      .subscribe(value => fn(value));
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: number): void {
    this.currentSelectFormControl.setValue(obj);
  }
}
