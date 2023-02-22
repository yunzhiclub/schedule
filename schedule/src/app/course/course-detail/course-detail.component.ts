import { Component, OnInit } from '@angular/core';
import {Schedule} from '../../../entity/schedule';
import {Term} from '../../../entity/term';
import {config} from '../../../conf/app.config';
import {Course} from '../../../entity/course';
import {ClazzService} from '../../../service/clazz.service';
import {CourseService} from '../../../service/course.service';
import {TeacherService} from '../../../service/teacher.service';
import {TermService} from '../../../service/term.service';
import {ScheduleService} from '../../../service/schedule.service';
import {RoomService} from '../../../service/room.service';
import {CommonService} from '../../../service/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Dispatch} from '../../../entity/dispatch';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  course = {} as Course;
  courseId: number | undefined;
  weekNumber = config.weekNumber;
  // v层循环用
  bigLessons = [0, 1, 2, 3, 4];
  days = ['一', '二', '三', '四', '五', '六', '日'];
  // 非空的周
  notEmptyWeeksTable = [] as number[][][];
  // 占用情况对应数据
  selectedData: {day: number, smLesson: number, week: number, schedule: Schedule}[] = [];
  // 当前天节对应的每周排课
  currentData: Schedule[][] = [];
  dispatches = [] as Dispatch[];
  schedules = [] as Schedule[];

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
    this.initData();
    const courseId = this.route.snapshot.params.courseId;
    this.courseId = courseId;
    this.courseService.getForCourseDetail(courseId)
      .subscribe((course) => {
        console.warn('getForCourseDetail', course);
        this.schedules = course.schedules;
        this.termService.getAll()
          .subscribe(allTerms => {
            let x = 0;
            for (const term of allTerms) {
              if (term.state === true) {
                x++;
              }
            }
            if (x <= 1) {
              this.termService.getCurrentTerm()
                .subscribe((currentTerm) => {
                  if (currentTerm === undefined || currentTerm === null) {
                    this.commonService.info(() => {
                      this.router.navigateByUrl('/course').then();
                    }, '当前无激活学期');
                  }
                  this.term = currentTerm;
                  const seconds = +currentTerm.endTime - +currentTerm.startTime;
                  const days = Math.ceil(seconds / (60 * 60 * 24));
                  this.weekNumber = Math.ceil(days / 7);
                  this.makeSelectedData();
                  this.makeNotEmptyWeeksTable();
                  this.makeWeeks();
                });
            } else {
              this.commonService.info(() => this.router.navigateByUrl('course'), '获取到多个激活学期,请检查学期管理');
            }
          });
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
  getNotEmptyWeeksOfTable(day: number, bigLesson: number): number[] {
    return this.notEmptyWeeksTable[day][bigLesson].sort((a, b) => a - b);
  }


  getTeachersName(week: number, index = 0): string {
    const data = this.currentData[week][index];
    if (data) {
      return (data.teacher1.name ? data.teacher1.name : '-') + '、' + (data.teacher2.name ? data.teacher2.name : '-');
    }
    return '';
  }

  getClazzesName(week: number, index = 0): string {
    const data = this.currentData[week][index];
    if (data) {
      const names = data.clazzes.map(clazz => clazz.name);
      return names.join('、');
    }
    return '';
  }

  getRoomsName(week: number, index = 0): string {
    const data = this.currentData[week][index];
    if (data && data.dispatches[index].rooms.length > 0) {
      const names = data.dispatches[index].rooms.map(room => room.name);
      return names.join('、');
    }
    return '';
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
    // console.log('currentData1', this.currentData[7][0], this.currentData[7][1]);
    // console.log('currentData2', this.currentData[8][0], this.currentData[8][1]);
    // console.log('currentData3', this.currentData[9][0], this.currentData[9][1]);
  }

  private makeCurrentData(): void {
    this.initCurrentData();
    this.selectedData.forEach(data => {
      const bigLesson = data.smLesson === 10 ? 4 : Math.floor(data.smLesson / 2);
      if (data.day === this.day && bigLesson === this.bigLesson) {
        this.currentData[data.week].push(data.schedule);
      }
    });
  }

  private makeWeeks(): void {
    this.weeks = Array.from(new Array(this.weekNumber).keys());
    console.log('makeweeks', this.weeks);
  }

  private makeSelectedData(): void {
    this.schedules.forEach(schedule => {
      if (schedule.term.id === this.term.id) {
        schedule.dispatches.forEach(dispatch => {
          this.selectedData.push({day: dispatch.day!, smLesson: dispatch.lesson!, week: dispatch.week!, schedule});
        });
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

  private initNotEmptyWeeksTable(): void {
    for (let i = 0; i < 7; i++) {
      this.notEmptyWeeksTable[i] = [];
      for (let j = 0; j < 5; j++) {
        this.notEmptyWeeksTable[i][j] = [];
      }
    }
  }

  private initCurrentData(): void {
    for (let i = 0; i < this.weekNumber; i++) {
      this.currentData[i] = [];
    }
  }

  initData(): void {
    this.initCurrentData();
    this.initNotEmptyWeeksTable();
  }

  getWeeks(notEmptyWeeksOfTable: number[]): string {
    return this.commonService.getWeeksForTimetable(notEmptyWeeksOfTable);
  }
}
