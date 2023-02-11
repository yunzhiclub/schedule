import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LayoutComponent} from './part/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        data: {
          title: '首页'
        }
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        data: {
          title: '首页'
        }
      },
      {
        path: 'term',
        loadChildren: () => import('./term/term.module').then(m => m.TermModule),
        data: {
          title: '学期管理'
        }
      },
      {
        path: 'teacher',
        loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule),
        data: {
          title: '教师管理'
        }
      },
      {
        path: 'clazz',
        loadChildren: () => import('./clazz/clazz.module').then(m => m.ClazzModule),
        data: {
          title: '班级管理'
        }
      },
      // {
      //   path: 'student',
      //   loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
      //   data: {
      //     title: '学生管理'
      //   }
      // },
      {
        path: 'room',
        loadChildren: () => import('./room/room.module').then(m => m.RoomModule),
        data: {
          title: '教室管理'
        }
      },
      {
        path: 'course',
        loadChildren: () => import('./course/course.module').then(m => m.CourseModule),
        data: {
          title: '课程管理'
        }
      },
      {
        path: 'schedule',
        loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule),
        data: {
          title: '排课管理'
        }
      },
      {
        path: 'timetable',
        loadChildren: () => import('./timetable/timetable.module').then(m => m.TimetableModule),
        data: {
          title: '课程表'
        }
      },
      {
        path: 'personal',
        loadChildren: () => import('./personal/personal.module').then(m => m.PersonalModule),
        data: {
          title: '个人中心'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
