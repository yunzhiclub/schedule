import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Schedule} from '../../../../entity/schedule';
import {Dispatch} from '../../../../entity/dispatch';
import {ScheduleService} from '../../../../service/schedule.service';
import {ClazzService} from '../../../../service/clazz.service';
import {Clazz} from '../../../../entity/clazz';
import {CommonService} from '../../../../service/common.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Teacher} from '../../../../entity/teacher';
import {TeacherService} from '../../../../service/teacher.service';
@Component({
  selector: 'app-edit-clazzes-and-teachers',
  templateUrl: './edit-clazzes-and-teachers.component.html',
  styleUrls: ['./edit-clazzes-and-teachers.component.scss']
})
export class EditClazzesAndTeachersComponent implements OnInit {
  // 两个教师是否相同
  isTeacherSame = false;
  teachers = [] as Teacher[];
  private scheduleId: number | undefined;
  schedule = {} as Schedule;
  dispatches = [] as Dispatch[];
  // 所有班级
  allClazzes = [] as Clazz[];
  // 第一次筛选完之后可以使用的班级，筛选该排课对应的班级
  firstFilerClazzes = [] as Clazz[];
  // 第二次筛选完之后可以使用的班级，筛选掉已经选择该课程的班级
  secondFilerClazzes = [] as Clazz[];
  // 第三次筛选完之后可以使用的班级，筛选掉跟当前排课时间有冲突的班级
  thirdFilerClazzes = [] as Clazz[];
  // 本学期所有的排课
  allSchedulesInCurrentTerm = [] as Schedule[];
  // 从所有的dispatches中挑选出与当前schedule时间冲突的scheduleId
  scheduleIdOfDispatchConflictClazzes = [] as number[];
  // 通过冲突的scheduleId获取到对应的班级，用于第三次筛选
  dispatchConflictClazzes = [] as Clazz[];
  // 时间冲突的教师
  conflictTeachers = [] as Teacher[];
  // 可选择的教师
  selectableTeachers = [] as Teacher[];
  constructor(private route: ActivatedRoute,
              private scheduleService: ScheduleService,
              private clazzService: ClazzService,
              public commonService: CommonService,
              private teacherService: TeacherService,
              private router: Router) { }
  formGroup = new FormGroup({
    clazzIds: new FormControl(null, Validators.required),
    teacher1Id: new FormControl(null, Validators.required),
    teacher2Id: new FormControl(null, Validators.required)
  });
  ngOnInit(): void {
    this.teacherService.getAll()
      .subscribe(allTeacher => {
        this.teachers = allTeacher;
      });
    this.scheduleId = this.route.snapshot.params.id;
    console.log('this.scheduleId', this.scheduleId);
    this.scheduleService.getById(this.scheduleId!)
      .subscribe(schedule => {
        this.schedule = schedule;
        this.dispatches = schedule.dispatches;
        this.setTeachers();
        this.getClazzesForAddClazzes();
      });
    // 订阅参数
    this.subscribeFormGroup();
  }
  /**
   * 订阅参数，各参数改变时修改其后置数据
   */
  private subscribeFormGroup(): void {
    this.formGroup.get('teacher1Id')?.valueChanges.subscribe((teacher1Id: number) => {
      if (this.formGroup.get('teacher2Id')?.value !== null) {
        this.isTeacherSame = teacher1Id === this.formGroup.get('teacher2Id')?.value.toString();
      } else {
        this.isTeacherSame = teacher1Id === this.formGroup.get('teacher2Id')?.value;
      }
    });
    this.formGroup.get('teacher2Id')?.valueChanges.subscribe((teacher2Id: number) => {
      this.isTeacherSame = teacher2Id === this.formGroup.get('teacher1Id')?.value.toString();
    });
  }
  // 为新增班级获取可选班级
  private getClazzesForAddClazzes(): void {
    this.getAllClazzes();
  }
  // 向后台请求获取所有班级
  private getAllClazzes(): void {
    this.clazzService.getAll()
      .subscribe(allClazzes => {
        this.allClazzes = allClazzes;
        // console.log('get all classes success', this.allClazzes);
        this.getFirstFilerClazzes();
        this.getSecondFilerClazzes();
      }, error => {
        console.log('get all classes error', error);
      });
  }
  //  从allClazzes中除去alreadyExitClazzes的班级得到firstFilerClazzes
  getFirstFilerClazzes(): void {
    this.firstFilerClazzes = this.allClazzes
      .filter((x) => !this.schedule.clazzes.some((item) => x.id === item.id));
    // console.log('打印firstFilerClazzes', this.firstFilerClazzes);
  }
  //  从firstFilerClazzes中除去已经选择该课程的班级得到secondFilerClazzes
  getSecondFilerClazzes(): void {
    const willFilteredClazzes = [] as Clazz[];
    this.scheduleService.getSchedulesInCurrentTerm()
      .subscribe(schedules => {
        this.allSchedulesInCurrentTerm = schedules;
        // console.log('allSchedulesInCurrentTerm', this.allSchedulesInCurrentTerm);
        for (const schedule of this.allSchedulesInCurrentTerm) {
          if (schedule.course.id === this.schedule.course.id) {
            for (const clazz of schedule.clazzes) {
              willFilteredClazzes.push(clazz);
            }
          }
        }
        this.secondFilerClazzes = this.firstFilerClazzes.filter((x) => !willFilteredClazzes.some(item => x.id === item.id));
        // console.log('this.secondFilerClazzes', this.secondFilerClazzes);
        this.getThirdFilerClazzes();
        this.getSelectableTeachers();
      });
  }
  //  从secondFilerClazzes中除去已经选择该课程的班级得到thirdFilerClazzes
  getThirdFilerClazzes(): void {
    for (const schedule of this.allSchedulesInCurrentTerm) {
      for (const dispatch of schedule.dispatches) {
        for (const alreadyExitDispatch of this.dispatches) {
          if ( dispatch.day === alreadyExitDispatch.day
            && dispatch.lesson === alreadyExitDispatch.lesson
            && dispatch.week === alreadyExitDispatch.week
            && schedule.id !== this.schedule.id) {
            this.scheduleIdOfDispatchConflictClazzes.push(schedule.id);
          }
        }
      }
    }
    this.getDispatchConflictClazzesByScheduleId();
  }
  getDispatchConflictClazzesByScheduleId(): void {
    for (const schedule of this.allSchedulesInCurrentTerm) {
      for (const scheduleId of this.scheduleIdOfDispatchConflictClazzes) {
        if (schedule.id === scheduleId) {
          for (const clazz of schedule.clazzes) {
            this.dispatchConflictClazzes.push(clazz);
          }
        }
      }
    }
    // console.log('打印 dispatchConflictClazzes', this.dispatchConflictClazzes);
    // 从第一次筛选过后的班级中筛选出来不在冲突班级的班级
    this.thirdFilerClazzes = this.secondFilerClazzes
      .filter((x) => !this.dispatchConflictClazzes.some((item) => x.id === item.id));
    // console.log('打印最终的可选择的班级', this.thirdFilerClazzes);
  }
  onDeleteClazz(clazzId: number): void {
    const scheduleId = this.scheduleId;
    this.commonService.confirm((confirm) => {
        if (confirm) {
          this.clazzService.removeClazzFromSchedule(clazzId, scheduleId)
            .subscribe(success => {
              console.log('班级删除成功', success);
              this.ngOnInit();
              this.commonService.success();
            }, error => {
              console.log('班级删除失败', error);
              this.commonService.error();
            });
        }
      },
    );
  }
  private setTeachers(): void {
    this.formGroup.get('teacher1Id')!.setValue(this.schedule.teacher1.id);
    this.formGroup.get('teacher2Id')!.setValue(this.schedule.teacher2.id);
  }
  canSubmit(): boolean {
    console.log('canSubmit', !(!this.isTeacherSame &&
      this.formGroup.get('teacher1Id')?.value !== 'null' &&
      this.formGroup.get('teacher2Id')?.value !== 'null'));
    return !(!this.isTeacherSame &&
      this.formGroup.get('teacher1Id')?.value !== 'null' &&
      this.formGroup.get('teacher2Id')?.value !== 'null');
  }
  onSubmit(formGroup: FormGroup): void {
    const updateClazzesAndTeachers = {
      teacher1Id: formGroup.get('teacher1Id')?.value,
      teacher2Id: formGroup.get('teacher2Id')?.value,
      clazzIds: formGroup.get('clazzIds')?.value,
    };
    // tslint:disable-next-line:max-line-length
    this.scheduleService.updateClazzesAndTeachers(this.scheduleId, updateClazzesAndTeachers.teacher1Id, updateClazzesAndTeachers.teacher2Id, updateClazzesAndTeachers.clazzIds)
      .subscribe(() => {
        this.commonService.success(() => this.router.navigate(['../'], {relativeTo: this.route}));
      });
  }
  private getSelectableTeachers(): void {
    this.getConflictTeachers();
    this.selectableTeachers = this.teachers
      .filter((x) => !this.conflictTeachers.some((item) => x.id === item.id));
  }
  private getConflictTeachers(): void {
    for (const schedule of this.allSchedulesInCurrentTerm) {
      if (schedule.id !== this.schedule.id) {
        for (const dispatch of schedule.dispatches) {
          for (const alreadyExitDispatch of this.dispatches) {
            if ( dispatch.day === alreadyExitDispatch.day
              && dispatch.lesson === alreadyExitDispatch.lesson
              && dispatch.week === alreadyExitDispatch.week) {
              if (!this.whetherTeachersIncludeTeacher(this.conflictTeachers, schedule.teacher1)) {
                this.conflictTeachers.push(schedule.teacher1);
              }
              if (!this.whetherTeachersIncludeTeacher(this.conflictTeachers, schedule.teacher2)) {
                this.conflictTeachers.push(schedule.teacher2);
              }
            }
          }
        }
      }
    }
  }
  private whetherTeachersIncludeTeacher(teachers: Teacher[], newTeacher: Teacher): boolean {
    for (const teacher of teachers) {
      if (teacher.id === newTeacher.id) {
        return true;
      }
    }
    return false;
  }
}
