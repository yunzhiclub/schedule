import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Course} from '../../../entity/course';
import {Clazz} from '../../../entity/clazz';
import {ClazzService} from '../../../service/clazz.service';
import {CourseService} from '../../../service/course.service';
import {Teacher} from '../../../entity/teacher';
import {TeacherService} from '../../../service/teacher.service';
import {config} from '../../../conf/app.config';
import {TermService} from '../../../service/term.service';
import {Term} from '../../../entity/term';
import {ScheduleService} from '../../../service/schedule.service';
import {Schedule} from '../../../entity/schedule';
import {Room} from '../../../entity/room';
import {Dispatch} from '../../../entity/dispatch';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  formGroup = new FormGroup({
    courseId: new FormControl(null, Validators.required),
    clazzIds: new FormControl(null, Validators.required),
    teacher1Id: new FormControl(null, Validators.required),
    teacher2Id: new FormControl(null, Validators.required)
  });
  weekNumber = config.weekNumber;

  // 时间表, 判断是否周可选
  times: boolean[][][] = [];
  // 地点表（教室), 判断是否教室可选
  sites: number[][][][] = [];
  // 冲突时间分类便于提示
  // 班级冲突时间
  conflictTimesOfClazzes: {day: number, lesson: number, week: number}[] = [];
  // 教师1冲突时间
  conflictTimesOfTeacher1: {day: number, lesson: number, week: number}[] = [];
  // 教师2冲突时间
  conflictTimesOfTeacher2: {day: number, lesson: number, week: number}[] = [];
  // 冲突地点, 通过学期所有被占用教室获取
  conflictSites: {day: number, lesson: number, week: number, roomIds: number[]}[] = [];
  // 选择的时间地点
  selectedData: {day: number, lesson: number, week: number, roomIds: number[]}[] = [];


  /* 所有课程 */
  courses =  []  as Course[];
  // 所有教师
  teachers =  []  as Teacher[];
  // 所有排课
  schedules =  []  as Schedule[];
  /* 待处理班级，需要筛选掉已经上过该门课的班级 */
  clazzes = [] as Clazz[];
  /* 可选班级，clazzes筛选过后的班级 */
  screenedClazzes: Clazz[] = [];

  // v层循环用
  lessons = [0, 1, 2, 3, 4];
  days = ['一', '二', '三', '四', '五', '六', '日'];

  // 是否展示模态框
  isShowModel = false;
  // 两个教师是否相同
  isTeacherSame = false;
  // 当前学期
  term = {} as Term;

  constructor(private clazzService: ClazzService,
              private courseService: CourseService,
              private teacherService: TeacherService,
              private termService: TermService,
              private scheduleService: ScheduleService) { }

  ngOnInit(): void {
    // 初始化时间表
    this.initTimes();
    // 初始化地点表
    this.initSites();
    // 订阅参数
    this.subscribeFormGroup();
    // 请求数据
    this.getData();
  }

  private initTimes(): void {
    // 天
    for (let i = 0; i < 7; i++) {
      this.times[i] = [];
      // 节
      for (let j = 0; j < 11; j++) {
        this.times[i][j] = [];
        // 周
        for (let k = 0; k < this.weekNumber; k++) {
          this.times[i][j][k] = true;
        }
      }
    }
  }

  private initSites(): void {
    for (let i = 0; i < 7; i++) {
      this.sites[i] = [];
      for (let j = 0; j < 11; j++) {
        this.sites[i][j] = [];
        for (let k = 0; k < this.weekNumber; k++) {
          this.sites[i][j][k] = [] as number[];
        }
      }
    }
  }

  /**
   * 订阅参数，各参数改变时修改其后置数据
   */
  private subscribeFormGroup(): void {
    this.formGroup.get('courseId')?.valueChanges.subscribe(() => {
      this.formGroup.get('clazzIds')?.setValue([]);
      this.formGroup.get('teacher1Id')?.setValue(null);
      this.formGroup.get('teacher2Id')?.setValue(null);
      this.clearScreenedClazzes(); // 已实现
      this.clearConflictTimes();   // 已实现
      this.clearSelectedData();    // 已实现
      this.makeScreenedClazzes();  // 已实现
      this.makeTimesAndSites();    // 未实现
    });
    this.formGroup.get('clazzIds')?.valueChanges.subscribe(() => {
      this.formGroup.get('teacher1Id')?.setValue(null);
      this.formGroup.get('teacher2Id')?.setValue(null);
      this.clearConflictTimes();
      this.clearSelectedData();
      this.makeTimesAndSites();
    });
    this.formGroup.get('teacher1Id')?.valueChanges.subscribe((teacher1Id: number) => {
      this.clearSelectedData();
      this.clearConflictTimes();
      this.makeConflictTimes();    // 已实现
      this.makeTimesAndSites();
      this.isTeacherSame = teacher1Id === this.formGroup.get('teacher2Id')?.value;
    });
    this.formGroup.get('teacher2Id')?.valueChanges.subscribe((teacher2Id: number) => {
      this.clearSelectedData();
      this.clearConflictTimes();
      this.makeConflictTimes();
      this.makeTimesAndSites();
      this.isTeacherSame = teacher2Id === this.formGroup.get('teacher1Id')?.value;
    });
  }

  /**
   * 展示model
   * @param day 天
   * @param lesson 节
   */
  showModel(day: number, lesson: number): void {
    this.isShowModel = true;
  }

  /**
   * 关闭model
   */
  close(): void {
    this.isShowModel = false;
    return;
  }


  /**
   * 保存数据并关闭model
   */
  save(): void {
    this.close();
  }

  private getData(): void {
    this.scheduleService.getSchedulesInCurrentTerm()
      .subscribe((schedules: Schedule[]) => {
        console.log(schedules);
        this.schedules = schedules;
        this.makeConflictSites();
      });
    this.courseService.getAll()
      .subscribe(allCourse => {
        this.courses = allCourse;
      });
    this.clazzService.getAll()
      .subscribe(allClazz => {
        this.clazzes = allClazz;
      });
    this.teacherService.getAll()
      .subscribe(allTeacher => {
        this.teachers = allTeacher;
      });
  }

  /**
   * 清空选择的数据
   */
  private clearSelectedData(): void {
    this.selectedData = [];
  }

  private clearScreenedClazzes(): void {
    this.screenedClazzes = [];
  }

  private clearConflictTimes(): void {
    this.conflictTimesOfClazzes = [];
    this.conflictTimesOfTeacher1 = [];
    this.conflictTimesOfTeacher2 = [];
  }

  /**
   * 获取没有上过已选择课程的班级
   */
  private makeScreenedClazzes(): void {
    const courseId = this.formGroup.get('courseId')?.value;
    if (courseId === '' || courseId === null || courseId === undefined) {
      // 没有选择课程， 将clazz_id设为null
      this.formGroup.get('clazzIds')?.setValue(null);
    } else {
      // 选择课程，请求已选择该课程的班级clazzIds, 并在clazzes中筛选掉这些班级
      this.clazzService.clazzesHaveSelectCourse(this.formGroup.get('courseId')?.value)
        .subscribe(clazzIds => {
          console.log('clazzIds', clazzIds);
          this.screenedClazzes = this.clazzes.filter(clazz => !clazzIds.includes(clazz.id));
        }, error => {
          console.log('error', error);
        });
    }
  }
  // 需要 schedules clazzIds teacher1 teacher2
  private makeConflictTimes(): void {
    this.makeConflictTimesOfClazzes();
    this.makeConflictTimesOfTeacher1();
    this.makeConflictTimesOfTeacher2();
    // console.log('clazzes', this.conflictTimesOfClazzes);
    // console.log('teacherId1', this.conflictTimesOfTeacher1);
    // console.log('teacherId2', this.conflictTimesOfTeacher2);
  }

  // 需要 当前学期的schedules
  private makeConflictSites(): void {
    this.schedules.forEach(schedule => {
      schedule.dispatches.forEach(dispatch => {
        dispatch.rooms.forEach(room => {
          this.sites[dispatch.day!][dispatch.lesson!][dispatch.week!].push(room.id!);
        });
      });
    });
    this.sites = Array.from(new Set(this.sites));
  }
  // 需要冲突时间和地点
  private makeTimesAndSites(): void {
    return;
  }

  isShowTeacher(): boolean {
    return !!(this.formGroup.get('clazzIds')?.valid
      && this.formGroup.get('clazzIds')?.value !== null
      && (this.formGroup.get('clazzIds')?.value?.length === 1 && this.formGroup.get('clazzIds')?.value[0] !== null)
    );
  }

  /**
   *  生成班级冲突时间
   */
  private makeConflictTimesOfClazzes(): void {
    const clazzIds: number[] = this.formGroup.get('clazzIds')?.value as [];
    this.schedules.forEach(schedule => {
      let status = false;
      // schedule对应班级是否包含已选中班级
      schedule.clazzes.forEach((clazz: Clazz) => {
        if (!status && clazzIds.includes(clazz.id)) {
          status = true;
          // 包含已选中班级则将对应dispatch保存
          schedule.dispatches.forEach((dispatch: Dispatch) => {
            this.conflictTimesOfClazzes.push({day: dispatch.day!, lesson: dispatch.lesson!, week: dispatch.week!});
          });
        }
      });
    });
  }

  private makeConflictTimesOfTeacher1(): void {
    const teacher1Id = +this.formGroup.get('teacher1Id')?.value;
    this.schedules.forEach((schedule: Schedule) => {
      if (schedule.teacher1.id === teacher1Id) {
        schedule.dispatches.forEach((dispatch: Dispatch) => {
          this.conflictTimesOfTeacher1.push({day: dispatch.day!, lesson: dispatch.lesson!, week: dispatch.week!});
        });
      }
    });
    console.log('teacher1Id', this.conflictTimesOfTeacher1);
  }

  private makeConflictTimesOfTeacher2(): void {
    const teacher2Id = +this.formGroup.get('teacher2Id')?.value;
    this.schedules.forEach((schedule: Schedule) => {
      if (schedule.teacher2.id === teacher2Id) {
        schedule.dispatches.forEach((dispatch: Dispatch) => {
          this.conflictTimesOfTeacher2.push({day: dispatch.day!, lesson: dispatch.lesson!, week: dispatch.week!});
        });
      }
    });
    console.log('teacher2Id', this.conflictTimesOfTeacher2);
  }
}
