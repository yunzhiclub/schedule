import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menus = [] as T[];

  constructor() { }

  ngOnInit(): void {
    this.menus = [
      {
        name: '首页',
      } as T,
      {
        name: '学期管理',
      } as T,
      {
        name: '教师管理',
      } as T,
      {
        name: '班级管理',
      } as T,
      {
        name: '学生管理',
      } as T,
      {
        name: '教室管理',
      } as T,
      {
        name: '课程管理',
      } as T,
      {
        name: '排课管理',
      } as T,
      {
        name: '课程表',
      } as T,
      {
        name: '个人中心',
      } as T,
    ];
  }
}

class T {
  name = '';
  icon = '';
  url = '';
}
