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
        url: '',
      } as T,
      {
        name: '学期管理',
        url: 'term'
      } as T,
      {
        name: '教师管理',
        url: 'teacher'
      } as T,
      {
        name: '班级管理',
        url: 'clazz'
      } as T,
      {
        name: '学生管理',
        url: 'student'
      } as T,
      {
        name: '教室管理',
        url: 'room'
      } as T,
      {
        name: '课程管理',
        url: 'course'
      } as T,
      {
        name: '排课管理',
        url: 'schedule'
      } as T,
      {
        name: '课程表',
        url: 'timeTable'
      } as T,
      {
        name: '个人中心',
        url: 'personal'
      } as T,
    ];
  }
}

class T {
  name = '';
  icon = '';
  url = '';
}
