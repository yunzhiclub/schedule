import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {TermService} from '../../service/term.service';
import {ClazzService} from '../../service/clazz.service';

@Injectable({
  providedIn: 'root'
})
export class YzAsyncValidators {

  constructor(private termService: TermService,
              private clazzService: ClazzService) {
  }

  /**
   * 学期名是否存在
   * @param termId 排除此学期
   */
  termNameUnique(termId?: number): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control) => {
      return new Observable<ValidationErrors | null>(subscriber => {
        this.termService.termNameUnique(control.value, termId)
          .subscribe(result => {
            result ? subscriber.next({termNameUnique: '学期名已存在'}) : subscriber.next(null);
            subscriber.complete();
          });
      });
    };
  }

  clazzNameUnique(clazzId?: number): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control) => {
      return new Observable<ValidationErrors | null>(subscriber => {
        this.clazzService.clazzNameUnique(control.value, clazzId)
          .subscribe(result => {
            result ? subscriber.next({clazzNameUnique: '班级名已存在'}) : subscriber.next(null);
            subscriber.complete();
          });
      });
    };
  }
}
