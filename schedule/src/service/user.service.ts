import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {User} from '../entity/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Random} from '../common/utils';
import {WebsocketService} from './websocket.service';
import {WebSocketData} from '../entity/web-socket-data';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoginCacheKey = 'isLogin';
  private isLogin: BehaviorSubject<boolean>;
  public isLogin$: Observable<boolean>;
  url = 'user';

  public currentLoginUser = new User();

  currentLoginUserSubject = new BehaviorSubject<User | null | undefined>(undefined);
  currentLoginUser$ = this.currentLoginUserSubject.asObservable();

  /**
   * 绑定用户二维码
   */
  private onScanBindUserQrCode = new Subject<WebSocketData>();
  public onScanBindUserQrCode$ = this.onScanBindUserQrCode.asObservable() as Observable<WebSocketData>;

  /**
   * 登录二维码
   */
  private onScanLoginQrCode = new Subject<WebSocketData>();
  public onScanLoginQrCode$ = this.onScanLoginQrCode.asObservable() as Observable<WebSocketData>;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private websocketServer: WebsocketService) {
    const isLogin = window.sessionStorage.getItem(this.isLoginCacheKey) as string;
    this.isLogin = new BehaviorSubject(this.convertStringToBoolean(isLogin));
    this.isLogin$ = this.isLogin.asObservable();
    this.websocketServer.autowiredUserService(this);
    // 订阅的时候需要有user打头
    this.websocketServer.register('/user/stomp/scanBindUserQrCode', this.onScanBindUserQrCode);
    this.websocketServer.register('/user/stomp/scanLoginQrCode', this.onScanLoginQrCode);
  }


  login(user: { password: string, username: string }): Observable<User> {
    // 新建Headers，并添加认证信息
    let headers = new HttpHeaders();
    // 添加 content-type
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // 添加认证信息
    headers = headers.append('Authorization',
      'Basic ' + btoa(user.username + ':' + encodeURIComponent(user.password)));
    // 发起get请求并返回
    return this.httpClient.get<User>(`${this.url}/login`, {headers})
      .pipe(tap(data => this.setCurrentLoginUser(data)));
  }


  /**
   * 字符串转换为boolean
   * @param value 字符串
   * @return 1 true; 其它 false
   */
  convertStringToBoolean(value: string): boolean {
    return value === '1';
  }

  /**
   * boolean转string
   * @param value boolean
   * @return '1' true; '0' false;
   */
  convertBooleanToString(value: boolean): string {
    return value ? '1' : '0';
  }

  /**
   * 设置当前登录用户
   * @param user 登录用户
   */
  setCurrentLoginUser(user: User | undefined): void {
    this.currentLoginUserSubject.next(user);
    if (user === undefined) {
      this.router.navigateByUrl('/login').then();
    }
  }

  /**
   * 请求当前登录用户
   */
  initCurrentLoginUser(callback?: () => void): Observable<User> {
    return new Observable<User>(subscriber => {
      this.httpClient.get<User>(`${this.url}/me`)
        .subscribe({
          next: (user: User) => {
            this.setCurrentLoginUser(user);
            subscriber.next();
          },
          error: () => {
            console.log('initCurrentLoginUser2');
            if (callback) {
              callback();
            }
            subscriber.error();
          },
          complete: () => {
            console.log('initCurrentLoginUser3');
            if (callback) {
              callback();
            }
            subscriber.complete();
          }
        });
    });
  }

  /**
   * 获取当前登录用户
   */
  getCurrentLoginUser$(): Observable<User | null | undefined> {
    return this.currentLoginUser$;
  }

  /**
   * 为个人主页获取当前登录用户
   */
  getCurrentLoginUser(): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/me`);
  }

  /**
   * 获取登录二维码
   */
  getLoginQrCode(): Observable<string> {
    return this.httpClient.get<string>(`${this.url}/getLoginQrCode/${this.websocketServer.uuid}`);
  }

  /**
   * 生成绑定的二维码
   */
  generateBindQrCode(): Observable<string> {
    return this.httpClient.get<string>(`${this.url}/generateBindQrCode`);
  }


  /**
   * 更新用户
   * @param userId 教师id
   * @param data 更新后的教师数据
   */
  update(userId: number, data: { name: string }): Observable<User> {
    return this.httpClient.post<User>(`${this.url}/update/` + userId.toString(), data);
  }

  logout(): Observable<void> {
    return this.httpClient.get<void>(`${this.url}/logout`).pipe(map(() => {
      this.setCurrentLoginUser(undefined);
    }));
  }

  /**
   * 验证原密码是否正确
   */
  public oldPasswordValidator(): AsyncValidatorFn {
    return (ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.checkPasswordIsRight(ctrl.value)
        .pipe(tap((value) => console.log('oldPasswordValidator', value)))
        .pipe(map((isRight: boolean) => (isRight ? null : {passwordError: true})),
          catchError(async () => null));
    };
  }

  /**
   * 校验密码是否正确
   * @param oldPassword 密码
   */
  public checkPasswordIsRight(oldPassword: string): Observable<boolean> {
    const vUser = {password: oldPassword};
    return this.httpClient.post<boolean>(this.url + '/checkPasswordIsRight', vUser);
  }

  /**
   * 校验新密码与校验密码是否相同
   * @param control 表单
   */
  public confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword')?.value;
    const confirmNewPassword = control.get('confirmNewPassword')?.value;

    // 判断确认密码与新密码是否相同
    if (newPassword && confirmNewPassword) {
      return newPassword !== confirmNewPassword ? {confirmPasswordError: true} : null;
    }
    return null;
  };

  /**
   * 登录用户修改密码
   * @param newPassword 新密码
   * @param oldPassword 旧密码
   */
  public updatePassword(newPassword: string, oldPassword: string): Observable<void> {
    const vUser = {password: oldPassword, newPassword: encodeURIComponent(newPassword)};
    return this.httpClient.put<void>(this.url + '/updatePassword', vUser);
  }
}
