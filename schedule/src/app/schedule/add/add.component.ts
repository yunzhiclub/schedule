import {Component, OnInit} from '@angular/core';
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
import {Dispatch} from '../../../entity/dispatch';
import {Room} from '../../../entity/room';
import {RoomService} from '../../../service/room.service';

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

  // 时间表, 判断是否周可选; true: 可选
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
  selectedData: {day: number, smLesson: number, week: number, roomIds: number[]}[] = [];
  // 临时时间地点
  tempData: number[][] = [];
  // 记录每个天节的smLessons
  smLessonsRecorder = [] as number[][][];


  /* 所有课程 */
  courses =  []  as Course[];
  // 所有教师
  teachers =  []  as Teacher[];
  // 所有排课
  schedules =  []  as Schedule[];
  // 所有教室
  rooms: Room[] = [];
  /* 待处理班级，需要筛选掉已经上过该门课的班级 */
  clazzes = [] as Clazz[];
  /* 可选班级，clazzes筛选过后的班级 */
  screenedClazzes: Clazz[] = [];

  // v层循环用
  bigLessons = [0, 1, 2, 3, 4];
  days = ['一', '二', '三', '四', '五', '六', '日'];

  // 是否展示模态框
  isShowModel = false;
  // 两个教师是否相同
  isTeacherSame = false;
  // 当前学期
  term = {} as Term;
  // 当前天
  day: number | undefined;
  // 当前节( < 5 的大节)
  bigLesson: number | undefined;
  // 小节
  smLessons: number[] = [0, 1];
  // 当前周
  week: number | undefined;
  // 周
  weeks: number[] = [];
  // 选择的周
  selectedWeeks = [] as number[];
  // 选择的教室
  selectedRooms = [] as number[];
  // 不可用的周
  disabledWeeks = [] as number[];
  // 不可用的教室
  disabledRooms = [] as number[];
  // 时间选择模式: true 分别选择 | false 同步选择 默认为同步选择
  pattern = false;
  // 是否小结确定
  isSmLessonsDetermine = false;

  constructor(private clazzService: ClazzService,
              private courseService: CourseService,
              private teacherService: TeacherService,
              private termService: TermService,
              private scheduleService: ScheduleService,
              private roomService: RoomService,
              ) { }

  ngOnInit(): void {
    // 初始化时间表
    this.initTimes();
    // 初始化地点表
    this.initSites();
    // 初始化smLessons记录器
    this.initSmLessonsRecorder();
    // 订阅参数
    this.subscribeFormGroup();
    // 请求数据
    this.getData();
  }

  // 依赖本学期周数
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
  // 依赖本学期周数
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
  // 依赖本学期周数
  private initSmLessonsRecorder(): void {
    for (let i = 0; i < 7; i++) {
      this.smLessonsRecorder[i] = [];
      for (let j = 0; j < 5; j++) {
        this.smLessonsRecorder[i][j] = [0, 1];
        if (j === 4) { this.smLessonsRecorder[i][j].push(2); }
      }
    }
  }
  // 依赖本学期周数
  private initTempData(): void {
    for (let i = 0; i < this.weekNumber; i++) {
      this.tempData[i] = [] as number[];
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
      this.clearScreenedClazzes();
      this.clearConflictTimes();
      this.clearSelectedData();
      this.makeScreenedClazzes();
      this.makeTimesAndSites();
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
   * @param bigLesson 大节
   */
  showModel(day: number, bigLesson: number): void {
    this.day = day;
    this.bigLesson = bigLesson;
    this.initTempData();
    this.makeTempData();
    this.isShowModel = true;
  }

  /**
   * 关闭model
   */
  close(): void {
    this.isShowModel = false;
    this.day = undefined;
    this.bigLesson = undefined;
    this.week = undefined;
    this.selectedRooms = [];
    this.selectedWeeks = [];
    this.initTempData();
  }


  /**
   * 保存数据并关闭model
   */
  save(): void {
    this.deleteSelectedData();
    if (this.pattern) {
      this.smLessons.forEach(smLesson => {
        for (let week = 0; week < this.tempData.length; week++) {
          if (this.tempData[week].length > 0) {
            this.selectedData.push({week, day: this.day!, smLesson, roomIds: this.tempData[week]});
          }
        }
      });
    } else {
      this.smLessons.forEach(smLesson => {
        this.selectedWeeks.forEach(week => {
          this.selectedData.push({week, day: this.day!, smLesson, roomIds: this.selectedRooms});
        });
      });
    }
    this.smLessonsRecorder[this.day!][this.bigLesson!] = Array.from(this.smLessons);
    this.close();
    console.log('save', this.selectedData);
  }

  private getData(): void {
    this.termService.getCurrentTerm()
      .subscribe((term: Term) => {
        this.term = term;
        const seconds = +term.endTime - +term.startTime;
        const days = Math.ceil(seconds / (60 * 60 * 24));
        this.weekNumber = Math.ceil(days / 7);
        this.initTimes();
        this.initSites();
        this.makeWeeks();
      });
    this.roomService.getAll()
      .subscribe((rooms: Room[]) => {
        this.rooms = rooms;
      });
    this.scheduleService.getSchedulesInCurrentTerm()
      .subscribe((schedules: Schedule[]) => {
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
          // console.log('clazzIds', clazzIds);
          this.screenedClazzes = this.clazzes.filter(clazz => !clazzIds.includes(clazz.id));
        }, error => {
          // console.log('error', error);
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
  private makeSites(): void {
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
    this.initSites();
    this.initTimes();
    console.log('makeTimesAndSites', this.times, this.sites);
    this.makeSites();
    this.makeTimes();
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
      if (schedule.teacher1.id === teacher1Id || schedule.teacher2.id === teacher1Id) {
        schedule.dispatches.forEach((dispatch: Dispatch) => {
          this.conflictTimesOfTeacher1.push({day: dispatch.day!, lesson: dispatch.lesson!, week: dispatch.week!});
        });
      }
    });
    // console.log('teacher1Id', this.conflictTimesOfTeacher1);
  }

  private makeConflictTimesOfTeacher2(): void {
    const teacher2Id = +this.formGroup.get('teacher2Id')?.value;
    this.schedules.forEach((schedule: Schedule) => {
      if (schedule.teacher2.id === teacher2Id || schedule.teacher1.id === teacher2Id) {
        schedule.dispatches.forEach((dispatch: Dispatch) => {
          this.conflictTimesOfTeacher2.push({day: dispatch.day!, lesson: dispatch.lesson!, week: dispatch.week!});
        });
      }
    });
    // console.log('teacher2Id', this.conflictTimesOfTeacher2);
  }

  private makeConflictSites(): void {
    this.conflictSites.forEach(conflictSite => {
      this.sites[conflictSite.day][conflictSite.lesson][conflictSite.week].concat(conflictSite.roomIds);
    });
  }

  private makeTimes(): void {
    console.log('123123', [...this.conflictTimesOfClazzes], [...this.conflictTimesOfTeacher1], [...this.conflictTimesOfTeacher2]);
    this.conflictTimesOfClazzes.forEach(conflictTime => {
      this.times[conflictTime.day][conflictTime.lesson][conflictTime.week] = false;
    });
    this.conflictTimesOfTeacher1.forEach(conflictTime => {
      this.times[conflictTime.day][conflictTime.lesson][conflictTime.week] = false;
    });
    this.conflictTimesOfTeacher2.forEach(conflictTime => {
      this.times[conflictTime.day][conflictTime.lesson][conflictTime.week] = false;
    });
  }

  private makeWeeks(): void {
    this.weeks = Array.from(new Array(this.weekNumber).keys());
  }


  onWeekChange(week: number): void {
    if (this.pattern) {
      // // 在模式 true 下，切换week时保存数据
      // this.updateTempData();
      this.week = week;
      console.log(this.tempData[this.week]);
      this.selectedRooms = [];
      this.selectedRooms = this.tempData[this.week!].filter(() => true);
    } else {
      this.changeSelectedWeeks(week);
    }
    console.log('onWeekChange', this.selectedData);
  }

  changeSelectedWeeks(week: number): void {
    console.log('changeSelectedWeeks', week);
    if (!this.selectedWeeks.includes(week)) {
      this.selectedWeeks.push(week);
      this.smLessons.forEach(smLesson => {
        console.log('this.sites', this.sites[this.day!][this.bigLesson! * 2 + smLesson][week]);
        this.disabledRooms = this.disabledRooms.concat(this.sites[this.day!][this.bigLesson! * 2 + smLesson][week]);
      });
    } else {
      this.selectedWeeks.splice(this.selectedWeeks.indexOf(week), 1);
      this.smLessons.forEach(smLesson => {
        this.sites[this.day!][this.bigLesson! * 2 + smLesson][week].forEach(roomId => {
          this.disabledRooms.splice(this.disabledRooms.indexOf(roomId), 1);
        });
      });
    }
  }

  onSmLessonsChange(smLesson: number): void {
    if (!this.smLessons.includes(smLesson)) {
      this.smLessons.push(smLesson);
    } else {
      this.smLessons.splice(this.smLessons.indexOf(smLesson), 1);
    }
  }

  onIsSmLessonsDetermineChange(): void {
    this.isSmLessonsDetermine = !this.isSmLessonsDetermine;
  }

  onRoomChange(roomId: number): void {

    if (this.pattern) {
      this.updateTempData();
      if (!this.selectedRooms.includes(roomId)) {
        this.selectedRooms.push(roomId);
      } else {
        this.selectedRooms.splice(this.selectedRooms.indexOf(roomId), 1);
      }
    } else {
      if (!this.selectedRooms.includes(roomId)) {
        this.selectedRooms.push(roomId);
        this.smLessons.forEach(smLesson => {
          const weekObjects = this.sites[this.day!][this.bigLesson! * 2 + smLesson];
          for (let i = 0; i < weekObjects.length; i++) {
            if (weekObjects[i].includes(roomId)) {
              this.disabledWeeks.push(i);
            }
          }
        });
      } else {
        this.selectedRooms.splice(this.selectedRooms.indexOf(roomId), 1);
        this.smLessons.forEach(smLesson => {
          const weekObjects = this.sites[this.day!][this.bigLesson! * 2 + smLesson];
          for (let i = 0; i < weekObjects.length; i++) {
            if (weekObjects[i].includes(roomId)) {
              this.disabledWeeks.splice(this.disabledWeeks.indexOf(i), 1);
            }
          }
        });
      }
    }
  }


  /**
   * 保存数据
   */
  private updateTempData(): void {
    this.tempData[this.week!] = [];
    this.selectedRooms.forEach((room) => {
      this.tempData[this.week!].push(room);
    });
    console.log('保存saveTempData', this.tempData[this.week!]);
  }

  isRoomChecked(roomId: number): boolean {
    return this.selectedRooms.includes(roomId);
  }

  private makeTempData(): void {
    console.log('makeTempData', this.selectedData);
    const smLessons = this.smLessonsRecorder[this.day!][this.bigLesson!];
    this.selectedData.forEach((data) => {
      const bigLesson = data.smLesson === 11 ? 4 : Math.floor(data.smLesson / 2);
      if (data.day === this.day && bigLesson === this.bigLesson) {
        this.tempData[data.week] = data.roomIds;
      }
    });
    this.smLessons = smLessons;
  }

  updatePattern(pattern: boolean): void {
    this.pattern = pattern;
    this.initTempData();
    this.selectedData = [];
    this.selectedRooms = [];
    this.selectedWeeks = [];
    this.week = undefined;
  }

  private deleteSelectedData(): void {
    this.selectedData = this.selectedData.filter(data => {
      const bigLesson = data.smLesson === 11 ? 4 : Math.floor(data.smLesson / 2);
      return !(data.day === this.day && bigLesson === this.bigLesson);
    });
  }

  canSave(): boolean {
    if (this.pattern) {
      // 如果所有周对应教室都是空，那就不能保存
      let isHave = false;
      this.tempData.forEach(week => {
        if (week.length !== 0) {
          isHave = true;
        }
      });
      return isHave;
    } else {
      let status = true;
      if (this.selectedWeeks.length === 0 || this.selectedRooms.length === 0) {
        status = false;
      }
      return status;
    }
  }

  isWeekDisabled(week: number): boolean {
    let status = false;
    // @ts-ignore
    this.smLessons.forEach((smLesson: number) => {
      if (!this.times[this.day!][this.bigLesson! * 2 + smLesson][week]) {
        console.log('456', this.day + '', this.bigLesson! * 2 + smLesson + '', week + '');
        status = true;
      }
    });
    if (!this.pattern) {
      return status || this.disabledWeeks.includes(week);
    }
    return status;
  }

  isRoomDisabled(roomId: number): boolean {
    if (this.pattern) {
      let status = false;
      // @ts-ignore
      this.smLessons.forEach(smLesson => {
        if (this.sites[this.day!][smLesson][this.week!].includes(roomId)) {
          status = true;
        }
      });
      return status;
    } else {
      return this.disabledRooms.includes(roomId);
    }
  }

  isShowTimeSelect(): boolean {
    return !this.formGroup.invalid &&
      !this.isTeacherSame &&
      this.formGroup.get('teacher1Id')?.value !== 'null' &&
      this.formGroup.get('teacher2Id')?.value !== 'null';
  }
}
