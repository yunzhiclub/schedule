import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Course} from '../../../entity/course';
import {Clazz} from '../../../entity/clazz';
import {ClazzService} from '../../../service/clazz.service';
import {CourseService} from '../../../service/course.service';
import {Teacher} from '../../../entity/teacher';
import {TeacherService} from '../../../service/teacher.service';
import {config} from '../../../conf/app.config';

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
  sites: {id: number, free: boolean}[][][] = [];
  // 冲突时间分类便于提示
  // 班级冲突时间
  conflictTimesOfClazzes: {day: number, lesson: number, weeks: number[]}[] = [];
  // 教师1冲突时间
  conflictTimesOfTeacher1: {day: number, lesson: number, weeks: number[]}[] = [];
  // 教师2冲突时间
  conflictTimesOfTeacher2: {day: number, lesson: number, weeks: number[]}[] = [];
  // 冲突地点, 通过学期所有被占用教室获取
  conflictSites: {day: number, lesson: number, week: number, roomIds: number[]}[] = [];
  // 选择的时间地点
  selectedData: {day: number, lesson: number, week: number, roomIds: number[]}[] = [];


  /* 所有课程 */
  courses =  []  as Course[];
  // 所有教师
  teachers =  []  as Teacher[];
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

  constructor(private clazzService: ClazzService,
              private courseService: CourseService,
              private teacherService: TeacherService) { }

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
          this.sites[i][j][k] = {} as {id: number, free: boolean};
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
      this.initScreenedClazzes();
      this.initConflictTimes();
      this.initSelectedData();
      this.makeScreenedClazzes(); // 已实现
      this.makeConflictTimes();
      this.makeTimesAndSites();
    });
    this.formGroup.get('clazzIds')?.valueChanges.subscribe(() => {
      this.formGroup.get('teacher1Id')?.setValue(null);
      this.formGroup.get('teacher2Id')?.setValue(null);
      this.initSelectedData();
      this.initConflictTimes();
      this.makeConflictTimes();
      this.makeTimesAndSites();
    });
    this.formGroup.get('teacher1Id')?.valueChanges.subscribe((teacher1Id: number) => {
      this.initSelectedData();
      this.makeConflictTimes();
      this.makeTimesAndSites();
      this.isTeacherSame = teacher1Id === this.formGroup.get('teacher2Id')?.value;
    });
    this.formGroup.get('teacher2Id')?.valueChanges.subscribe((teacher2Id: number) => {
      this.initSelectedData();
      this.makeConflictTimes();
      this.makeTimesAndSites();
      this.isTeacherSame = teacher2Id === this.formGroup.get('teacher1Id')?.value;
    });
  }

  onCourseIdChange(): void {
    this.formGroup.get('clazzIds')?.setValue([]);


  }

  onTeacherIdChange(): void {
    // 教师有变动，courseTimes要清空， 防止之前的班级选择的某些数据影响之后的选择
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

  private initSelectedData(): void {
    this.selectedData = [];
  }

  private initScreenedClazzes(): void {
    this.screenedClazzes = [];
  }

  private initConflictTimes(): void {
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

  private makeConflictTimes(): void {
    return;
  }

  private makeTimesAndSites(): void {
    return;
  }
}
