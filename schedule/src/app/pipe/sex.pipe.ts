import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sex'
})
export class SexPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value === undefined || value === null) {
      return '-';
    }
    if (value) {
      return '男';
    } else {
      return '女';
    }
  }

}
