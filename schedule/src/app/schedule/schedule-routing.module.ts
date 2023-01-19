import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ScheduleComponent} from './schedule.component';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {EditClazzesAndTeachersComponent} from './edit/edit-clazzes-and-teachers/edit-clazzes-and-teachers.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent
  },
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: 'edit/:id',
    component: EditComponent
  },
  {
    path: 'edit/:id/editClazzesAndTeachers',
    component: EditClazzesAndTeachersComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
