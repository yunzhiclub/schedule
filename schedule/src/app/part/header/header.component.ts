import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';
import {UserService} from '../../../service/user.service';
import {CommonService} from '../../../service/common.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username = '';
  title = environment.title;

  constructor( private userService: UserService,
               private commonService: CommonService,
               private router: Router) { }

  ngOnInit(): void {
    this.userService.currentLoginUser$.subscribe((user) => {
      this.username = user?.name!;
    });
  }
  a(): void {
    window.location.reload();
  }

  logout(): void {
    console.log('logout is called');
    this.userService.logout()
      .subscribe(() => {
        window.sessionStorage.removeItem('login');
        this.router.navigateByUrl('/login').then();
        // this.commonService.success(() => {
        //   this.router.navigateByUrl('/login').then();
        //   }, '' , '已注销');
      },
        () => {
          this.commonService.error(() => {
            this.router.navigateByUrl('/login').then();
            }, '' , '注销失败');
        });
  }
}
