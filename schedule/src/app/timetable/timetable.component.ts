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
import {config} from '../../conf/app.config';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
  formGroup = new FormGroup({
    selectedTeacherId: new FormControl(null, Validators.required),
    displayMode: new FormControl(null, Validators.required),
    selectWeek: new FormControl(null, Validators.required)
  });
  alreadySelectWeek = 0;
  weekNumber = config.weekNumber;
  isSelectWeek: boolean | undefined;
  key = 1;
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
    clazzes: Clazz[];
    schedules: Schedule[]
  }[][];
  bigModelContentForSelectWeek = {} as unknown as {
    rooms: Room[][];
    clazzes: Clazz[];
    schedules: Schedule[]
  }[][];
  smallModelContentForSelectWeek = {} as unknown as {
    rooms: Room[][];
    clazzes: Clazz[];
    schedules: Schedule[]
  }[][];
  bigModelRoomsAndWeeks = [] as unknown as {
    rooms: Room[];
    weeks: number[]
  }[][][][];
  isShowForBigModel = [] as number[][];
  private fileTeacherName: string | undefined;

  constructor(private  teacherService: TeacherService,
              private scheduleService: ScheduleService,
              private termService: TermService,
              private commonService: CommonService) { }

  ngOnInit(): void {
    console.log('isSelectWeek', this.formGroup.get('isSelectWeek')?.value);
    this.teacherService.getAll()
      .subscribe(allTeachers => {
        this.allTeachers.push({id: 'all' as unknown, name: '全部教师'} as Teacher);
        allTeachers.forEach(teacher => this.allTeachers.push(teacher));
        // todo: this.allTeachers = allTeachers;
    });
    // this.scheduleService.getSchedulesInCurrentTerm()
    //   .subscribe(allSchedulesInCurrentTerm => {
    //     this.allSchedulesInCurrentTerm = allSchedulesInCurrentTerm;
    //     // console.log('allSchedulesInCurrentTerm', this.allSchedulesInCurrentTerm);
    //   });
    // this.termService.getCurrentTerm()
    //   .subscribe(currentTerm => {
    //     this.term = currentTerm;
    //   });
    // this.initIsShow();
    // this.initContent();
    // this.initRoomsAndWeeks();
    // this.formGroup?.get('selectedTeacherId')?.setValue('all');
    // this.formGroup?.get('displayMode')?.setValue('big');
    // todo: 确定数据返回
    this.scheduleService.getSchedulesInCurrentTerm()
      .subscribe(allSchedulesInCurrentTerm => {
        this.allSchedulesInCurrentTerm = allSchedulesInCurrentTerm;
        this.termService.getCurrentTerm()
          .subscribe(currentTerm => {
            this.term = currentTerm;
            this.initIsShow();
            this.initContent();
            this.initRoomsAndWeeks();
            this.formGroup?.get('selectedTeacherId')?.setValue('all');
            this.formGroup?.get('displayMode')?.setValue('big');
            this.onTeacherChange();
          });
      });
    this.termService.getCurrentTerm()
      .subscribe((term: Term) => {
        this.commonService.checkTermIsActivated(term);
        this.term = term;
        const seconds = +term.endTime - +term.startTime;
        const days = Math.ceil(seconds / (60 * 60 * 24));
        this.weekNumber = Math.ceil(days / 7);
      });
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
          clazzes: [],
          schedules: []
        };
      }
    }
    for (let i = 0; i < 5; i++) {
      this.bigModelContent[i] = [];
      for (let j = 0; j < 7; j++) {
        this.bigModelContent[i][j] = {
          clazzes: [],
          schedules: []
        };
      }
    }
    for (let i = 0; i < 5; i++) {
      this.bigModelContentForSelectWeek[i] = [];
      for (let j = 0; j < 7; j++) {
        this.bigModelContentForSelectWeek[i][j] = {
          rooms: [] = [],
          clazzes: [],
          schedules: []
        };
        for (const schedule of this.allSchedulesInCurrentTerm) {
          this.bigModelContentForSelectWeek[i][j].rooms[schedule.id] = [];
        }
      }
    }
    for (let i = 0; i < 11; i++) {
      this.smallModelContentForSelectWeek[i] = [];
      for (let j = 0; j < 7; j++) {
        this.smallModelContentForSelectWeek[i][j] = {
          rooms: [] = [],
          clazzes: [],
          schedules: []
        };
        for (const schedule of this.allSchedulesInCurrentTerm) {
          this.smallModelContentForSelectWeek[i][j].rooms[schedule.id] = [];
        }
      }
    }
  }
  private intBigModelContentForSelectWeek(): void {
    for (let i = 0; i < 5; i++) {
      this.bigModelContentForSelectWeek[i] = [];
      for (let j = 0; j < 7; j++) {
        this.bigModelContentForSelectWeek[i][j] = {
          rooms: [],
          clazzes: [],
          schedules: []
        };
      }
    }
    for (let i = 0; i < 11; i++) {
      this.smallModelContentForSelectWeek[i] = [];
      for (let j = 0; j < 7; j++) {
        this.smallModelContentForSelectWeek[i][j] = {
          rooms: [],
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
    // this.formGroup.get('selectWeek')?.setValue(null);
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
        this.fileTeacherName = '所有教师';
        this.setIsShowForAllTeacher();
      }
    }
  }

  private getSelectedTeacher(): void {
    for (const teacher of this.allTeachers) {
      // todo: if (teacher.id.toString() === this.formGroup.get('selectedTeacherId')?.value) {
      if (teacher.id.toString() === this.formGroup.get('selectedTeacherId')?.value + '') {
        this.selectedTeacher = teacher;
        this.fileTeacherName = this.selectedTeacher.name;
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
    this.setBigModelContentForSelectWeek();
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
  private setBigModelContent(content: {clazzes: Clazz[]; schedules: Schedule[] }[][]): void {
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
    this.setBigModelContentForSelectWeek();
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
  }
  private mergeSchedules(schedules: Schedule[], schedules2: Schedule[], l: number, d: number): void {
    for (const schedule of schedules2) {
      if (!this.whetherSchedulesIncludeSchedule(schedules, schedule)) {
        this.bigModelContent[l][d].schedules.push(schedule);
      }
    }
  }

  excelExport(): void {
    this.commonService.generateExcel(this.bigModelContent,
      this.bigModelRoomsAndWeeks,
      this.fileTeacherName,
      this.getHours(),
      this.weekNumber);
  }

  getWeeksForTimetable(weeks: number[]): string {
    if (weeks.length === 1) {
      return (weeks[0] + 1).toString() + '周';
    }
    let result = '';
    const minWeeks = this.arrayMin(weeks);
    const maxWeeks = this.arrayMax(weeks);
    if (this.isArrayContinuous(weeks, minWeeks, maxWeeks)) {
      return (minWeeks + 1) + '-' + (maxWeeks + 1) + '周';
    }
    result = this.weeksNotContinuous(weeks, minWeeks, maxWeeks);
    return result + '周';
  }
  private weeksNotContinuous(arr: number[], min: number, max: number): string {
    let a = true;
    let result = '';
    const sortArr = this.sortArr(arr);
    for (let i = 0; i < sortArr.length - 1; i++) {
      if (sortArr[i] + 1 !== sortArr[i + 1]) {
        if (a) {
          if (min !== sortArr[i]) {
            result = result + (min + 1) + '-' + (sortArr[i] + 1) + '、';
          } else {
            result = result + (min + 1) + '、';
          }
          a = !a;
        }
        this.key = i + 1;
        let b = true;
        for (let j = this.key; j < sortArr.length - 1; j++) {
          if (sortArr[j] + 1 !== sortArr[j + 1]) {
            if (b) {
              if (sortArr[this.key] !== sortArr[j]) {
                result = result + (sortArr[this.key] + 1) + '-' + (sortArr[j] + 1) + '、';
              } else {
                result = result + (sortArr[this.key] + 1) + '、';
              }
              b = !b;
            }
          }
        }
      }
      if (i === sortArr.length - 2) {
        if (sortArr[this.key] !== max) {
          result = result + (sortArr[this.key] + 1) + '-' + (max + 1);
        } else {
          result = result + (max + 1);
        }
      }
    }
    return result;
  }
  // 冒泡排序(从小到大)
  private sortArr(arr: number[]): number[] {
    // 控制循环多少次
    for (let i = 0; i < arr.length - 1; i++) {
      // 控制比较
      for (let j = 0; j < arr.length; j++) {
        // 一次循环中，如果前者大于后者就交换位置，所以第一次循环最大的就在最后
        if (arr[j] > arr[j + 1]) {
          // 交换位置
          const element = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = element;
        }
      }
    }
    return arr;
  }
  // 找出数组中的最小值
  private arrayMin(arrs: number[]): number {
    let min = arrs[0];
    for (let i = 1, ilen = arrs.length; i < ilen; i += 1) {
      if (arrs[i] < min) {
        min = arrs[i];
      }
    }
    return min;
  }
  // 找出数组中的最大值
  private arrayMax(arrs: number[]): number {
    let max = arrs[0];
    for (let i = 1, ilen = arrs.length; i < ilen; i += 1) {
      if (arrs[i] > max) {
        max = arrs[i];
      }
    }
    return max;
  }
  // 判断数组是否连续
  private isArrayContinuous(arrs: number[], min: number, max: number): boolean {
    for (let i = min; i <= max; i++) {
      if (!arrs.includes(i)) {
        return false;
      }
    }
    return true;
  }

  getHours(): number {
    let counter = 0;
    for (const  schedule of this.schedulesOfSelectedTeacher) {
      counter = schedule.dispatches.length + counter;
    }
    return counter;
  }

  setIsSelectWeek(): void {
    if (this.isSelectWeek === null) {
      this.isSelectWeek = true;
    } else {
      this.isSelectWeek = !this.isSelectWeek;
    }
    console.log('isSelectWeek', this.isSelectWeek);
    this.onSelectWeekChange();
  }

  onSelectWeekChange(): void {
    this.intBigModelContentForSelectWeek();
    console.log('alreadySelectWeek', this.formGroup.get('selectWeek')?.value);
    this.setBigModelContentForSelectWeek();
  }

  getWeeksForSelectWeeks(weekNumber: number): number [] {
    const  arr = [];
    for (let i = 1; i <= weekNumber; i++) {
      arr.push(i);
    }
    return arr;
  }

  getWeeksForSelectWeeksShow(value: any): string {
    if (value === null) {
      return '请选择周数';
    } else {
      return '第' + value + '周';
    }
  }

  private setBigModelContentForSelectWeek(): void {
    this.intBigModelContentForSelectWeek();
    if ( this.formGroup.get('selectWeek')?.value !== null) {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 7; j++) {
          for (const schedule of this.bigModelContent[i][j].schedules) {
            // tslint:disable-next-line:prefer-for-of
            for (let x = 0; x < this.bigModelRoomsAndWeeks[i][j][schedule.id].length; x++) {
              if (this.bigModelRoomsAndWeeks[i][j][schedule.id][x].weeks.includes(this.formGroup.get('selectWeek')?.value - 1)) {
                this.bigModelContentForSelectWeek[i][j].clazzes = this.bigModelContent[i][j].clazzes;
                this.bigModelContentForSelectWeek[i][j].schedules.push(schedule);
                this.bigModelContentForSelectWeek[i][j].rooms[schedule.id] = this.bigModelRoomsAndWeeks[i][j][schedule.id][x].rooms;
              }
            }
          }
        }
      }
      console.log('bigModelContentForSelectWeek', this.bigModelContentForSelectWeek);
    }
    this.setSmallModelContentForSelectWeek();
  }

  private setSmallModelContentForSelectWeek(): void {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0) {
          this.smallModelContentForSelectWeek[0][j] = this.bigModelContentForSelectWeek[i][j];
          this.smallModelContentForSelectWeek[1][j] = this.bigModelContentForSelectWeek[i][j];
        }
        if (i === 1) {
          this.smallModelContentForSelectWeek[2][j] = this.bigModelContentForSelectWeek[i][j];
          this.smallModelContentForSelectWeek[3][j] = this.bigModelContentForSelectWeek[i][j];
        }
        if (i === 2) {
          this.smallModelContentForSelectWeek[4][j] = this.bigModelContentForSelectWeek[i][j];
          this.smallModelContentForSelectWeek[5][j] = this.bigModelContentForSelectWeek[i][j];
        }
        if (i === 3) {
          this.smallModelContentForSelectWeek[6][j] = this.bigModelContentForSelectWeek[i][j];
          this.smallModelContentForSelectWeek[7][j] = this.bigModelContentForSelectWeek[i][j];
        }
        if (i === 4) {
          this.smallModelContentForSelectWeek[8][j] = this.bigModelContentForSelectWeek[i][j];
          this.smallModelContentForSelectWeek[9][j] = this.bigModelContentForSelectWeek[i][j];
          this.smallModelContentForSelectWeek[10][j] = this.bigModelContentForSelectWeek[i][j];
        }
      }
    }
  }

  turnToArr(weekNumber: number): number [] {
    const arr = [];
    for (let i = 1; i <= weekNumber; i++) {
      arr.push(i);
    }
    return arr;
  }

  setSelectWeek(week: number): void {
    this.formGroup.get('selectWeek')?.setValue(week);
  }
}
