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
const EXCEL_EXTENSION = '.xlsx';

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
    { name: '首页',      url: 'dashboard',  icon: 'fas fa-paper-plane'} as BaseMenu,
    { name: '学期管理',   url: 'term',       icon: 'fas fa-school' } as BaseMenu,
    { name: '教师管理',   url: 'teacher',    icon: 'fas fa-chalkboard-teacher' } as BaseMenu,
    { name: '班级管理',   url: 'clazz',      icon: 'fas fa-university' } as BaseMenu,
    { name: '学生管理',   url: 'student',    icon: 'fas fa-user-graduate' } as BaseMenu,
    { name: '教室管理',   url: 'room',       icon: 'fas fa-warehouse' } as BaseMenu,
    { name: '课程管理',   url: 'course',     icon: 'fas fa-book' } as BaseMenu,
    { name: '排课管理',   url: 'schedule',   icon: 'fas fa-clock' } as BaseMenu,
    { name: '课程表',     url: 'timetable',  icon: 'fas fa-table' } as BaseMenu,
    { name: '个人中心',   url: 'personal',   icon: 'fas fa-user' } as BaseMenu,
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
                extra?: {forceReload?: boolean}): Promise<boolean> {
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
    console.log('checkTermIsActivated', term);
    if (term === null) {
      this.error(() => {
        this.router.navigateByUrl('/schedule');
      }, '当前无激活学期');
    }
  }

  // tslint:disable-next-line:typedef
  public generateExcel(bigModelContent: { rooms: Room[]; weeks: number[]; clazzes: Clazz[]; schedules: Schedule[] }[][],
                       bigModelRoomsAndWeeks: { rooms: Room[]; weeks: number[] }[][][][],
                       fileTeacherName: string | undefined, displayModel: any,
                       content: { rooms: Room[]; weeks: number[]; clazzes: Clazz[]; schedules: Schedule[] }[][],
                       roomsAndWeeks: { rooms: Room[]; weeks: number[] }[][][][],
                       teacherHours: number) {
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
      this.getBigModelTimetable(bigModelContent, bigModelRoomsAndWeeks);
    }
    if (displayModel === 'small') {
      Model = '(小节)';
      this.getSmallModelTimeTable(content, roomsAndWeeks);
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
  private bigModelTimetableExcelInit(): void {
    const rowValues = [];
    rowValues[1] = '天/节';
    rowValues[2] = '周一';
    rowValues[5] = '周二';
    rowValues[8] = '周三';
    rowValues[11] = '周四';
    rowValues[14] = '周五';
    rowValues[17] = '周六';
    rowValues[20] = '周日';
    this.worksheet.addRow(rowValues);
    const rows = [
      ['第一大节'], [], [], [], [], [], [], [],
      ['第二大节'], [], [], [], [], [], [], [],
      ['第三大节'], [], [], [], [], [], [], [],
      ['第四大节'], [], [], [], [], [], [], [],
      ['第五大节'], [], [], [], [], [], [], [],
    ];
    this.worksheet.addRows(rows);
    this.worksheet.mergeCells('B1:D1');
    this.worksheet.mergeCells('E1:G1');
    this.worksheet.mergeCells('H1:J1');
    this.worksheet.mergeCells('K1:M1');
    this.worksheet.mergeCells('N1:P1');
    this.worksheet.mergeCells('Q1:S1');
    this.worksheet.mergeCells('T1:V1');

    this.worksheet.mergeCells('A2', 'A9');
    this.worksheet.mergeCells('A10', 'A17');
    this.worksheet.mergeCells('A18', 'A25');
    this.worksheet.mergeCells('A26', 'A33');
    this.worksheet.mergeCells('A34', 'A41');

    this.worksheet.mergeCells('B2', 'D9');
    this.worksheet.mergeCells('E2', 'G9');
    this.worksheet.mergeCells('H2', 'J9');
    this.worksheet.mergeCells('K2', 'M9');
    this.worksheet.mergeCells('N2', 'P9');
    this.worksheet.mergeCells('Q2', 'S9');
    this.worksheet.mergeCells('T2', 'V9');

    this.worksheet.mergeCells('B10', 'D17');
    this.worksheet.mergeCells('E10', 'G17');
    this.worksheet.mergeCells('H10', 'J17');
    this.worksheet.mergeCells('K10', 'M17');
    this.worksheet.mergeCells('N10', 'P17');
    this.worksheet.mergeCells('Q10', 'S17');
    this.worksheet.mergeCells('T10', 'V17');

    this.worksheet.mergeCells('B18', 'D25');
    this.worksheet.mergeCells('E18', 'G25');
    this.worksheet.mergeCells('H18', 'J25');
    this.worksheet.mergeCells('K18', 'M25');
    this.worksheet.mergeCells('N18', 'P25');
    this.worksheet.mergeCells('Q18', 'S25');
    this.worksheet.mergeCells('T18', 'V25');

    this.worksheet.mergeCells('B26', 'D33');
    this.worksheet.mergeCells('E26', 'G33');
    this.worksheet.mergeCells('H26', 'J33');
    this.worksheet.mergeCells('K26', 'M33');
    this.worksheet.mergeCells('N26', 'P33');
    this.worksheet.mergeCells('Q26', 'S33');
    this.worksheet.mergeCells('T26', 'V33');

    this.worksheet.mergeCells('B34', 'D41');
    this.worksheet.mergeCells('E34', 'G41');
    this.worksheet.mergeCells('H34', 'J41');
    this.worksheet.mergeCells('K34', 'M41');
    this.worksheet.mergeCells('N34', 'P41');
    this.worksheet.mergeCells('Q34', 'S41');
    this.worksheet.mergeCells('T34', 'V41');
  }
  private smallModelTimetableExcelInit(): void {
    const rowValues = [];
    rowValues[1] = '天/节';
    rowValues[2] = '周一';
    rowValues[5] = '周二';
    rowValues[8] = '周三';
    rowValues[11] = '周四';
    rowValues[14] = '周五';
    rowValues[17] = '周六';
    rowValues[20] = '周日';
    this.worksheet.addRow(rowValues);
    const rows = [
      ['第1小节'], [], [], [], [], [], [], [],
      ['第2小节'], [], [], [], [], [], [], [],
      ['第3小节'], [], [], [], [], [], [], [],
      ['第4小节'], [], [], [], [], [], [], [],
      ['第5小节'], [], [], [], [], [], [], [],
      ['第6小节'], [], [], [], [], [], [], [],
      ['第7小节'], [], [], [], [], [], [], [],
      ['第8小节'], [], [], [], [], [], [], [],
      ['第9小节'], [], [], [], [], [], [], [],
      ['第10小节'], [], [], [], [], [], [], [],
      ['第11小节'], [], [], [], [], [], [], [],
    ];
    this.worksheet.addRows(rows);
    this.worksheet.mergeCells('B1:D1');
    this.worksheet.mergeCells('E1:G1');
    this.worksheet.mergeCells('H1:J1');
    this.worksheet.mergeCells('K1:M1');
    this.worksheet.mergeCells('N1:P1');
    this.worksheet.mergeCells('Q1:S1');
    this.worksheet.mergeCells('T1:V1');

    this.worksheet.mergeCells('A2', 'A9');
    this.worksheet.mergeCells('A10', 'A17');
    this.worksheet.mergeCells('A18', 'A25');
    this.worksheet.mergeCells('A26', 'A33');
    this.worksheet.mergeCells('A34', 'A41');
    this.worksheet.mergeCells('A42', 'A49');
    this.worksheet.mergeCells('A50', 'A57');
    this.worksheet.mergeCells('A58', 'A65');
    this.worksheet.mergeCells('A66', 'A73');
    this.worksheet.mergeCells('A74', 'A81');
    this.worksheet.mergeCells('A82', 'A89');

    this.worksheet.mergeCells('B2', 'D9'); this.worksheet.mergeCells('E2', 'G9'); this.worksheet.mergeCells('H2', 'J9');
    this.worksheet.mergeCells('K2', 'M9'); this.worksheet.mergeCells('N2', 'P9'); this.worksheet.mergeCells('Q2', 'S9');
    this.worksheet.mergeCells('T2', 'V9');

    this.worksheet.mergeCells('B10', 'D17'); this.worksheet.mergeCells('E10', 'G17'); this.worksheet.mergeCells('H10', 'J17');
    this.worksheet.mergeCells('K10', 'M17'); this.worksheet.mergeCells('N10', 'P17'); this.worksheet.mergeCells('Q10', 'S17');
    this.worksheet.mergeCells('T10', 'V17');

    this.worksheet.mergeCells('B18', 'D25'); this.worksheet.mergeCells('E18', 'G25'); this.worksheet.mergeCells('H18', 'J25');
    this.worksheet.mergeCells('K18', 'M25'); this.worksheet.mergeCells('N18', 'P25'); this.worksheet.mergeCells('Q18', 'S25');
    this.worksheet.mergeCells('T18', 'V25');

    this.worksheet.mergeCells('B26', 'D33'); this.worksheet.mergeCells('E26', 'G33'); this.worksheet.mergeCells('H26', 'J33');
    this.worksheet.mergeCells('K26', 'M33'); this.worksheet.mergeCells('N26', 'P33'); this.worksheet.mergeCells('Q26', 'S33');
    this.worksheet.mergeCells('T26', 'V33');

    this.worksheet.mergeCells('B34', 'D41'); this.worksheet.mergeCells('E34', 'G41'); this.worksheet.mergeCells('H34', 'J41');
    this.worksheet.mergeCells('K34', 'M41'); this.worksheet.mergeCells('N34', 'P41'); this.worksheet.mergeCells('Q34', 'S41');
    this.worksheet.mergeCells('T34', 'V41');

    this.worksheet.mergeCells('B42', 'D49'); this.worksheet.mergeCells('E42', 'G49'); this.worksheet.mergeCells('H42', 'J49');
    this.worksheet.mergeCells('K42', 'M49'); this.worksheet.mergeCells('N42', 'P49'); this.worksheet.mergeCells('Q42', 'S49');
    this.worksheet.mergeCells('T42', 'V49');

    this.worksheet.mergeCells('B50', 'D57'); this.worksheet.mergeCells('E50', 'G57'); this.worksheet.mergeCells('H50', 'J57');
    this.worksheet.mergeCells('K50', 'M57'); this.worksheet.mergeCells('N50', 'P57'); this.worksheet.mergeCells('Q50', 'S57');
    this.worksheet.mergeCells('T50', 'V57');

    this.worksheet.mergeCells('B58', 'D65'); this.worksheet.mergeCells('E58', 'G65'); this.worksheet.mergeCells('H58', 'J65');
    this.worksheet.mergeCells('K58', 'M65'); this.worksheet.mergeCells('N58', 'P65'); this.worksheet.mergeCells('Q58', 'S65');
    this.worksheet.mergeCells('T58', 'V65');

    this.worksheet.mergeCells('B66', 'D73'); this.worksheet.mergeCells('E66', 'G73'); this.worksheet.mergeCells('H66', 'J73');
    this.worksheet.mergeCells('K66', 'M73'); this.worksheet.mergeCells('N66', 'P73'); this.worksheet.mergeCells('Q66', 'S73');
    this.worksheet.mergeCells('T66', 'V73');

    this.worksheet.mergeCells('B74', 'D81'); this.worksheet.mergeCells('E74', 'G81'); this.worksheet.mergeCells('H74', 'J81');
    this.worksheet.mergeCells('K74', 'M81'); this.worksheet.mergeCells('N74', 'P81'); this.worksheet.mergeCells('Q74', 'S81');
    this.worksheet.mergeCells('T74', 'V81');

    this.worksheet.mergeCells('B82', 'D89'); this.worksheet.mergeCells('E82', 'G89'); this.worksheet.mergeCells('H82', 'J89');
    this.worksheet.mergeCells('K82', 'M89'); this.worksheet.mergeCells('N82', 'P89'); this.worksheet.mergeCells('Q82', 'S89');
    this.worksheet.mergeCells('T82', 'V89');
  }

  // tslint:disable-next-line:typedef
  private getBigModelTimetable(bigModelContent: { rooms: Room[]; weeks: number[]; clazzes: Clazz[]; schedules: Schedule[] }[][],
                               bigModelRoomsAndWeeks: { rooms: Room[]; weeks: number[] }[][][][]): void {
    // 课程表初始化
    this.bigModelTimetableExcelInit();
    // 填充内容
    console.log('bigModelContent', bigModelContent);
    for (let l = 0; l < 5; l++) {
      for (let d = 0; d < 7; d++) {
        if (bigModelContent[l][d].schedules.length > 0) {
          let cellRow = '';
          let cellCol = '';
          if (l === 0) { cellRow = '2'; }
          if (l === 1) { cellRow = '10'; }
          if (l === 2) { cellRow = '18'; }
          if (l === 3) { cellRow = '26'; }
          if (l === 4) { cellRow = '34'; }
          if (d === 0) { cellCol = 'B'; }
          if (d === 1) { cellCol = 'E'; }
          if (d === 2) { cellCol = 'H'; }
          if (d === 3) { cellCol = 'K'; }
          if (d === 4) { cellCol = 'M'; }
          if (d === 5) { cellCol = 'Q'; }
          if (d === 6) { cellCol = 'T'; }
          const cellName = cellCol + cellRow;
          const content = this.worksheet.getCell(cellName);
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

  private getSmallModelTimeTable(smallModelContent: { rooms: Room[]; weeks: number[]; clazzes: Clazz[]; schedules: Schedule[] }[][],
                                 smallModelRoomsAndWeeks: { rooms: Room[]; weeks: number[] }[][][][]): void {
    this.smallModelTimetableExcelInit();
    // 填充内容
    for (let l = 0; l < 11; l++) {
      for (let d = 0; d < 7; d++) {
        if (smallModelContent[l][d].schedules.length > 0) {
          let cellRow = '';
          let cellCol = '';
          if (l === 0) { cellRow = '2'; }
          if (l === 1) { cellRow = '10'; }
          if (l === 2) { cellRow = '18'; }
          if (l === 3) { cellRow = '26'; }
          if (l === 4) { cellRow = '34'; }
          if (l === 5) { cellRow = '42'; }
          if (l === 6) { cellRow = '50'; }
          if (l === 7) { cellRow = '58'; }
          if (l === 8) { cellRow = '66'; }
          if (l === 9) { cellRow = '74'; }
          if (l === 10) { cellRow = '82'; }
          if (d === 0) { cellCol = 'B'; }
          if (d === 1) { cellCol = 'E'; }
          if (d === 2) { cellCol = 'H'; }
          if (d === 3) { cellCol = 'K'; }
          if (d === 4) { cellCol = 'M'; }
          if (d === 5) { cellCol = 'Q'; }
          if (d === 6) { cellCol = 'T'; }
          const cellName = cellCol + cellRow;
          const content = this.worksheet.getCell(cellName);
          content.value = '';
          for (const schedule of smallModelContent[l][d].schedules) {
            if (content.value === '') {
              content.value = content.value + schedule.course.name + '\n'
                + this.getRoomsAndWeeksForExcel(smallModelRoomsAndWeeks[l][d][schedule.id]) + '\n'
                + this.getClazzesForExcel(schedule.clazzes) + '\n'
                + schedule.teacher1.name + '、'
                + schedule.teacher2.name;
            } else {
              content.value = content.value + '\n\n' + schedule.course.name + '\n'
                + this.getRoomsAndWeeksForExcel(smallModelRoomsAndWeeks[l][d][schedule.id]) + '\n'
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
