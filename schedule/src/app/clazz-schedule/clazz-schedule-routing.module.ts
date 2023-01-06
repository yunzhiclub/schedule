import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ClazzScheduleComponent} from './clazz-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: ClazzScheduleComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClazzScheduleRoutingModule { }
