import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CourseComponent} from './course.component';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {CourseDetailComponent} from './course-detail/course-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CourseComponent,
    data: {
      title: '首页'
    }
  },
  {
    path: 'courseDetail/:courseId',
    component: CourseDetailComponent,
    data: {
      title: '课程详情'
    }
  },
  {
    path: 'add',
    component: AddComponent,
    data: {
      title: '新增'
    }
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: {
      title: '编辑'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
