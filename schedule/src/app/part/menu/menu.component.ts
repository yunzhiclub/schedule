import { Component, OnInit } from '@angular/core';
import {BaseMenu} from '../../../common/base-menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menus = [] as BaseMenu[];

  constructor() { }

  ngOnInit(): void {
    this.menus = [
      {
        name: '首页',
        url: '',
      } as BaseMenu,
      {
        name: '学期管理',
        url: 'term'
      } as BaseMenu,
      {
        name: '教师管理',
        url: 'teacher'
      } as BaseMenu,
      {
        name: '班级管理',
        url: 'clazz'
      } as BaseMenu,
      {
        name: '学生管理',
        url: 'student'
      } as BaseMenu,
      {
        name: '教室管理',
        url: 'room'
      } as BaseMenu,
      {
        name: '课程管理',
        url: 'course'
      } as BaseMenu,
      {
        name: '排课管理',
        url: 'schedule'
      } as BaseMenu,
      {
        name: '课程表',
        url: 'timetable'
      } as BaseMenu,
      {
        name: '个人中心',
        url: 'personal'
      } as BaseMenu,
    ];
  }
}
