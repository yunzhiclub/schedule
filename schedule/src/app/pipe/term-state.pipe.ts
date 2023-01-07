import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'termState'
})
export class TermStatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value === undefined || value === null) {
      return '-';
    }
    if (value) {
      return '已激活';
    } else {
      return '未激活';
    }
  }

}
