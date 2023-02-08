import { Component, OnInit } from '@angular/core';
import {config} from '../../../conf/app.config';
import {Schedule} from '../../../entity/schedule';
import {Teacher} from '../../../entity/teacher';
import {Course} from '../../../entity/course';
import {Dispatch} from '../../../entity/dispatch';
import {Room} from '../../../entity/room';
import {Term} from '../../../entity/term';
import {ClazzService} from '../../../service/clazz.service';
import {CourseService} from '../../../service/course.service';
import {TeacherService} from '../../../service/teacher.service';
import {TermService} from '../../../service/term.service';
import {ScheduleService} from '../../../service/schedule.service';
import {RoomService} from '../../../service/room.service';
import {CommonService} from '../../../service/common.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {
  weekNumber = config.weekNumber;
  schedule = {} as Schedule;
  room = {} as Room;
  roomId: number | undefined;
  clazzIds = [] as number[];
  teacher1 = {} as Teacher;
  teacher2 = {} as Teacher;
  course = {} as Course;
  dispatches = [] as Dispatch[];
  filteredDispatches = [] as Dispatch[]; // 当前学期的调度

  // 占用情况对应数据
  selectedData: {day: number, smLesson: number, week: number, schedule: Schedule}[] = [];
  // 当前天节对应的每周排课
  currentData: Schedule[] = [];
  // 记录每个天节的smLessons
  smLessonsRecorder = [] as number[][][][];

  // v层循环用
  bigLessons = [0, 1, 2, 3, 4];
  days = ['一', '二', '三', '四', '五', '六', '日'];

  // 当前学期
  term = {} as Term;
  // 当前天
  day: number | undefined;
  // 当前节( < 5 的大节)
  bigLesson: number | undefined;
  // 当前周
  week: number | undefined;
  // 周
  weeks: number[] = [];
  // 非空的周 for table
  notEmptyWeeksTable = [] as number[][][];

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
    this.roomId = this.route.snapshot.params.roomId;
    this.roomService.getForRoomDetail(this.roomId)
      .subscribe((room) => {
        this.room = room;
        this.dispatches = room.dispatches;
        this.termService.getCurrentTerm()
          .subscribe((currentTerm) => {
            if (currentTerm === undefined || currentTerm === null) {
              this.commonService.info(() => {
                this.router.navigateByUrl('/room');
              }, '当前无激活学期');
            }
            this.term = currentTerm;
            const seconds = +currentTerm.endTime - +currentTerm.startTime;
            const days = Math.ceil(seconds / (60 * 60 * 24));
            this.weekNumber = Math.ceil(days / 7);
            this.makeFilteredDispatches();
            this.makeSelectedData();
            this.makeSmLessonsRecorder();
            this.makeNotEmptyWeeksTable();
            this.makeWeeks();
          });
      });
  }

  private initSmLessonsRecorder(): void {
    for (let i = 0; i < 7; i++) {
      this.smLessonsRecorder[i] = [];
      for (let j = 0; j < 5; j++) {
        this.smLessonsRecorder[i][j] = [];
        for (let k = 0; k < this.weekNumber; k++) {
          this.smLessonsRecorder[i][j][k] = [];
        }
      }
    }
  }

  private initNotEmptyWeeksTable(): void {
    for (let i = 0; i < 7; i++) {
      this.notEmptyWeeksTable[i] = [];
      for (let j = 0; j < 5; j++) {
        this.notEmptyWeeksTable[i][j] = [];
      }
    }
  }
  private initCurrentData(): void {
    this.currentData = Array.from(new Array(this.weekNumber));
  }
  private makeCurrentData(): void {
    this.initCurrentData();
    this.selectedData.forEach(data => {
      const bigLesson = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
      if (data.day === this.day && bigLesson === this.bigLesson) {
        this.currentData[data.week] = data.schedule;
      }
    });
  }


  private makeNotEmptyWeeksTable(): void {
    this.initNotEmptyWeeksTable();
    this.selectedData.forEach(data => {
      const bigLesson = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
      if (!this.notEmptyWeeksTable[data.day][bigLesson].includes(data.week)) {
        this.notEmptyWeeksTable[data.day][bigLesson].push(data.week);
      }
    });
  }
  private makeWeeks(): void {
    this.weeks = Array.from(new Array(this.weekNumber).keys());
  }

  private makeFilteredDispatches(): void {
    this.filteredDispatches = this.dispatches.filter(dispatch => dispatch.schedule.term.id === this.term.id);
  }

  private makeSelectedData(): void {
    this.filteredDispatches.forEach(dispatch => {
      this.selectedData.push({day: dispatch.day!, smLesson: dispatch.lesson!, week: dispatch.week!, schedule: dispatch.schedule});
    });
  }

  // 当前系统在存入时规定同一大节只能上部分小结或者都上，不能不同小节在不同时间，在不同地点
  private makeSmLessonsRecorder(): void {
    this.initSmLessonsRecorder();
    this.selectedData.forEach((data) => {
      const bigLesson = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
      this.smLessonsRecorder[data.day][bigLesson][data.week] = [];
    });
    this.selectedData.forEach((data) => {
      const bigLesson = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
      const smLesson = data.smLesson - bigLesson * 2;
      if (!this.smLessonsRecorder[data.day][bigLesson][data.week].includes(smLesson)) {
        this.smLessonsRecorder[data.day][bigLesson][data.week].push(smLesson);
      }
    });
  }

  buttonActive(day: number, bigLesson: number): boolean {
    let status = false;
    this.selectedData.forEach(data => {
      const bigLessonOfData = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
      if (data.day === day && bigLesson === bigLessonOfData) {
        status = true;
      }
    });
    return status;
  }
  /**
   * 展示model
   * @param day 天
   * @param bigLesson 大节
   */
  showModel(day: number, bigLesson: number): void {
    this.day = day;
    this.bigLesson = bigLesson;
    this.makeCurrentData();
  }

  getNotEmptyWeeksOfTable(day: number, bigLesson: number): string {
    return this.notEmptyWeeksTable[day][bigLesson].map(week => week + 1).sort((a, b) => a - b).join('、');
  }

  getCourseName(week: number): string {
    const data = this.currentData[week];
    if (data) {
      return data.course.name + '';
    }
    return '';
  }
  getTeachersName(week: number): string {
    const data = this.currentData[week];
    if (data) {
      return (data.teacher1.name ? data.teacher1.name : '-') + '、' + (data.teacher2.name ? data.teacher2.name : '-');
    }
    return '';
  }

  getClazzesName(week: number): string {
    const data = this.currentData[week];
    if (data) {
      const names = data.clazzes.map(clazz => clazz.name);
      return names.join('、');
    }
    return '';
  }

  getSmLessons(week: number): string {
    const smLessonsIndex = this.smLessonsRecorder[this.day!][this.bigLesson!][week];
    if (smLessonsIndex.length > 0) {
      return '第' + smLessonsIndex.map(index => index + 1 + this.bigLesson! * 2).sort((a, b) => a - b).join('、') + '小节';
    }
    return '';
  }
}
