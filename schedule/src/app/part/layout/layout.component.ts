import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../../service/common.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(private commonService: CommonService,
              private router: Router) { }

  ngOnInit(): void {
    if (window.sessionStorage.getItem('login') !== 'true') {
      this.commonService.error(() => {
        this.router.navigateByUrl('/login');
      }, '请重新登录', '已登出');
    }
  }

}
