import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {TermService} from '../../service/term.service';
import {ClazzService} from '../../service/clazz.service';
import {StudentService} from '../../service/student.service';
import {TeacherService} from '../../service/teacher.service';
import {RoomService} from '../../service/room.service';

@Injectable({
  providedIn: 'root'
})
export class YzAsyncValidators {

  constructor(private termService: TermService,
              private studentService: StudentService,
              private clazzService: ClazzService,
              private roomService: RoomService,
              private teacherService: TeacherService) {
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

  studentNameUnique(studentId?: number): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control) => {
      return new Observable<ValidationErrors | null>(subscriber => {
        this.studentService.studentNameUnique(control.value, studentId)
          .subscribe(result => {
            result ? subscriber.next({studentNameUnique: '学生名已存在'}) : subscriber.next(null);
            subscriber.complete();
          });
      });
    };
  }

  snoUnique(studentId?: number): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control) => {
      return new Observable<ValidationErrors | null>(subscriber => {
        this.studentService.snoUnique(control.value, studentId)
          .subscribe(result => {
            result ? subscriber.next({snoUnique: '学号已存在'}) : subscriber.next(null);
            subscriber.complete();
          });
      });
    };
  }

  phoneUnique(teacherId?: number): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control) => {
      return new Observable<ValidationErrors | null>(subscriber => {
        this.teacherService.phoneUnique(control.value, teacherId)
          .subscribe(result => {
            console.log('phone', result);
            result ? subscriber.next({phoneUnique: '手机号已存在'}) : subscriber.next(null);
            subscriber.complete();
          });
      });
    };
  }

  roomNameUnique(RoomId?: number): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control) => {
      return new Observable<ValidationErrors | null>(subscriber => {
        this.roomService.roomNameUnique(control.value, RoomId)
          .subscribe(result => {
            console.log('phone', result);
            result ? subscriber.next({roomNameUnique: '教室名称已存在'}) : subscriber.next(null);
            subscriber.complete();
          });
      });
    };
  }
}
