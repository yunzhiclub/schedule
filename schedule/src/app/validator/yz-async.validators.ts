import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {Term} from '../../entity/term';
import {TermService} from '../../service/term.service';

@Injectable({
  providedIn: 'root'
})
export class YzAsyncValidators {

  constructor(private termService: TermService) {
  }

  /**
   * 学期名是否存在
   * @param termId 排除此学期
   */
  termNameUnique(termId?: number): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control) => {
      return new Observable<ValidationErrors | null>(subscriber => {
        console.log(termId);
        this.termService.termNameUnique(control.value, termId)
          .subscribe(result => {
            result ? subscriber.next({termNameUnique: '学期名已存在'}) : subscriber.next(null);
            subscriber.complete();
          });
      });
    };
  }
}
