import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ScheduleComponent} from './schedule.component';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {TableComponent} from './table/table.component';
import {EditClazzesAndTeachersComponent} from './edit/edit-clazzes-and-teachers/edit-clazzes-and-teachers.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent,
    data: {
      title: '首页'
    }
  },
  {
    path: 'add',
    component: AddComponent,
    data: {
      title: '新增排课'
    }
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: {
      title: '编辑时间'
    }
  },
  {
    path: 'timetable/:id',
    component: TableComponent,
    data: {
      title: '课表'
    }
  },
  {
    path: 'edit/:id/editClazzesAndTeachers',
    component: EditClazzesAndTeachersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
