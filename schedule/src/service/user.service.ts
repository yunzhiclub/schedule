import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../entity/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoginCacheKey = 'isLogin';
  private isLogin: BehaviorSubject<boolean>;
  public isLogin$: Observable<boolean>;
  url = 'user';


  protected currentLoginUserSubject = new BehaviorSubject<User | null | undefined>(undefined);
  currentLoginUser$ = this.currentLoginUserSubject.asObservable();

  constructor(private httpClient: HttpClient,
              private router: Router) {
    const isLogin = window.sessionStorage.getItem(this.isLoginCacheKey) as string;
    this.isLogin = new BehaviorSubject(this.convertStringToBoolean(isLogin));
    this.isLogin$ = this.isLogin.asObservable();
    this.initCurrentLoginUser().subscribe();
  }


  login(user: {password: string, username: string}): Observable<User> {
    // 新建Headers，并添加认证信息
    let headers = new HttpHeaders();
    // 添加 content-type
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // 添加认证信息
    headers = headers.append('Authorization',
      'Basic ' + btoa(user.username + ':' + encodeURIComponent(user.password)));
    // 发起get请求并返回
    return this.httpClient.get<User>(`${this.url}/login`, {headers})
      .pipe(tap(data => {
        console.log('登录返回结果', data);
      }));
  }


  setIsLogin(isLogin: boolean): void {
    window.sessionStorage.setItem(this.isLoginCacheKey, this.convertBooleanToString(isLogin));
    this.isLogin.next(isLogin);
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
    if (user !== this.currentLoginUserSubject.value) {
      this.currentLoginUserSubject.next(user);
    }
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
            console.log('initCurrentLoginUser', user);
            this.setCurrentLoginUser(user);
            subscriber.next();
          },
          error: () => {
            console.log('initCurrentLoginUser2', );
            if (callback) {
              callback();
            }
            subscriber.error();
          },
          complete: () => {
            console.log('initCurrentLoginUser3', );

            if (callback) {
              callback();
            }
            subscriber.complete();
          }
        });
    });
  }
}
