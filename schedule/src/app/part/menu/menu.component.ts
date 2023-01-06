import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menus: any;

  constructor() { }

  ngOnInit(): void {
    this.menus = [
      {
        name: '首页',
      },
      {
        name: '学期管理',
      },
      {
        name: '教师管理',
      },
      {
        name: '班级管理',
      },
      {
        name: '学生管理',
      },
      {
        name: '教室管理',
      },
      {
        name: '课程管理',
      },
      {
        name: '排课管理',
      },
      {
        name: '课程表',
      },
      {
        name: '个人中心',
      },
    ];
  }

}
