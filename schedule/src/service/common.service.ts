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

@Injectable({
  providedIn: 'root'
})
export class CommonService {
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
}
