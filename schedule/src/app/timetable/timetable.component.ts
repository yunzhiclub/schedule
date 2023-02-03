import { Component, OnInit } from '@angular/core';
import {Teacher} from '../../entity/teacher';
import {Schedule} from '../../entity/schedule';
import {TeacherService} from '../../service/teacher.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ScheduleService} from '../../service/schedule.service';
import {Room} from '../../entity/room';
import {Clazz} from '../../entity/clazz';
import {Term} from '../../entity/term';
import {TermService} from '../../service/term.service';
import {CommonService} from '../../service/common.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
  formGroup = new FormGroup({
    selectedTeacherId: new FormControl(null, Validators.required),
    displayMode: new FormControl(null, Validators.required)
  });
  term: Term | undefined;
  lessons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  days = ['一', '二', '三', '四', '五', '六', '日'];
  // 全部教师
  allTeachers: Teacher[] = [];
  // 当前学期的全部排课
  allSchedulesInCurrentTerm: Schedule[] = [];
  // 已经选择的教师的排课
  schedulesOfSelectedTeacher: Schedule[] = [];
  // 用于判断天节小单元是否有内容需要显示
  isShow = [] as number[][];
  // 天节小单元中的内容
  content = {} as unknown as {
    rooms: Room[];
    weeks: number[];
    clazzes: Clazz[];
    schedules: Schedule[]
  }[][];
  // 教室与周的组
  roomsAndWeeks = [] as unknown as {
    rooms: Room[];
    weeks: number[]
  }[][][][];
  // 已经选择的教师
  selectedTeacher: Teacher = new Teacher();
  bigLessons = [1, 2, 3, 4, 5];
  bigModelContent = {} as unknown as {
    rooms: Room[];
    weeks: number[];
    clazzes: Clazz[];
    schedules: Schedule[]
  }[][];
  bigModelRoomsAndWeeks = [] as unknown as {
    rooms: Room[];
    weeks: number[]
  }[][][][];
  isShowForBigModel = [] as number[][];

  constructor(private  teacherService: TeacherService,
              private scheduleService: ScheduleService,
              private termService: TermService,
              private commonService: CommonService) { }

  ngOnInit(): void {
    this.teacherService.getAll()
      .subscribe(allTeachers => {
        this.allTeachers = allTeachers;
    });
    this.scheduleService.getSchedulesInCurrentTerm()
      .subscribe(allSchedulesInCurrentTerm => {
        this.allSchedulesInCurrentTerm = allSchedulesInCurrentTerm;
        // console.log('allSchedulesInCurrentTerm', this.allSchedulesInCurrentTerm);
      });
    this.termService.getCurrentTerm()
      .subscribe(currentTerm => {
        this.term = currentTerm;
      });
    this.initIsShow();
    this.initContent();
    this.initRoomsAndWeeks();
    this.formGroup?.get('selectedTeacherId')?.setValue('please');
    this.formGroup?.get('displayMode')?.setValue('big');
    this.onTeacherChange();
  }
  private initRoomsAndWeeks(): void {
    for (let i = 0; i < 11; i++) {
      this.roomsAndWeeks[i] = [];
      for (let j = 0; j < 7; j++) {
        this.roomsAndWeeks[i][j] = [];
        for (const schedule of this.allSchedulesInCurrentTerm) {
          this.roomsAndWeeks[i][j][schedule.id] = [];
          for (let x = 0; x < 5; x++) {
            this.roomsAndWeeks[i][j][schedule.id][x] = {
              rooms: [],
              weeks: []
            };
          }
        }
      }
    }
    // console.log('this.roomsAndWeeks', this.roomsAndWeeks);
    for (let i = 0; i < 5; i++) {
      this.bigModelRoomsAndWeeks[i] = [];
      for (let j = 0; j < 7; j++) {
        this.bigModelRoomsAndWeeks[i][j] = [];
        for (const schedule of this.allSchedulesInCurrentTerm) {
          this.bigModelRoomsAndWeeks[i][j][schedule.id] = [];
          for (let x = 0; x < 5; x++) {
            this.bigModelRoomsAndWeeks[i][j][schedule.id][x] = {
              rooms: [],
              weeks: []
            };
          }
        }
      }
    }
  }
  private initContent(): void {
    for (let i = 0; i < 11; i++) {
      this.content[i] = [];
      for (let j = 0; j < 7; j++) {
        this.content[i][j] = {
          rooms: [],
          weeks: [],
          clazzes: [],
          schedules: []
        };
      }
    }
    for (let i = 0; i < 5; i++) {
      this.bigModelContent[i] = [];
      for (let j = 0; j < 7; j++) {
        this.bigModelContent[i][j] = {
          rooms: [],
          weeks: [],
          clazzes: [],
          schedules: []
        };
      }
    }
  }
  private initIsShow(): void {
    for (let i = 0; i < 11; i++) {
      this.isShow[i] = [];
      for (let j = 0; j < 7; j++) {
        this.isShow[i][j] = 0;
      }
    }
    // this.isShow[7][4] = 1;
    for (let i = 0; i < 5; i++) {
      this.isShowForBigModel[i] = [];
      for (let j = 0; j < 7; j++) {
        this.isShowForBigModel[i][j] = 0;
      }
    }
  }

  onTeacherChange(): void {
    // 重新选择教师后,将教室与周的组置空
    this.initRoomsAndWeeks();
    // 重新选择教师后,将内容置空
    this.initContent();
    // 重新选择教师后,将用于判断天节小单元是否有内容需要显示的数组置空
    this.initIsShow();
    // 重新选择教师后,将已经选择的教师的排课置空
    this.schedulesOfSelectedTeacher = [];
    if (this.formGroup.get('selectedTeacherId')?.value !== 'all' && this.formGroup.get('selectedTeacherId')?.value !== 'please') {
      this.getSelectedTeacher();
    } else {
      if (this.formGroup.get('selectedTeacherId')?.value === 'all') {
        // console.log('选择全部教师');
        this.setIsShowForAllTeacher();
      }
    }
  }

  private getSelectedTeacher(): void {
    for (const teacher of this.allTeachers) {
      if (teacher.id.toString() === this.formGroup.get('selectedTeacherId')?.value) {
        this.selectedTeacher = teacher;
        break;
      }
    }
    this.getSchedulesOfSelectedTeacher();
  }

  private getSchedulesOfSelectedTeacher(): void {
    for (const schedule of this.allSchedulesInCurrentTerm) {
      if (schedule.teacher1.id === this.selectedTeacher.id || schedule.teacher2.id === this.selectedTeacher.id) {
        this.schedulesOfSelectedTeacher.push(schedule);
      }
    }
    // console.log('schedulesOfSelectedTeacher', this.schedulesOfSelectedTeacher);
    this.setIsShow();
  }

  private setIsShow(): void {
    for (const schedule of this.schedulesOfSelectedTeacher) {
      for (const dispatch of schedule.dispatches) {
        this.isShow[dispatch.lesson][dispatch.day] = 1;
        this.setContent(schedule, dispatch.lesson, dispatch.day, dispatch.week, dispatch.rooms, schedule.id);
      }
    }
    this.setIsShowForBigModel();
    this.setBigModelContent(this.content);
    this.setBigModelRoomsAndWeeks(this.roomsAndWeeks);
  }
  private setContent(schedule: Schedule, lesson: number, day: number, week: number, rooms: Room[], scheduleId: number): void {
    if (!this.whetherSchedulesIncludeSchedule(this.content[lesson][day].schedules, schedule)) {
      this.content[lesson][day].schedules.push(schedule);
    }
    // console.log('this.content', this.content);
    this.setRoomsAndWeeks(lesson, day, week, rooms, scheduleId);
  }
  private setRoomsAndWeeks(lesson: number, day: number, week: number, rooms: Room[], scheduleId: number): void {
    for (const schedule of this.content[lesson][day].schedules) {
      if (schedule.id === scheduleId) {
        this.setRoomsAndWeeksOfSchedules(lesson, day, week, rooms, scheduleId);
      }
    }
  }
  private setBigModelContent(content: { rooms: Room[]; weeks: number[]; clazzes: Clazz[]; schedules: Schedule[] }[][]): void {
    for (let l = 0; l < 11; l++) {
      for (let d = 0; d < 7; d++) {
        if (content[l][d].schedules.length !== 0) {
          if (l === 0 || l === 1) {
            this.mergeSchedules(this.bigModelContent[0][d].schedules, content[l][d].schedules, 0, d);
          }
          if (l === 2 || l === 3) {
            this.mergeSchedules(this.bigModelContent[1][d].schedules, content[l][d].schedules, 1, d);
          }
          if (l === 4 || l === 5) {
            this.mergeSchedules(this.bigModelContent[2][d].schedules, content[l][d].schedules, 2, d);
          }
          if (l === 6 || l === 7) {
            this.mergeSchedules(this.bigModelContent[3][d].schedules, content[l][d].schedules, 3, d);
          }
          if (l === 8 || l === 9 || l === 10) {
            this.mergeSchedules(this.bigModelContent[4][d].schedules, content[l][d].schedules, 4, d);
          }
        }
      }
    }
  }
  private setRoomsAndWeeksOfSchedules(lesson: number, day: number, week: number, rooms: Room[], scheduleId: number): void {
    if (rooms.length > 0) {
      // 当此个天节的scheduleId键数组未存roomsAndWeeks组时
      if (this.roomsAndWeeks[lesson][day][scheduleId][0].rooms.length === 0) {
        // 将rooms与week存入第一个元素
        for (const room of rooms) {
          this.roomsAndWeeks[lesson][day][scheduleId][0].rooms.push(room);
        }
        if (!this.whetherWeeksIncludeWeek(this.roomsAndWeeks[lesson][day][scheduleId][0].weeks, week)) {
          this.roomsAndWeeks[lesson][day][scheduleId][0].weeks.push(week);
        }
      } else {
        // 当此个天节的scheduleId键数组原来存有roomsAndWeeks组时
        // 设置key
        let key = true;
        // 循环此个天节的scheduleId键数组的所有roomsAndWeeks组
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.roomsAndWeeks[lesson][day][scheduleId].length; i++) {
          // 如果新存入的rooms与当前已经存有的rooms相等
          if (JSON.stringify(this.roomsAndWeeks[lesson][day][scheduleId][i].rooms) === JSON.stringify(rooms)) {
            // 只将新week存入已存在的对象的weeks中,不再重复存rooms
            if (!this.whetherWeeksIncludeWeek(this.roomsAndWeeks[lesson][day][scheduleId][0].weeks, week)) {
              this.roomsAndWeeks[lesson][day][scheduleId][i].weeks.push(week);
            }
            // 当有当前情况时设置key为false
            key = false;
          }
        }
        // key为true时，即如果新存入的rooms与当前已经存有的所有rooms都不相等
        if (key) {
          // 将新存入的rooms与对应week存入下一个roomsAndWeeks组
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.roomsAndWeeks[lesson][day][scheduleId].length; j++) {
            if (this.roomsAndWeeks[lesson][day][scheduleId][j].rooms.length === 0) {
              for (const room of rooms) {
                this.roomsAndWeeks[lesson][day][scheduleId][j].rooms.push(room);
              }
              this.roomsAndWeeks[lesson][day][scheduleId][j].weeks.push(week);
              break;
            }
          }
        }
      }
    }
  }
  private whetherSchedulesIncludeSchedule(schedules: Schedule[], newSchedule: Schedule): boolean {
    for (const schedule of schedules) {
      if (schedule.id === newSchedule.id) {
        return true;
      }
    }
    return false;
  }
  private setIsShowForAllTeacher(): void {
    for (const schedule of this.allSchedulesInCurrentTerm) {
      for (const dispatch of schedule.dispatches) {
        this.isShow[dispatch.lesson][dispatch.day] = 1;
        this.setContent(schedule, dispatch.lesson, dispatch.day, dispatch.week, dispatch.rooms, schedule.id);
      }
    }
    this.setIsShowForBigModel();
    this.setBigModelContent(this.content);
    this.setBigModelRoomsAndWeeks(this.roomsAndWeeks);
  }

  private whetherWeeksIncludeWeek(weeks: number[], newWeek: number): boolean {
    for (const week of weeks) {
      if (week === newWeek) {
        return true;
      }
    }
    return false;
  }

  onModelChange(): void {
    this.onTeacherChange();
  }

  private setIsShowForBigModel(): void {
    for (let l = 0; l < 11; l++) {
      for (let d = 0; d < 7; d++) {
        if (this.isShow[l][d] === 1) {
          if (l === 0 || l === 1) {
            this.isShowForBigModel[0][d] = 1;
          }
          if (l === 2 || l === 3) {
            this.isShowForBigModel[1][d] = 1;
          }
          if (l === 4 || l === 5) {
            this.isShowForBigModel[2][d] = 1;
          }
          if (l === 6 || l === 7) {
            this.isShowForBigModel[3][d] = 1;
          }
          if (l === 8 || l === 9 || l === 10) {
            this.isShowForBigModel[4][d] = 1;
          }
        }
      }
    }
  }

  private setBigModelRoomsAndWeeks(roomsAndWeeks: { rooms: Room[]; weeks: number[] }[][][][]): void {
    for (let l = 0; l < 11; l++) {
      for (let d = 0; d < 7; d++) {
        // tslint:disable-next-line:prefer-for-of
        for (const schedule of this.allSchedulesInCurrentTerm) {
          // tslint:disable-next-line:prefer-for-of
          for (let x = 0; x < roomsAndWeeks[l][d][schedule.id].length; x++) {
            if (roomsAndWeeks[l][d][schedule.id][x].rooms.length !== 0) {
              if (l === 0 || l === 1) {
                this.bigModelRoomsAndWeeks[0][d][schedule.id] = roomsAndWeeks[l][d][schedule.id];
              }
              if (l === 2 || l === 3) {
                this.bigModelRoomsAndWeeks[1][d][schedule.id] = roomsAndWeeks[l][d][schedule.id];
              }
              if (l === 4 || l === 5) {
                this.bigModelRoomsAndWeeks[2][d][schedule.id] = roomsAndWeeks[l][d][schedule.id];
              }
              if (l === 6 || l === 7) {
                this.bigModelRoomsAndWeeks[3][d][schedule.id] = roomsAndWeeks[l][d][schedule.id];
              }
              if (l === 8 || l === 9 || l === 10) {
                this.bigModelRoomsAndWeeks[4][d][schedule.id] = roomsAndWeeks[l][d][schedule.id];
              }
            }
          }
        }
      }
    }
    // console.log('roomsAndWeeks[2][2][2]', roomsAndWeeks[2][2][2]);
    // console.log('this.bigModelRoomsAndWeeks[1][2][2]', this.bigModelRoomsAndWeeks[1][2][2]);
    // console.log('this.roomsAndWeeks', this.roomsAndWeeks);
    // console.log('setBigModelRoomsAndWeeks', this.bigModelRoomsAndWeeks);
  }
  private mergeSchedules(schedules: Schedule[], schedules2: Schedule[], l: number, d: number): void {
    for (const schedule of schedules2) {
      if (!this.whetherSchedulesIncludeSchedule(schedules, schedule)) {
        this.bigModelContent[l][d].schedules.push(schedule);
      }
    }
  }

  excelExport(): void {
    this.commonService.generateExcel();
  }
}
