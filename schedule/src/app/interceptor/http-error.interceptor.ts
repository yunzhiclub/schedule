import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {CommonService} from '../../service/common.service';
import {UserService} from '../../service/user.service';
import {Router} from "@angular/router";

/**
 * HTTP请求错误拦截器.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  public static DONT_INTERCEPT_HEADER_KEY = 'http-error-do-not-intercept';

  constructor(private readonly injector: Injector,
              private commonService: CommonService,
              private router: Router) {
  }

  showError(error: HttpErrorResponse, messagePrefix: string): void {
    let title = error.status + ' ' + messagePrefix;
    if (error.error && typeof error.error.message !== 'undefined') {
      title = error.error.message;
    }

    const description = error.url + '   ' + title + '。如有问题请联系开发者(微信同号): 13920618851';
    this.commonService.error(() => {}, description, messagePrefix);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('wwwwwww', req.headers);
    if ('true' === req.headers.get(HttpErrorInterceptor.DONT_INTERCEPT_HEADER_KEY)) {
      return next.handle(req);
    } else {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleHttpException(error);
        }));
    }
  }

  /**
   * 处理异常
   * @param error 异常
   */
  private handleHttpException(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    console.log(this.router.url);
    switch (error.status) {
      case 401:
        const userService = this.injector.get(UserService);
        userService.setCurrentLoginUser(undefined);
        if (this.router.url !== '/login') {
          this.commonService.info(() => {
            this.router.navigateByUrl('/login');
          }, '请先进行登录', '登录过期或失败');
        }
        break;
      case 400:
        this.showError(error, '请求参数错误');
        break;
      case 403:
        this.showError(error, '您无此操作权限');
        break;
      case 404:
        this.showError(error, '资源未找到');
        break;
      case 405:
        this.showError(error, '方法不支持');
        break;
      case 500:
        this.showError(error, '服务器逻辑错误');
        break;
      case 502:
        this.showError(error, '服务器宕机');
        break;
      case 0:
        this.showError(error, '网络错误');
        break;
      default:
        this.showError(error, '未知错误。');
        break;
    }

    return throwError(error);
  }
}
