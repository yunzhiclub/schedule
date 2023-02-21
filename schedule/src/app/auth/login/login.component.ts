import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {UserService} from '../../../service/user.service';
import {first} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginModel = 'username' as 'username' | 'wechat';

  qrCodeSrc: string | undefined;

  // 正在倒计时
  countDowning = false;

  /** 登录表单对象 */
  loginForm: FormGroup;

  /** 错误信息 */
  errorInfo: string | undefined;

  /** 提交状态 */
  submitting = false;

  showValidateCode = false;


  constructor(private builder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private commonService: CommonService) {
    /** 创建登录表单 */
    this.loginForm = this.builder.group({
      username: ['', [Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern('\\d+'),
        Validators.required]],
      password: ['', Validators.required],
      verificationCode: ['0000', Validators.required],
    });
  }

  ngOnInit(): void {
    this.errorInfo = '';
    this.loginForm.valueChanges
      .subscribe(() => {
        this.errorInfo = '';
      });
  }

  onLogin(): void {
    console.log('执行了login方法');
    const user = {
      username: this.loginForm.get('username')!.value as string,
      password: this.loginForm.get('password')!.value as string,
    };
    this.login(user);
  }

  login(user: {username: string, password: string}): void {
    this.userService.login(user)
      .subscribe((data) => {
        if (data) {
          window.sessionStorage.setItem('login', 'true');
          this.userService.initCurrentLoginUser(() => {
            // this.commonService.success(() => this.router.navigateByUrl('/dashboard').then());
            this.router.navigateByUrl('/dashboard').then();
          }).subscribe();
        } else {
          this.commonService.error(() => {}, '登录失败，请检查您填写的信息是否正确');
        }
      }, () => {
        this.errorInfo = '登录失败，请检查您填写的信息是否正确';
      });
  }

  /**
   * 微信扫码登录
   */
  onWeChatLogin(): void {
    this.userService.getLoginQrCode()
      .subscribe(src => {
        this.qrCodeSrc = src;
        this.loginModel = 'wechat';
        this.userService.onScanLoginQrCode$.pipe(first()).subscribe(data => {
          const uuid = data.body;
          this.login({username: uuid, password: uuid});
        });
      });
  }
}
