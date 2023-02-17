import { Injectable } from '@angular/core';
import {randomNumber} from '../common/utils';
import {NavigationEnd, Router} from '@angular/router';
import swal, {SweetAlertIcon, SweetAlertResult} from 'sweetalert2';
import {BaseMenu} from '../common/base-menu';
import {BehaviorSubject, Observable} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {filter} from 'rxjs/operators';
import * as FileSaver from 'file-saver';
import {Term} from '../entity/term';
import {Room} from '../entity/room';
import {Schedule} from '../entity/schedule';
import {Clazz} from '../entity/clazz';
// @ts-ignore
import * as Excel from 'exceljs/dist/exceljs.min.js';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xls';

declare const ExcelJS: any;

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  key = 1;
  // @ts-ignore
  workbook: ExcelJS.Workbook;
  worksheet: any;
  private menus = [
    {name: '首页', url: 'dashboard', icon: 'fas fa-paper-plane'} as BaseMenu,
    {name: '学期管理', url: 'term', icon: 'fas fa-school'} as BaseMenu,
    {name: '教师管理', url: 'teacher', icon: 'fas fa-chalkboard-teacher'} as BaseMenu,
    {name: '班级管理', url: 'clazz', icon: 'fas fa-university'} as BaseMenu,
    // { name: '学生管理',   url: 'student',    icon: 'fas fa-user-graduate' } as BaseMenu,
    {name: '教室管理', url: 'room', icon: 'fas fa-warehouse'} as BaseMenu,
    {name: '课程管理', url: 'course', icon: 'fas fa-book'} as BaseMenu,
    {name: '排课管理', url: 'schedule', icon: 'fas fa-clock'} as BaseMenu,
    {name: '课程表', url: 'timetable', icon: 'fas fa-table'} as BaseMenu,
    {name: '个人中心', url: 'personal', icon: 'fas fa-user'} as BaseMenu,
  ];

  /** 当前路由是否能后退观察者 */
  private canBack$ = new BehaviorSubject<boolean>(false);
  /** 当前路由 */
  private currentUrl: string | undefined;
  /** 当前是否处于后退状态 */
  private isBack = false;
  /** 所有路由信息 */
  public routeStates: Array<{ url: string, state: { [k: string]: any } | undefined }> = [];

  constructor(private router: Router,
              private domSanitizer: DomSanitizer) {
    /** 订阅路由事件 */
    this.router.events
      /** 过滤：路由结束事件 */
      .pipe(filter((event) => {
        return event instanceof NavigationEnd;
      }))
      /** 订阅路由结束后执行的方法 */
      .subscribe((route) => {
        const routeState = route as unknown as NavigationEnd;
        this.currentUrl = routeState.urlAfterRedirects;

        if (this.isBack) {
          /** 如果处于后退状态，清空状态 */
          /** 获取完历史参数以后再清除后退状态 */
          this.isBack = false;
        } else if (!this.currentUrl.startsWith('/login')) {
          /** 如果不是认证模块，将当前路由添加到数组中 */
          if (this.routeStates.length >= 50) {
            this.routeStates.splice(0, 1);
          }
          this.routeStates.push({url: this.currentUrl, state: this.router.getCurrentNavigation()?.extras.state});
        }

        /** 更新是否能后退信息 */
        this.canBack$.next(this.routeStates.length >= 2);
      });
  }

  /**
   * 将参数转换为路由参数
   * @param params 参数
   * @return 适用于route的Params
   */
  public static convertToRouteParams(params: { [header: string]: string | string[] | number | number[] | null | undefined; })
    : { [header: string]: string | string[]; } {
    const queryParams = {} as { [header: string]: string | string[]; };
    // 过滤掉undefined及null的数据
    for (const key in params) {
      if (params[key] !== undefined) {
        const value = params[key];
        if (value !== undefined || value !== null) {
          if (typeof value === 'string') {
            queryParams[key] = value;
          } else if (typeof value === 'number') {
            queryParams[key] = value.toString();
          } else if (Array.isArray(value)) {
            queryParams[key] = [];
            (value as []).forEach(v => {
              if (typeof v === 'number') {
                (queryParams[key] as string[]).push((v as number).toString());
              } else {
                (queryParams[key] as string[]).push(v);
              }
            });
          }
        }
      }
    }
    return queryParams;
  }

  /**
   * 使用查询查询，重新加载当前路由，
   * 在重新加载前将过滤掉undefined及null的属性
   * 同时将number类型转换为string
   *
   * @example
   * 支持数字或是字符串类型
   * reloadByParam({page: 1, size: '20'});
   * 支持undefined或null值
   * reloadByParam({page: undefined, size: null});
   * 支持数字或字符串数组
   * reloadByParam({page: '1', size: 20, ids: [1, 2, 3]};
   * reloadByParam({page: '1', size: 20, ids: ['1', '2', '3']};
   *
   * @param param 查询参数
   */
  reloadByParam(params: { [header: string]: string | string[] | number | number[] | null | undefined; },
                extra?: { forceReload?: boolean }): Promise<boolean> {
    const queryParams = CommonService.convertToRouteParams(params);
    if (extra && extra.forceReload) {
      queryParams._reloadId = randomNumber().toString();
    }
    return this.router.navigate(['./', {...queryParams}]);
  }

  /**
   * 操作成功提示框
   * @param callback    回调
   * @param description 描述
   * @param title       标题
   * @param options     选项
   */
  success(callback?: () => void, description: string = '', title: string = '操作成功', option = {confirmButtonText: '确定'}): void {
    swal.fire({
      titleText: title,
      text: description,
      icon: 'success',
      background: '#F7F8FA',
      allowOutsideClick: false,
      confirmButtonText: option.confirmButtonText,
      confirmButtonColor: '#007BFF',
      showCancelButton: false
    }).then((result: SweetAlertResult) => {
      if (result.value) {
        // 执行回调
        if (callback) {
          callback();
        }
      }
    });
  }

  /**
   * 是否确认提示框
   * @param callback    回调
   * @param description 描述
   * @param title       标题
   */
  confirm(callback?: (state?: boolean) => void, description: string = '该操作不可逆，请谨慎操作', title: string = '请确认',
          confirmButtonText = '确定', cancelButtonText = '取消', options = {icon: 'question' as SweetAlertIcon}): void {
    swal.fire({
      titleText: title,
      text: description,
      icon: options.icon,
      background: '#F7F8FA',
      allowOutsideClick: false,
      confirmButtonText,
      confirmButtonColor: '#007BFF',
      showCancelButton: true,
      cancelButtonText,
      cancelButtonColor: '#6C757D'
    }).then((result: SweetAlertResult) => {
      if (callback) {
        callback(result.isConfirmed);
      }
    });
  }

  /*
   * 操作失败提示框
   * @param callback  回调
   * @param description  描述
   * @param title  标题
   */
  error(callback?: () => void, description: string = '', title: string = '操作失败'): void {
    swal.fire({
      titleText: title,
      text: description,
      icon: 'error',
      background: '#F7F8FA',
      allowOutsideClick: false,
      confirmButtonText: '确定',
      confirmButtonColor: '#007BFF',
      showCancelButton: false
    }).then((result: SweetAlertResult) => {
      if (result.value) {
        // 执行回调
        if (callback) {
          callback();
        }
      }
    });
  }

  /**
   * 友情提示消息框
   * @param callback    回调
   * @param description 描述
   * @param title       标题
   * @param options showConfirmButton: 是否显示确认按钮
   */
  info(callback?: () => void, description: string = '', title: string = '友情提示', options = {showConfirmButton: true}): void {
    swal.fire({
      titleText: title,
      text: description,
      icon: 'info',
      background: '#F7F8FA',
      allowOutsideClick: false,
      confirmButtonText: '确定',
      confirmButtonColor: '#007BFF',
      showCancelButton: false,
      showConfirmButton: options.showConfirmButton
    }).then((result: SweetAlertResult) => {
      if (result.value) {
        // 执行回调
        if (callback) {
          callback();
        }
      }
    });
  }

  /**
   * 判断当前菜单是否激活
   * @param menu 菜单
   */
  active(menu: BaseMenu): boolean {
    return this.router.isActive(menu.url, false);
  }

  getMenus(): BaseMenu[] {
    return this.menus;
  }

  canBack(): Observable<boolean> {
    return this.canBack$;
  }

  /** 路由后退 */
  back(): void {
    /** 清空当前的路由信息 */
    this.clearCurrentRoute();
    if (this.routeStates.length > 0) {
      /** 获取待后退的url */
      const state = this.routeStates[this.routeStates.length - 1];
      /** 设置后退状态 */
      this.isBack = true;
      /** 路由跳转 */
      this.router.navigateByUrl(state.url, {state: state.state});
    }
  }

  /**
   * 清空当前路由信息
   */
  clearCurrentRoute(): void {
    this.routeStates.pop();
  }

  /**
   * 保存文件
   * @param blob 文件
   * @param fileName 文件名
   */
  saveFile(blob: Blob, fileName: string): void {
    FileSaver.saveAs(blob, fileName);
  }

  checkTermIsActivated(term: Term): void {
    // console.log('checkTermIsActivated', term);
    if (term === null) {
      this.error(() => {
        this.router.navigateByUrl('/schedule');
      }, '当前无激活学期');
    }
  }

  // tslint:disable-next-line:typedef
  public generateExcel(bigModelContent: { clazzes: Clazz[]; schedules: Schedule[] }[][],
                       bigModelRoomsAndWeeks: { rooms: Room[]; weeks: number[] }[][][][],
                       fileTeacherName: string | undefined, displayModel: any,
                       content: { clazzes: Clazz[]; schedules: Schedule[] }[][],
                       roomsAndWeeks: { rooms: Room[]; weeks: number[] }[][][][],
                       teacherHours: number,
                       weekNumber: number) {
    // Create workbook and worksheet
    this.workbook = new Excel.Workbook();

    // Set Workbook Properties
    this.workbook.creator = 'Web';
    this.workbook.lastModifiedBy = 'Web';
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
    this.workbook.lastPrinted = new Date();

    // Add a Worksheet
    let Model = '';
    this.worksheet = this.workbook.addWorksheet('File');
    if (displayModel === 'big') {
      Model = '(大节)';
      this.getTimetable(bigModelContent, bigModelRoomsAndWeeks, weekNumber);
    }

    // 添加教师学时、学期名称等信息
    if (fileTeacherName !== '所有教师') {
      this.worksheet.mergeCells('W1:Y9');
      this.worksheet.getCell('W1').value = fileTeacherName + '的总学时：' + teacherHours;
    }


    // Generate Excel File
    this.workbook.xlsx.writeBuffer().then((data: BlobPart) => {
      const blob = new Blob([data], {type: EXCEL_TYPE});
      // Given name
      const filename = fileTeacherName + '的课程表' + Model;
      FileSaver.saveAs(blob, filename + EXCEL_EXTENSION);
    });
  }

  private getRoomsAndWeeksForExcel(scheduleOfRoomsAndWeeks: { rooms: Room[]; weeks: number[] }[]): string {
    let result = '';
    for (const roomsAndWeeks of scheduleOfRoomsAndWeeks) {
      if (roomsAndWeeks.rooms.length > 0) {
        const weeks = this.getWeeksForExcel(roomsAndWeeks.weeks);
        const rooms = this.getRoomsForExcel(roomsAndWeeks.rooms);
        if (result === '') {
          result = result + weeks + '在' + rooms;
        } else {
          result = result + '\n' + weeks + '在' + rooms;
        }
      }
    }
    return result;
  }

  private getClazzesForExcel(clazzes: Clazz[]): string {
    let result = '';
    for (const clazz of clazzes) {
      if (result === '') {
        result = result + clazz.name;
      } else {
        result = result + '、' + clazz.name;
      }
    }
    return result;
  }

  private getRoomsForExcel(rooms: Room[]): string {
    let result = '';
    for (const room of rooms) {
      if (result === '') {
        result = result + room.name;
      } else {
        result = result + '、' + room.name;
      }
    }
    return result;
  }

  private getWeeksForExcel(weeks: number[]): string {
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

  // 判断数组是否连续
  private isArrayContinuous(arrs: number[], min: number, max: number): boolean {
    for (let i = min; i <= max; i++) {
      if (!arrs.includes(i)) {
        return false;
      }
    }
    return true;
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

  private TimetableExcelInit(weekNumber: number): void {
    console.log('weekNumber', weekNumber);
    const rowValues = [];
    rowValues[2] = '星期一';
    rowValues[7] = '星期二';
    rowValues[12] = '星期三';
    rowValues[17] = '星期四';
    rowValues[22] = '星期五';
    rowValues[27] = '星期六';
    rowValues[32] = '星期天';
    this.worksheet.addRow(rowValues);
    this.worksheet.mergeCells('B1:F1');
    this.worksheet.mergeCells('G1:K1');
    this.worksheet.mergeCells('L1:P1');
    this.worksheet.mergeCells('Q1:U1');
    this.worksheet.mergeCells('V1:Z1');
    this.worksheet.mergeCells('AA1:AE1');
    this.worksheet.mergeCells('AF1:AJ1');
    this.worksheet.getCell('B1').style = {alignment: {wrapText: true, horizontal: 'center'}};
    this.worksheet.getCell('G1').style = {alignment: {wrapText: true, horizontal: 'center'}};
    this.worksheet.getCell('L1').style = {alignment: {wrapText: true, horizontal: 'center'}};
    this.worksheet.getCell('Q1').style = {alignment: {wrapText: true, horizontal: 'center'}};
    this.worksheet.getCell('V1').style = {alignment: {wrapText: true, horizontal: 'center'}};
    this.worksheet.getCell('AA1').style = {alignment: {wrapText: true, horizontal: 'center'}};
    this.worksheet.getCell('AF1').style = {alignment: {wrapText: true, horizontal: 'center'}};
    const rowValues1 = [];
    for (let i = 1; i < 37; i++) {
      if (i === 1) {
        rowValues1[i] = '周次';
      }
      if (i === 2 || i === 7 || i === 12 || i === 17 || i === 22 || i === 27 || i === 32) {
        rowValues1[i] = '1,2(8:00～9:35)';
      }
      if (i === 3 || i === 8 || i === 13 || i === 18 || i === 23 || i === 28 || i === 33) {
        rowValues1[i] = '3,4(10:05～11:40)';
      }
      if (i === 4 || i === 9 || i === 14 || i === 19 || i === 24 || i === 29 || i === 34) {
        rowValues1[i] = '5,6(13:30～15:05)';
      }
      if (i === 5 || i === 10 || i === 15 || i === 20 || i === 25 || i === 30 || i === 35) {
        rowValues1[i] = '7,8(15:25～17:00)';
      }
      if (i === 6 || i === 11 || i === 16 || i === 21 || i === 26 || i === 31 || i === 36) {
        rowValues1[i] = '晚上(17:30～20:30)';
      }
    }
    this.worksheet.addRow(rowValues1);
    // 设置单元格自动换行、垂直居中
    this.worksheet.getCell('A2').style = {alignment: {wrapText: true, vertical: 'middle', horizontal: 'center'}};
    this.worksheet.getCell('B2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('C2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('D2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('E2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('F2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('G2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('H2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('I2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('J2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('K2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('L2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('M2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('N2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('O2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('P2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('Q2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('R2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('S2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('T2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('U2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('V2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('W2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('X2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('Y2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('Z2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('AA2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('AB2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('AC2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('AD2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('AE2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('AF2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('AG2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('AH2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('AI2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    this.worksheet.getCell('AJ2').style = {alignment: {wrapText: true, vertical: 'middle'}};
    // 设置冻结行和列的数量
    this.worksheet.views = [
      {state: 'frozen', xSplit: 1, ySplit: 2}
    ];
  }

  // tslint:disable-next-line:typedef
  private getTimetable(bigModelContent: { clazzes: Clazz[]; schedules: Schedule[] }[][],
                       bigModelRoomsAndWeeks: { rooms: Room[]; weeks: number[] }[][][][],
                       weekNumber: number): void {
    // 课程表初始化
    this.TimetableExcelInit(weekNumber);
    // 填充内容
    console.log('bigModelContent', bigModelContent);
    for (let l = 0; l < 5; l++) {
      for (let d = 0; d < 7; d++) {
        if (bigModelContent[l][d].schedules.length > 0) {
          let cellRow = '';
          let cellCol = '';
          if (l === 0) {
            cellRow = '2';
          }
          if (l === 1) {
            cellRow = '3';
          }
          if (l === 2) {
            cellRow = '4';
          }
          if (l === 3) {
            cellRow = '5';
          }
          if (l === 4) {
            cellRow = '6';
          }
          if (d === 0) {
            cellCol = 'B';
          }
          if (d === 1) {
            cellCol = 'C';
          }
          if (d === 2) {
            cellCol = 'D';
          }
          if (d === 3) {
            cellCol = 'E';
          }
          if (d === 4) {
            cellCol = 'F';
          }
          if (d === 5) {
            cellCol = 'G';
          }
          if (d === 6) {
            cellCol = 'H';
          }
          const cellName = cellCol + cellRow;
          const content = this.worksheet.getCell(cellName);
          // 设置单元格自动换行、垂直居中
          content.style = {alignment: {wrapText: true, vertical: 'middle'}};
          content.value = '';
          for (const schedule of bigModelContent[l][d].schedules) {
            if (content.value === '') {
              content.value = content.value + schedule.course.name + '\n'
                + this.getRoomsAndWeeksForExcel(bigModelRoomsAndWeeks[l][d][schedule.id]) + '\n'
                + this.getClazzesForExcel(schedule.clazzes) + '\n'
                + schedule.teacher1.name + '、'
                + schedule.teacher2.name;
            } else {
              content.value = content.value + '\n\n' + schedule.course.name + '\n'
                + this.getRoomsAndWeeksForExcel(bigModelRoomsAndWeeks[l][d][schedule.id]) + '\n'
                + this.getClazzesForExcel(schedule.clazzes) + '\n'
                + schedule.teacher1.name + '、'
                + schedule.teacher2.name;
            }
          }
        }
      }
    }
  }
}
