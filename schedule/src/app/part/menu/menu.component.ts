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
        url: '',
      },
      {
        name: '学期管理',
        url: 'term'
      },
      {
        name: '教师管理',
        url: 'teacher'
      },
      {
        name: '班级管理',
        url: 'clazz'
      },
      {
        name: '学生管理',
        url: 'student'
      },
      {
        name: '教室管理',
        url: 'room'
      },
      {
        name: '课程管理',
        url: 'course'
      },
      {
        name: '排课管理',
        url: 'schedule'
      },
      {
        name: '课程表',
        url: 'clazzSchedule'
      },
      {
        name: '个人中心',
        url: 'personal'
      },
    ];
  }

}
