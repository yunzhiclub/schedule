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
  public generateExcel(bigModelContent: { rooms: Room[]; weeks: number[];
                                          clazzes: Clazz[]; schedules: Schedule[] }[][],
                       bigModelRoomsAndWeeks: { rooms: Room[]; weeks: number[] }[][][][]) {
    // Create workbook and worksheet
    this.workbook = new Excel.Workbook();

    // Set Workbook Properties
    this.workbook.creator = 'Web';
    this.workbook.lastModifiedBy = 'Web';
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
    this.workbook.lastPrinted = new Date();

    // Add a Worksheet
    this.worksheet = this.workbook.addWorksheet('File');

    // Title
    const title = 'Excel file example';
    // 课程表初始化
    this.timetableExcelInit();
    // 填充内容
    // [0][0] => B2; [0][1] => D2; [0][2] => F2; [0][3] => H2; [0][4] => J2; [0][5] => L2; [0][6] => N2
    // [1][0] => B8; [1][1] => D8; [1][2] => F8; [1][3] => H8; [1][4] => J8; [1][5] => L8; [1][6] => N8
    // [2][0] => B14; [2][1] => D14; [2][2] => F14; [2][3] => H14; [2][4] => J14; [2][5] => L14; [2][6] => N14
    // [3][0] => B20; [3][1] => D20; [3][2] => F20; [3][3] => H20; [3][4] => J20; [3][5] => L20; [3][6] => N20
    // [4][0] => B26; [4][1] => D26; [4][2] => F26; [4][3] => H26; [4][4] => J26; [4][5] => L26; [4][6] => N26
    console.log('bigModelContent', bigModelContent);
    for (let l = 0; l < 5; l++) {
      for (let d = 0; d < 7; d++) {
        if (bigModelContent[l][d].schedules.length > 0) {
          let cellRow = '';
          let cellCol = '';
          if (l === 0) { cellRow = '2'; }
          if (l === 1) { cellRow = '8'; }
          if (l === 2) { cellRow = '14'; }
          if (l === 3) { cellRow = '20'; }
          if (l === 4) { cellRow = '26'; }
          if (d === 0) { cellCol = 'B'; }
          if (d === 1) { cellCol = 'D'; }
          if (d === 2) { cellCol = 'F'; }
          if (d === 3) { cellCol = 'H'; }
          if (d === 4) { cellCol = 'J'; }
          if (d === 5) { cellCol = 'L'; }
          if (d === 6) { cellCol = 'N'; }
          const cellName = cellCol + cellRow;
          this.worksheet.getCell(cellName).value = bigModelContent[l][d].schedules[0].course.name + '\n'
            + this.getWeeksForExcel(bigModelRoomsAndWeeks[l][d][bigModelContent[l][d].schedules[0].id][0].weeks) + '\n'
            + this.getRoomsForExcel(bigModelRoomsAndWeeks[l][d][bigModelContent[l][d].schedules[0].id][0].rooms) + '\n'
            + bigModelContent[l][d].schedules[0].clazzes[0].name + '\n'
            + bigModelContent[l][d].schedules[0].teacher1.name + '、'
            + bigModelContent[l][d].schedules[0].teacher2.name;
        }
      }
    }

    // Generate Excel File
    this.workbook.xlsx.writeBuffer().then((data: BlobPart) => {
      const blob = new Blob([data], {type: EXCEL_TYPE});
      // Given name
      const filename = '课程表';
      FileSaver.saveAs(blob, filename + EXCEL_EXTENSION);
    });
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
    let result = '';
    const minWeeks = this.arrayMin(weeks);
    const maxWeeks = this.arrayMax(weeks);
    if (this.isArrayContinuous(weeks, minWeeks, maxWeeks)) {
      return (minWeeks + 1) + '-' + (maxWeeks + 1) + '周';
    }
    for (let i = minWeeks; i <= maxWeeks; i++) {
      if (!this.isArrayContinuous(weeks, minWeeks, i)) {
        result = (minWeeks + 1) + '-' + i;
        break;
      }
    }
    return result + '周';
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
  private timetableExcelInit(): void {
    const rowValues = [];
    rowValues[1] = '天/节';
    rowValues[2] = '周一';
    rowValues[4] = '周二';
    rowValues[6] = '周三';
    rowValues[8] = '周四';
    rowValues[10] = '周五';
    rowValues[12] = '周六';
    rowValues[14] = '周日';
    this.worksheet.addRow(rowValues);
    const rows = [
      ['第一大节'], [], [], [], [], [],
      ['第二大节'], [], [], [], [], [],
      ['第三大节'], [], [], [], [], [],
      ['第四大节'], [], [], [], [], [],
      ['第五大节'], [], [], [], [], [],
    ];
    this.worksheet.addRows(rows);
    this.worksheet.mergeCells('B1:C1');
    this.worksheet.mergeCells('D1:E1');
    this.worksheet.mergeCells('F1:G1');
    this.worksheet.mergeCells('H1:I1');
    this.worksheet.mergeCells('J1:K1');
    this.worksheet.mergeCells('L1:M1');
    this.worksheet.mergeCells('N1:O1');

    this.worksheet.mergeCells('A2', 'A7');
    this.worksheet.mergeCells('A8', 'A13');
    this.worksheet.mergeCells('A14', 'A19');
    this.worksheet.mergeCells('A20', 'A25');
    this.worksheet.mergeCells('A26', 'A31');

    this.worksheet.mergeCells('B2', 'C7');
    this.worksheet.mergeCells('D2', 'E7');
    this.worksheet.mergeCells('F2', 'G7');
    this.worksheet.mergeCells('H2', 'I7');
    this.worksheet.mergeCells('J2', 'K7');
    this.worksheet.mergeCells('L2', 'M7');
    this.worksheet.mergeCells('N2', 'O7');

    this.worksheet.mergeCells('B8', 'C13');
    this.worksheet.mergeCells('D8', 'E13');
    this.worksheet.mergeCells('F8', 'G13');
    this.worksheet.mergeCells('H8', 'I13');
    this.worksheet.mergeCells('J8', 'K13');
    this.worksheet.mergeCells('L8', 'M13');
    this.worksheet.mergeCells('N8', 'O13');

    this.worksheet.mergeCells('B14', 'C19');
    this.worksheet.mergeCells('D14', 'E19');
    this.worksheet.mergeCells('F14', 'G19');
    this.worksheet.mergeCells('H14', 'I19');
    this.worksheet.mergeCells('J14', 'K19');
    this.worksheet.mergeCells('L14', 'M19');
    this.worksheet.mergeCells('N14', 'O19');

    this.worksheet.mergeCells('B20', 'C25');
    this.worksheet.mergeCells('D20', 'E25');
    this.worksheet.mergeCells('F20', 'G25');
    this.worksheet.mergeCells('H20', 'I25');
    this.worksheet.mergeCells('J20', 'K25');
    this.worksheet.mergeCells('L20', 'M25');
    this.worksheet.mergeCells('N20', 'O25');

    this.worksheet.mergeCells('B26', 'C31');
    this.worksheet.mergeCells('D26', 'E31');
    this.worksheet.mergeCells('F26', 'G31');
    this.worksheet.mergeCells('H26', 'I31');
    this.worksheet.mergeCells('J26', 'K31');
    this.worksheet.mergeCells('L26', 'M31');
    this.worksheet.mergeCells('N26', 'O31');
  }
}
