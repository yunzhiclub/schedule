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
  public generateExcel(Content: { clazzes: Clazz[]; schedules: Schedule[] }[][],
                       RoomsAndWeeks: { rooms: Room[]; weeks: number[] }[][][][],
                       fileTeacherName: string | undefined,
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
    this.worksheet = this.workbook.addWorksheet('File');
    this.getTimetable(Content, RoomsAndWeeks, weekNumber);

    // Generate Excel File
    this.workbook.xlsx.writeBuffer().then((data: BlobPart) => {
      const blob = new Blob([data], {type: EXCEL_TYPE});
      // Given name
      const filename = fileTeacherName + '的课程表';
      FileSaver.saveAs(blob, filename + EXCEL_EXTENSION);
    });
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
  private TimetableExcelInit(weekNumber: number): void {
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
    this.worksheet.getCell('B1').style = {alignment: {wrapText: true, horizontal: 'center'}, font: {bold: true}};
    this.worksheet.getCell('G1').style = {alignment: {wrapText: true, horizontal: 'center'}, font: {bold: true}};
    this.worksheet.getCell('L1').style = {alignment: {wrapText: true, horizontal: 'center'}, font: {bold: true}};
    this.worksheet.getCell('Q1').style = {alignment: {wrapText: true, horizontal: 'center'}, font: {bold: true}};
    this.worksheet.getCell('V1').style = {alignment: {wrapText: true, horizontal: 'center'}, font: {bold: true}};
    this.worksheet.getCell('AA1').style = {alignment: {wrapText: true, horizontal: 'center'}, font: {bold: true}};
    this.worksheet.getCell('AF1').style = {alignment: {wrapText: true, horizontal: 'center'}, font: {bold: true}};
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
    this.worksheet.getCell('A2').style = {alignment: {wrapText: true, vertical: 'middle', horizontal: 'center'}, font: {bold: true}};
    this.worksheet.getCell('B2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('C2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('D2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('E2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('F2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('G2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('H2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('I2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('J2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('K2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('L2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('M2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('N2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('O2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('P2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('Q2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('R2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('S2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('T2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('U2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('V2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('W2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('X2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('Y2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('Z2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('AA2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('AB2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('AC2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('AD2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('AE2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('AF2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('AG2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('AH2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('AI2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    this.worksheet.getCell('AJ2').style = {alignment: {wrapText: true, vertical: 'middle'}, font: {bold: true}};
    // 设置冻结行和列的数量
    this.worksheet.views = [
      {state: 'frozen', xSplit: 1, ySplit: 2}
    ];
    // 设置周数
    for (let i = 1; i <= weekNumber; i++) {
      const cellName = 'A' + (i + 2);
      this.worksheet.getCell(cellName).value = i;
      this.worksheet.getCell(cellName).style = {alignment: {wrapText: true, vertical: 'middle', horizontal: 'center'},
                                                     font: {bold: true, size: 16 }};
    }
  }

  private getTimetable(Content: { clazzes: Clazz[]; schedules: Schedule[] }[][],
                       RoomsAndWeeks: { rooms: Room[]; weeks: number[] }[][][][],
                       weekNumber: number): void {
    // 课程表初始化
    this.TimetableExcelInit(weekNumber);
    // 填充内容
    console.log('bigModelContent', Content);
    for (let l = 0; l < 5; l++) {
      for (let d = 0; d < 7; d++) {
        if (Content[l][d].schedules.length > 0) {
          let cellRow = '';
          let cellCol = '';
          if (l === 0 && d === 0) { cellCol = 'B'; }
          if (l === 1 && d === 0) { cellCol = 'C'; }
          if (l === 2 && d === 0) { cellCol = 'D'; }
          if (l === 3 && d === 0) { cellCol = 'E'; }
          if (l === 4 && d === 0) { cellCol = 'F'; }
          if (l === 0 && d === 1) { cellCol = 'G'; }
          if (l === 1 && d === 1) { cellCol = 'H'; }
          if (l === 2 && d === 1) { cellCol = 'I'; }
          if (l === 3 && d === 1) { cellCol = 'J'; }
          if (l === 4 && d === 1) { cellCol = 'K'; }
          if (l === 0 && d === 2) { cellCol = 'L'; }
          if (l === 1 && d === 2) { cellCol = 'M'; }
          if (l === 2 && d === 2) { cellCol = 'N'; }
          if (l === 3 && d === 2) { cellCol = 'O'; }
          if (l === 4 && d === 2) { cellCol = 'P'; }
          if (l === 0 && d === 3) { cellCol = 'Q'; }
          if (l === 1 && d === 3) { cellCol = 'R'; }
          if (l === 2 && d === 3) { cellCol = 'S'; }
          if (l === 3 && d === 3) { cellCol = 'T'; }
          if (l === 4 && d === 3) { cellCol = 'U'; }
          if (l === 0 && d === 4) { cellCol = 'V'; }
          if (l === 1 && d === 4) { cellCol = 'W'; }
          if (l === 2 && d === 4) { cellCol = 'X'; }
          if (l === 3 && d === 4) { cellCol = 'Y'; }
          if (l === 4 && d === 4) { cellCol = 'Z'; }
          if (l === 0 && d === 5) { cellCol = 'AA'; }
          if (l === 1 && d === 5) { cellCol = 'AB'; }
          if (l === 2 && d === 5) { cellCol = 'AC'; }
          if (l === 3 && d === 5) { cellCol = 'AD'; }
          if (l === 4 && d === 5) { cellCol = 'AE'; }
          if (l === 0 && d === 6) { cellCol = 'AF'; }
          if (l === 1 && d === 6) { cellCol = 'AG'; }
          if (l === 2 && d === 6) { cellCol = 'AH'; }
          if (l === 3 && d === 6) { cellCol = 'AI'; }
          if (l === 4 && d === 6) { cellCol = 'AJ'; }
          for (const schedule of Content[l][d].schedules) {
            // tslint:disable-next-line:prefer-for-of
            for (let x = 0; x < RoomsAndWeeks[l][d][schedule.id].length; x++) {
              for (const week of RoomsAndWeeks[l][d][schedule.id][x].weeks) {
                cellRow = (week + 3).toString();
                const cellName = cellCol + cellRow;
                const content = this.worksheet.getCell(cellName);
                // 设置单元格自动换行、垂直居中
                content.style = {alignment: {wrapText: true, vertical: 'middle'}};
                // content.value = '';
                if (content.value === null) {
                  content.value = schedule.course.name + '\n'
                    + this.getRoomsForExcel(RoomsAndWeeks[l][d][schedule.id][x].rooms) + '\n'
                    + this.getClazzesForExcel(schedule.clazzes) + '\n'
                    + schedule.teacher1.name + '、'
                    + schedule.teacher2.name;
                } else {
                  content.value = content.value + '\n\n' + schedule.course.name + '\n'
                    + this.getRoomsForExcel(RoomsAndWeeks[l][d][schedule.id][x].rooms) + '\n'
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
  }
}
