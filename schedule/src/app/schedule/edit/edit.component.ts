import {Component, OnInit} from '@angular/core';
import {config} from '../../../conf/app.config';
import {Teacher} from '../../../entity/teacher';
import {Schedule} from '../../../entity/schedule';
import {Room} from '../../../entity/room';
import {Clazz} from '../../../entity/clazz';
import {Term} from '../../../entity/term';
import {ClazzService} from '../../../service/clazz.service';
import {CourseService} from '../../../service/course.service';
import {TeacherService} from '../../../service/teacher.service';
import {TermService} from '../../../service/term.service';
import {ScheduleService} from '../../../service/schedule.service';
import {RoomService} from '../../../service/room.service';
import {CommonService} from '../../../service/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Dispatch} from '../../../entity/dispatch';
import {Course} from '../../../entity/course';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  weekNumber = config.weekNumber;
  schedule = {} as Schedule;
  scheduleId: number | undefined;
  clazzIds = [] as number[];
  teacher1 = {} as Teacher;
  teacher2 = {} as Teacher;
  course = {} as Course;
  dispatches = [] as Dispatch[];
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
  // 临时时间地点
  tempData: number[][] = [];
  // 记录每个天节的smLessons
  smLessonsRecorder = [] as number[][][];
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
  // 周记录器 同步模式使用
  weeksRecorder = [] as number[][][];
  // 教室记录器 同步模式使用
  roomsRecorder = [] as number[][][];
  // 不可用的周
  disabledWeeks = [] as number[];
  // 不可用的教室
  disabledRooms = [] as number[];
  // 时间选择模式: true 分别选择 | false 同步选择 默认为同步选择
  pattern = false;
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
              private route: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.scheduleId = this.route.snapshot.params.id;
    // 初始化时间表
    this.initTimes();
    // 初始化地点表
    this.initSites();
    // 初始化smLessons记录器
    this.initSmLessonsRecorder();
    // 初始化周和教室记录器，同步模式使用
    this.initWeeksAndRoomsRecoder();
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
   * 展示model
   * @param day 天
   * @param bigLesson 大节
   */
  showModel(day: number, bigLesson: number): void {
    console.log('showModel1', [...this.weeksRecorder], [...this.roomsRecorder]);
    this.day = day;
    this.bigLesson = bigLesson;
    this.initTempData();
    this.makeTempData();
    // this.makeNotEmptyWeeks(); // notEmptyWeeks定制模式下用来提示用户
    // 同步模式
    if (!this.pattern) {
      this.selectedWeeks = [...this.weeksRecorder[this.day][this.bigLesson]];
      this.selectedRooms = [...this.roomsRecorder[this.day][this.bigLesson]];
    } else {
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
    this.initTempData();
  }
  /**
   * 保存数据并关闭model
   */
  save(): void {
    this.deleteSelectedData();
    console.log('save1', [...this.selectedData]);
    if (this.pattern) {
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
      console.log('save2', [...this.smLessons], [...this.selectedWeeks], [...this.selectedData]);
      this.smLessons.forEach(smLesson => {
        this.selectedWeeks.forEach(week => {
          this.selectedData.push({week, day: this.day!, smLesson: this.bigLesson! * 2 + smLesson, roomIds: this.selectedRooms});
        });
      });
    }
    this.smLessonsRecorder[this.day!][this.bigLesson!] = Array.from(this.smLessons);
    this.close();
    console.log('save3', [...this.selectedData], [...this.smLessons]);
  }
  private getData(): void {
    this.scheduleService.getById(this.scheduleId!)
      .subscribe((schedule) => {
        this.schedule = schedule;
        this.clazzIds = schedule.clazzes.map(clazz => clazz.id);
        this.teacher1 = schedule.teacher1;
        this.teacher2 = schedule.teacher2;
        this.course = schedule.course;
        this.dispatches = schedule.dispatches;
        this.term = schedule.term;
        this.makeSelectedData();
        this.validateData();
        this.makeWeeksAndRoomsRecoder();
        this.makeSmLessonsRecorder();
        console.log('getData', [...this.weeksRecorder], [...this.roomsRecorder]);

        const term = this.term;
        let seconds = +term.endTime - +term.startTime;
        let days = Math.ceil(seconds / (60 * 60 * 24));
        this.weekNumber = Math.ceil(days / 7);
        const timestamp = Date.parse(new Date().toString()) / 1000;
        seconds = timestamp - +term.startTime;
        days = Math.floor(seconds / (60 * 60 * 24));
        this.overtimeWeekNumber = Math.floor(days / 7);
        this.makeWeeks();
        this.scheduleService.getSchedulesByTerm(term)
          .subscribe((schedules: Schedule[]) => {
            this.schedules = schedules;
            this.makeTimesAndSites();
          });

      });
    this.roomService.getAll()
      .subscribe((rooms: Room[]) => {
        this.rooms = rooms;
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
    this.makeSites();
    this.makeConflictTimes();
    this.makeTimes();
    this.updateTimesAndSitesBySchedule();
  }
  /**
   *  生成班级冲突时间
   */
  private makeConflictTimesOfClazzes(): void {
    const clazzIds: number[] = this.clazzIds;
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
    const teacher1Id = this.teacher1.id;
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
    const teacher2Id = this.teacher2.id;
    this.schedules.forEach((schedule: Schedule) => {
      if (schedule.teacher2.id === teacher2Id || schedule.teacher1.id === teacher2Id) {
        schedule.dispatches.forEach((dispatch: Dispatch) => {
          this.conflictTimesOfTeacher2.push({day: dispatch.day!, lesson: dispatch.lesson!, week: dispatch.week!});
        });
      }
    });
    // console.log('teacher2Id', this.conflictTimesOfTeacher2);
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
  private updateTimesAndSitesBySchedule(): void {
    this.selectedData.forEach(data => {
      this.times[data.day][data.smLesson][data.week] = true;
      data.roomIds.forEach(roomId => {
        this.sites[data.day][data.smLesson][data.week]
          .splice(this.sites[data.day][data.smLesson][data.week].indexOf(roomId), 1);
      });
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
    console.log('12123132123312', [...this.selectedWeeks], [...this.disabledRooms]);
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
    // 不支持张三小节1在教室1上课，李四小节2在教室1上课
    const smLessons = this.bigLesson === 4 ? [0, 1, 2] : [0, 1];
    if (this.pattern) {
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
    console.log('保存saveTempData', this.tempData[this.week!]);
  }
  isRoomChecked(roomId: number): boolean {
    return this.selectedRooms.includes(roomId);
  }
  private makeTempData(): void {
    const smLessons = this.smLessonsRecorder[this.day!][this.bigLesson!];
    this.selectedData.forEach((data) => {
      const bigLesson = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
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
    this.makeSelectedData();
    this.selectedRooms = [];
    this.selectedWeeks = [];
    this.week = undefined;
    if (!this.pattern) {
      this.validateData();
    }
  }
  private deleteSelectedData(): void {
    this.selectedData = this.selectedData.filter(data => {
      const bigLesson = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
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
    if (!this.pattern) {
      return status || this.disabledWeeks.includes(week);
    }
    return status;
  }
  isRoomDisabled(roomId: number): boolean {
    if (this.pattern) {
      // 不支持张三小节1在教室1上课，李四小节2在教室1上课
      const smLessons = this.bigLesson === 4 ? [0, 1, 2] : [0, 1];
      let status = false;
      console.log('isRoomDisabled', [...this.sites]);
      // todo: this.week尚未选择便渲染 全选按钮 见 593:45
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
  onSubmit(): void {
    const dispatches = [] as Dispatch[];
    this.selectedData.forEach((data) => {
      const rooms = data.roomIds.map(roomId => {
        return new Room({id: roomId});
      });
      dispatches.push(new Dispatch({day: data.day, lesson: data.smLesson, week: data.week, rooms}));
    });
    this.schedule.dispatches = dispatches;
    this.scheduleService.edit(this.schedule.id, dispatches)
      .subscribe((schedule) => {
        console.log('edit submit', schedule);
        this.commonService.success(() => this.router.navigateByUrl('/schedule'));
      });
  }
  private makeSelectedData(): void {
    this.dispatches.forEach(dispatch => {
      const roomIds = dispatch.rooms.map(room => room.id!);
      this.selectedData.push({day: dispatch.day!, smLesson: dispatch.lesson!, week: dispatch.week!, roomIds});
    });
  }
  // 当前系统在存入时规定同一大节只能上部分小结或者都上，不能不同小节在不同时间，在不同地点
  private makeSmLessonsRecorder(): void {
    this.selectedData.forEach((data) => {
      const bigLesson = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
      this.smLessonsRecorder[data.day][bigLesson] = [];
    });
    this.selectedData.forEach((data) => {
      const bigLesson = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
      const smLesson = data.smLesson - bigLesson * 2;
      if (!this.smLessonsRecorder[data.day][bigLesson].includes(smLesson)) {
        this.smLessonsRecorder[data.day][bigLesson].push(smLesson);
      }
    });
  }
  /**
   * 对selectedData进行验证，确保不存在类似于第一周在教室1/2上课，第二周在教室3/4上课的情况
   */
  private validateData(): void {
    // true代表数据正确
    let status = true;
    this.selectedData.forEach(data1 => {
      const bigLesson1 = data1.smLesson === 10 ? 4 : Math.floor(data1.smLesson / 2);
      this.selectedData.forEach(data2 => {
        const bigLesson2 = data2.smLesson === 10 ? 4 : Math.floor(data2.smLesson / 2);
        if (status && (data1.day === data2.day) && (bigLesson1 === bigLesson2)) {
          // 判断数组是否相等
          const roomIds1 = data1.roomIds;
          const roomIds2 = data2.roomIds;
          status = (roomIds1.length === roomIds2.length) &&
            (roomIds1.filter(t => roomIds2.includes(t)).length === roomIds1.length);
        }
      });
    });
    if (!status && !this.pattern) {
      this.pattern = true;
      this.commonService.info(() => {}, '当前数据不支持同步模式，已自动为您切换为定制模式');
    }
  }
  /**
   * 同步模式使用
   */
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
  canSubmit(): boolean {
    const course = this.course;
    return this.selectedData.length === +course.hours!;
  }
  buttonActive(day: number, bigLesson: number): boolean {
    if (this.pattern) {
      let status = false;
      this.selectedData.forEach(data => {
        const bigLessonOfData = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
        if (data.day === day && bigLesson === bigLessonOfData) {
          status = true;
        }
      });
      return status;
    } else {
      return this.weeksRecorder[day][bigLesson].length !== 0;
    }
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
    return this.notEmptyWeeks.map(week => (week + 1)).join('、');
  }
  isAllWeekChecked(): boolean {
    return this.selectedWeeks.length === this.getEffectiveWeeks().length;
  }
  isAllRoomChecked(): boolean {
    return this.selectedRooms.length === this.getEffectiveRooms().length;
  }
  checkAllWeek(): void {
    const effectiveWeeks = this.getEffectiveWeeks();
    if (this.selectedWeeks.length !== effectiveWeeks.length) {
      if (!this.pattern) {
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
  checkAllRoom(): void {
    const effectiveRooms = this.getEffectiveRooms();
    if (Array.from(new Set(this.selectedRooms)).length !== effectiveRooms.length) {
      console.log('checkAllRoom2', Array.from(new Set(this.selectedRooms)), effectiveRooms);
      effectiveRooms.forEach(roomId => {
        if (!this.selectedRooms.includes(roomId)) {
          this.onRoomChange(roomId);
        }
      });
    } else {
      [...this.selectedRooms].forEach(roomId => {
        this.onRoomChange(roomId);
      });
    }
  }
  private getEffectiveWeeks(): number[] {
    return this.weeks.filter(w => this.overtimeWeekNumber! <= w)
      .filter(w => !this.isWeekDisabled(w));
  }
  private getEffectiveRooms(): number[] {
    return this.rooms
      .filter(room => !this.isRoomDisabled(room.id!))
      .map(room => room.id!);
  }

  getWeeksForShow(day: number, bigLesson: number): string {
    return this.weeksRecorder[day][bigLesson].map(week => week + 1).join('、');
  }
}
