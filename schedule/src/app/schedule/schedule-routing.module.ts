import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ScheduleComponent} from './schedule.component';
import {AddComponent} from './add/add.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent
  },
  {
    path: 'add',
    component: AddComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
