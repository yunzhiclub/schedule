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
import {CommonService} from '../../../service/common.service';
import {Router} from '@angular/router';

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
  // 选择的时间地点
  selectedData: {day: number, smLesson: number, week: number, roomIds: number[]}[] = [];
  // 临时时间地点 定制模式使用
  tempData: number[][] = [];
  // 记录每个天节的smLessons
  smLessonsRecorder = [] as number[][][];
  // 记录每个天节的时间选择模式: true 定制选择 | false 同步选择 默认为定制选择
  syncRecorder: (boolean)[][] = [];


  /* 所有课程 */
  courses =  []  as Course[];
  /* 当前课程 */
  course: Course | undefined;
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
  // 已经过去的周
  overtimeWeekNumber: number | undefined;
  // 选择的教室
  selectedRooms = [] as number[];
  // 周记录器
  weeksRecorder = [] as number[][][];
  // 教室记录器 同步模式使用
  roomsRecorder = [] as number[][][];
  // 不可用的周
  disabledWeeks = [] as number[];
  // 不可用的教室
  disabledRooms = [] as number[];
  // 是否小结确定
  isSmLessonsDetermine = false;
  // 定制模式下非空的周
  notEmptyWeeks = [] as number[];

  constructor(private clazzService: ClazzService,
              private courseService: CourseService,
              private teacherService: TeacherService,
              private termService: TermService,
              private scheduleService: ScheduleService,
              private roomService: RoomService,
              private commonService: CommonService,
              private router: Router,
              ) { }

  ngOnInit(): void {
    // 初始化时间表
    this.initTimes();
    // 初始化地点表
    this.initSites();
    // 初始化smLessons记录器
    this.initSmLessonsRecorder();
    // 初始化模式记录器
    this.initSyncRecoder();
    // 初始化周和教室记录器，同步模式使用
    this.initWeeksAndRoomsRecoder();
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
  private initSyncRecoder(): void {
    for (let i = 0; i < 7; i++) {
      this.syncRecorder[i] = [];
      for (let j = 0; j < 5; j++) {
        this.syncRecorder[i][j] = true;
      }
    }
  }
  // 依赖本学期周数
  private initTempData(): void {
    for (let i = 0; i < this.weekNumber; i++) {
      this.tempData[i] = [] as number[];
    }
  }


  private initWeeksAndRoomsRecoder(): void {
    for (let i = 0; i < 7; i++) {
      this.weeksRecorder[i] = [];
      this.roomsRecorder[i] = [];
      for (let j = 0; j < 5; j++) {
        this.weeksRecorder[i][j] = [];
        this.roomsRecorder[i][j] = [];
      }
    }
  }

  /**
   * 订阅参数，各参数改变时修改其后置数据
   */
  private subscribeFormGroup(): void {
    this.formGroup.get('courseId')?.valueChanges.subscribe(() => {
      this.course = this.courses.filter(course => course.id === +this.formGroup.get('courseId')?.value)[0];
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
    if (!this.syncRecorder[this.day][this.bigLesson]) {
      // 同步模式
      this.weeksRecorder[this.day][this.bigLesson].forEach(week => {
        this.onWeekChange(week);
      });
      this.roomsRecorder[this.day][this.bigLesson].forEach(room => {
        this.onRoomChange(room);
      });
    } else {
      // 定制模式
      this.initTempData();
      this.makeTempData();
      this.notEmptyWeeks = [];
      this.makeNotEmptyWeeks();
    }
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
    this.notEmptyWeeks = [];
    this.initTempData();
  }


  /**
   * 保存数据并关闭model
   */
  save(): void {
    // 删除掉之前存的
    this.deleteSelectedData();
    if (this.syncRecorder[this.day!][this.bigLesson!]) {
      if (this.smLessons.length !== 0) {
        this.weeksRecorder[this.day!][this.bigLesson!] = [...this.notEmptyWeeks];
      } else {
        this.weeksRecorder[this.day!][this.bigLesson!] = [];
      }
      this.smLessons.forEach(smLesson => {
        for (let week = 0; week < this.tempData.length; week++) {
          if (this.tempData[week].length > 0) {
            this.selectedData.push({week, day: this.day!, smLesson: this.bigLesson! * 2 + smLesson, roomIds: this.tempData[week]});
          }
        }
      });
    } else {
      if (this.smLessons.length !== 0) {
        this.weeksRecorder[this.day!][this.bigLesson!] = [...this.selectedWeeks];
        this.roomsRecorder[this.day!][this.bigLesson!] = [...this.selectedRooms];
      } else {
        this.weeksRecorder[this.day!][this.bigLesson!] = [];
        this.roomsRecorder[this.day!][this.bigLesson!] = [];
      }
      this.smLessons.forEach(smLesson => {
        this.selectedWeeks.forEach(week => {
          this.selectedData.push({week, day: this.day!, smLesson: this.bigLesson! * 2 + smLesson, roomIds: this.selectedRooms});
        });
      });
    }
    this.smLessonsRecorder[this.day!][this.bigLesson!] = Array.from(this.smLessons);
    this.close();
  }

  private getData(): void {
    this.termService.getCurrentTerm()
      .subscribe((term: Term) => {
        this.commonService.checkTermIsActivated(term);
        this.term = term;
        let seconds = +term.endTime - +term.startTime;
        let days = Math.ceil(seconds / (60 * 60 * 24));
        this.weekNumber = Math.ceil(days / 7);
        const timestamp = Date.parse(new Date().toString()) / 1000;
        seconds = timestamp - +term.startTime;
        days = Math.floor(seconds / (60 * 60 * 24));
        this.overtimeWeekNumber = Math.floor(days / 7);
        this.initTimes();
        this.initSites();
        this.makeWeeks();
        this.makeWeeksAndRoomsRecoder();
        this.scheduleService.getSchedulesInCurrentTerm()
          .subscribe((schedules: Schedule[]) => {
            this.schedules = schedules;
          });
      });

    this.roomService.getAll()
      .subscribe((rooms: Room[]) => {
        this.rooms = rooms;
      });

    this.courseService.getAll()
      .subscribe(allCourse => {
        // A - Z 排序
        this.courses = this.commonService.sortByName(allCourse);
      });
    this.clazzService.getAll()
      .subscribe(allClazz => {
        this.clazzes = this.commonService.sortByName(allClazz);
      });
    this.teacherService.getAll()
      .subscribe(allTeacher => {
        this.teachers = this.commonService.sortByName(allTeacher);
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
          this.screenedClazzes = this.commonService.sortByName(this.clazzes.filter(clazz => !clazzIds.includes(clazz.id)));
        });
    }
  }
  // 需要 schedules clazzIds teacher1 teacher2
  private makeConflictTimes(): void {
    this.makeConflictTimesOfClazzes();
    this.makeConflictTimesOfTeacher1();
    this.makeConflictTimesOfTeacher2();
  }

  private makeWeeksAndRoomsRecoder(): void {
    this.selectedData.forEach((data) => {
      const bigLesson = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
      if (!this.weeksRecorder[data.day][bigLesson].includes(data.week)) {
        this.weeksRecorder[data.day][bigLesson].push(data.week);
      }
      if (this.roomsRecorder[data.day][bigLesson].length === 0) {
        this.roomsRecorder[data.day][bigLesson] = [...data.roomIds];
      }
    });
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
    this.makeSites();
    this.makeTimes();
  }

  isShowTeacher(): boolean {
    return !!(this.formGroup.get('clazzIds')?.valid
      && this.formGroup.get('clazzIds')?.value !== null
      && (this.formGroup.get('clazzIds')?.value?.length !== 0 && this.formGroup.get('clazzIds')?.value[0] !== null
      )
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
  }

  private makeTimes(): void {
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
    if (this.syncRecorder[this.day!][this.bigLesson!]) {
      // // 在模式 true 下，切换week时保存数据
      this.week = week;
      this.selectedRooms = [];
      this.selectedRooms = [...this.tempData[this.week!]];
    } else {
      this.changeSelectedWeeks(week);
    }
  }

  changeSelectedWeeks(week: number): void {
    // 不支持张三小节1在教室1上课，李四小节2在教室1上课
    const smLessons = this.bigLesson === 4 ? [0, 1, 2] : [0, 1];
    if (!this.selectedWeeks.includes(week)) {
      this.selectedWeeks.push(week);
      smLessons.forEach(smLesson => {
        this.disabledRooms = this.disabledRooms.concat(this.sites[this.day!][this.bigLesson! * 2 + smLesson][week]);
      });
    } else {
      this.selectedWeeks.splice(this.selectedWeeks.indexOf(week), 1);
      smLessons.forEach(smLesson => {
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

  onRoomChange(roomId: number): void {
    // 不支持张三小节1在教室1上课，李四小节2在教室1上课
    const smLessons = this.bigLesson === 4 ? [0, 1, 2] : [0, 1];
    if (this.syncRecorder[this.day!][this.bigLesson!]) {
      if (!this.selectedRooms.includes(roomId)) {
        this.selectedRooms.push(roomId);
      } else {
        this.selectedRooms.splice(this.selectedRooms.indexOf(roomId), 1);
      }
      this.updateTempData();
      this.notEmptyWeeks = [];
      this.makeNotEmptyWeeks();
    } else {
      if (!this.selectedRooms.includes(roomId)) {
        this.selectedRooms.push(roomId);
        smLessons.forEach(smLesson => {
          const weekObjects = this.sites[this.day!][this.bigLesson! * 2 + smLesson];
          for (let i = 0; i < weekObjects.length; i++) {
            if (weekObjects[i].includes(roomId)) {
              this.disabledWeeks.push(i);
            }
          }
        });
      } else {
        this.selectedRooms.splice(this.selectedRooms.indexOf(roomId), 1);
        smLessons.forEach(smLesson => {
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
  }

  isRoomChecked(roomId: number): boolean {
    return this.selectedRooms.includes(roomId);
  }

  private makeTempData(): void {
    this.smLessons = this.smLessonsRecorder[this.day!][this.bigLesson!];
    this.selectedData.forEach((data) => {
      const bigLesson = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
      if (data.day === this.day && bigLesson === this.bigLesson) {
        this.tempData[data.week] = data.roomIds;
      }
    });
  }

  private deleteSelectedData(): void {
    this.selectedData = this.selectedData.filter(data => {
      const bigLesson = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
      return !(data.day === this.day && bigLesson === this.bigLesson);
    });
  }

  canSave(): boolean {
    if (this.syncRecorder[this.day!][this.bigLesson!]) {
      return true;
    } else {
      let status = false;
      if ((this.selectedWeeks.length === 0 && this.selectedRooms.length === 0) ||
        (this.selectedWeeks.length !== 0 && this.selectedRooms.length !== 0)) {
        status = true;
      }
      return status;
    }
  }

  isWeekDisabled(week: number): boolean {
    if (week < this.overtimeWeekNumber!) {
      return true;
    }
    let status = false;
    // 不支持小节1选教室1/2， 小节2选教室3/4
    const smLessons = this.bigLesson === 4 ? [0, 1, 2] : [0, 1];
    // @ts-ignore
    smLessons.forEach((smLesson: number) => {
      if (!this.times[this.day!][this.bigLesson! * 2 + smLesson][week]) {
        status = true;
      }
    });
    if (!this.syncRecorder[this.day!][this.bigLesson!]) {
      return status || this.disabledWeeks.includes(week);
    }
    return status;
  }

  isRoomDisabled(roomId: number): boolean {
    if (this.syncRecorder[this.day!][this.bigLesson!]) {
      // 不支持张三小节1在教室1上课，李四小节2在教室1上课
      const smLessons = this.bigLesson === 4 ? [0, 1, 2] : [0, 1];
      let status = false;
      // @ts-ignore
      smLessons.forEach(smLesson => {
        if (this.sites[this.day!][this.bigLesson! * 2 + smLesson][this.week!].includes(roomId)) {
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

  onSubmit(): void {
    if (!this.canSubmit()) {
      this.commonService.confirm((confirm = false) => {
        if (confirm) {
          const course1 = new Course({id: this.formGroup.get('courseId')?.value});
          const clazzes1 = this.formGroup.get('clazzIds')?.value.map((clazzId: number) => {
            return new Clazz({id: clazzId});
          });
          const teacher1Id1 = this.formGroup.get('teacher1Id')?.value;
          const teacher2Id1 = this.formGroup.get('teacher2Id')?.value;
          const schedule1 = new Schedule();
          schedule1.course = course1;
          schedule1.clazzes = clazzes1;
          schedule1.term = this.term;
          schedule1.teacher1 = new Teacher({id: teacher1Id1});
          schedule1.teacher2 = new Teacher({id: teacher2Id1});
          this.selectedData.forEach((data) => {
            const rooms = data.roomIds.map(roomId => {
              return new Room({id: roomId});
            });
            schedule1.dispatches.push(new Dispatch({day: data.day, lesson: data.smLesson, week: data.week, rooms}));
          });
          this.scheduleService.add(schedule1)
            .subscribe(() => {
              this.commonService.success(() => this.router.navigateByUrl('/schedule'));
            });
        } else {
          return ;
        }
      }, '当前学时与课程学时不相等，确定要保存吗？');
      return ;
    }
    const course = new Course({id: this.formGroup.get('courseId')?.value});
    const clazzes = this.formGroup.get('clazzIds')?.value.map((clazzId: number) => {
      return new Clazz({id: clazzId});
    });
    const teacher1Id = this.formGroup.get('teacher1Id')?.value;
    const teacher2Id = this.formGroup.get('teacher2Id')?.value;
    const schedule = new Schedule();
    schedule.course = course;
    schedule.clazzes = clazzes;
    schedule.term = this.term;
    schedule.teacher1 = new Teacher({id: teacher1Id});
    schedule.teacher2 = new Teacher({id: teacher2Id});
    this.selectedData.forEach((data) => {
      const rooms = data.roomIds.map(roomId => {
        return new Room({id: roomId});
      });
      schedule.dispatches.push(new Dispatch({day: data.day, lesson: data.smLesson, week: data.week, rooms}));
    });
    this.scheduleService.add(schedule)
      .subscribe(() => {
        this.commonService.success(() => this.router.navigateByUrl('/schedule'));
      });
  }

  canSubmit(): boolean {
    const courseId: number = +this.formGroup.get('courseId')?.value;
    const course = this.courses.filter(cou => cou.id === courseId)[0];
    return this.selectedData.length === +course.hours!;
  }

  buttonActive(day: number, bigLesson: number): boolean {
    // if (this.pattern) {
    //   // 定制模式下 selecteddata 中是否存在当前天节的数据 存在返回ture 不存在返回false
    //   let status = false;
    //   this.selectedData.forEach(data => {
    //     const bigLessonOfData = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
    //     if (data.day === day && bigLesson === bigLessonOfData) {
    //       status = true;
    //     }
    //   });
    //   return status;
    // } else {
      return this.weeksRecorder[day][bigLesson].length !== 0;
    // }
  }

  private makeNotEmptyWeeks(): void {
    for (let i = 0; i < this.weekNumber; i++) {
      if (this.tempData[i].length !== 0) {
        if (!this.notEmptyWeeks.includes(i)) {
          this.notEmptyWeeks.push(i);
        }
      }
    }
  }

  getNotEmptyWeeks(): string {
    let arr;
    if (this.syncRecorder[this.day!][this.bigLesson!]) {
      arr = this.notEmptyWeeks;
    } else {
      arr = this.selectedWeeks;
    }
    return arr.map(week => (week + 1)).sort((a, b) => a - b).join('、');
  }

  isAllWeekChecked(): boolean {
    return this.selectedWeeks.length === this.getEffectiveWeeks().length;
  }

  checkAllWeek(): void {
    const effectiveWeeks = this.getEffectiveWeeks();
    if (this.selectedWeeks.length !== effectiveWeeks.length) {
      if (!this.syncRecorder[this.day!][this.bigLesson!]) {
        effectiveWeeks.forEach(w => {
          if (!this.selectedWeeks.includes(w)) {
            this.onWeekChange(w);
          }
        });
      }
    } else {
      effectiveWeeks.forEach(week => {
        this.onWeekChange(week);
      });
    }
  }
  private getEffectiveWeeks(): number[] {
    return this.weeks.filter(w => this.overtimeWeekNumber! <= w)
      .filter(w => !this.isWeekDisabled(w));
  }

  getWeeksForShow(day: number, bigLesson: number): number[] {
    return this.weeksRecorder[day][bigLesson].sort((a, b) => a - b);
  }

  onSync(): void {
    this.syncRecorder[this.day!][this.bigLesson!] = !this.syncRecorder[this.day!][this.bigLesson!];
    if (!this.syncRecorder[this.day!][this.bigLesson!]) {
      // 取反后是同步模式
      // 如果之前的数据是空
      if (this.notEmptyWeeks.length === 0) {
        this.selectedWeeks = [];
        this.selectedRooms = [];
      } else {
        // 如果之前的数据是多个周，存在不同的周不同的教室
        // 如果之前的数据是多个周，不存在不同的周不同的教室
        if (this.isArrayHasNotEqualArray(this.tempData)) {
          this.selectedWeeks = this.notEmptyWeeks;
          this.selectedRooms = [];
        } else {
          this.selectedWeeks = this.notEmptyWeeks;
          this.selectedRooms = [...this.tempData[this.notEmptyWeeks[0]]];
        }
      }
      // 防止显示出错
      this.week = undefined;
      this.initTempData();
      this.notEmptyWeeks = [];
    } else {
      // 取反后是定制模式(如果是同步模式切换到定制模式，当没有已选中教室则从selectedData获取)
      if (this.selectedRooms.length > 0) {
        this.notEmptyWeeks = [...this.selectedWeeks];
        this.selectedWeeks.forEach(week => {
          this.tempData[week] = [...this.selectedRooms]; // 每个周对应不同， 必须用 ...
        });
      } else {
        this.makeTempData();
        this.makeNotEmptyWeeks();
      }
      // 防止显示出错
      this.selectedWeeks = [];
    }
  }

  isArrayHasNotEqualArray(arr: number[][]): boolean {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i].length > 0 && arr[j].length > 0 && !this.isArrayEqual(arr[i], arr[j])) {
          return true;
        }
      }
    }
    return false;
  }

  isArrayEqual(arr1: number[], arr2: number[]): boolean {
    return arr1.length === arr2.length && arr1.sort().toString() === arr2.sort().toString();
  }

  getWeeks(weeksForShow: number[]): string {
    return this.commonService.getWeeksForTimetable(weeksForShow);
  }

  isBeContained(w: number): boolean {
    return this.syncRecorder[this.day!][this.bigLesson!] && (w !== this.week) && this.notEmptyWeeks.includes(w);
  }
}
